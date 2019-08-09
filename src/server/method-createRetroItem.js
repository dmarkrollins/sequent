import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { _ } from 'meteor/underscore'
import { Retros } from '../lib/sequent'
import { Schemas } from '../lib/schemas'
import { Constants } from '../lib/constants'
import { Logger } from '../lib/logger'
import cleanInput from './cleanInput'

Meteor.methods({

    createRetroItem(title, itemType) {
        let retroId = ''

        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

        const newTitle = cleanInput(title)

        if (newTitle === '') {
            throw new Meteor.Error('title-required', 'Invalid retro item! HTML Tags not allowed.')
        }

        // if there are no active retros for this user create one
        let retro = Retros.findOne({
            createdBy: this.userId,
            status: Constants.RetroStatuses.ACTIVE
        })

        if (!retro) {
            const retroDoc = {}
            retroDoc.status = Constants.RetroStatuses.ACTIVE
            retroDoc.items = []

            retroId = Retros.insert(retroDoc)

            retro = Retros.findOne({ _id: retroId })
        } else {
            retroId = retro._id
        }

        const doc = {}
        doc.itemId = Random.id()
        doc.title = newTitle
        doc.itemType = itemType
        doc.status = Constants.RetroItemStatuses.PENDING
        doc.votes = 0
        doc.createdAt = new Date()

        if (!_.isArray(retro.items)) {
            retro.items = []
        }

        // retro.items.push(doc)

        try {
            Retros.update(
                { _id: retroId },
                {
                    $push: {
                        items: doc
                    }
                }
            )
            return retroId
        } catch (err) {
            Logger.log(err)
            throw new Meteor.Error('insert-failed', 'We could not add retro item to the retro - please try again later')
        }
    }

})
