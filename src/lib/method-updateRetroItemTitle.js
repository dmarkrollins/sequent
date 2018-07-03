import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Retros } from './sequent'
import { Schemas } from './schemas'
import { Constants } from './constants'
import { Logger } from './logger'

Meteor.methods({

    updateRetroItemTitle(itemId, title) {
        const retroId = ''

        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

        const retro = Retros.findOne({
            createdBy: this.userId,
            $or: [
                { status: Constants.RetroStatuses.ACTIVE },
                { status: Constants.RetroStatuses.FROZEN },
            ],
        })

        // need to see if there is
        if (!retro) {
            throw new Meteor.Error('not-found', 'Retro not found!')
        }

        const retroItem = _.filter(retro.items, function (item) {
            return item.itemId === itemId
        })

        if (retroItem.length === 0) {
            throw new Meteor.Error('not-found', 'Retro Item not found!')
        }

        let voteCount = retroItem[0].votes || 0

        voteCount += 1

        try {
            Retros.update(
                {
                    _id: retro._id,
                    'items.itemId': itemId
                },
                {
                    $set: {
                        'items.$.title': title
                    }
                }
            )
        } catch (err) {
            Logger.log(err)
            throw new Meteor.Error('update-failed', 'We could not update the retro item - please try again later')
        }
    }

})
