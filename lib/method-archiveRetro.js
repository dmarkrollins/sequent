import { Meteor } from 'meteor/meteor'
import { Retros, RetroActions } from './sequent'
import { Schemas } from './schemas'
import { Constants } from './constants'
import { Logger } from './logger'

Meteor.methods({

    archiveRetro(retroId) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

        const retro = Retros.findOne({
            _id: retroId,
            createdBy: this.userId
        })

        // need to see if there is
        if (!retro) {
            throw new Meteor.Error('not-found', 'Retro could not be found!')
        }

        if (retro.status === Constants.RetroStatuses.ARCHIVED) {
            throw new Meteor.Error('already-archived', 'Retro was already archived!')
        }

        try {
            Retros.update(
                { _id: retro._id },
                {
                    $set:
                    {
                        status: Constants.RetroStatuses.ARCHIVED,
                        archivedAt: new Date()
                    }
                }
            )
        } catch (err) {
            Logger.log(err)
            throw new Meteor.Error('update-failed', 'We could not archive the retro - please try again later')
        }
    }

})
