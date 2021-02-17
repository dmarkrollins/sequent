import { Meteor } from 'meteor/meteor'
import { Retros } from '../lib/sequent'
import { Constants } from '../lib/constants'
import { Logger } from '../lib/logger'

Meteor.methods({

    clearRetroBoard(retroId, name) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

        const retro = Retros.findOne({
            _id: retroId,
            createdBy: this.userId
        })

        if (!retro) {
            throw new Meteor.Error('not-found', 'Retro could not be found!')
        }

        if (retro.status === Constants.RetroStatuses.ARCHIVED) {
            throw new Meteor.Error('already-archived', 'Retro is archived and cannot be cleared!')
        }

        try {
            Retros.update(
                { _id: retro._id },
                {
                    $set:
                    {
                        items: []
                    }
                }
            )
        } catch (err) {
            Logger.log(err)
            throw new Meteor.Error('update-failed', 'We could not clear this retro board - please try again later.')
        }
    }

})
