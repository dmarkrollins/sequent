import { Meteor } from 'meteor/meteor'
import { Retros, RetroActions } from './sequent'
import { Schemas } from './schemas'
import { Constants } from './constants'
import { Logger } from './logger'

Meteor.methods({

    toggleRetroFrozen() {
        const retroId = ''

        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

        // validate item type

        const retro = Retros.findOne({
            createdBy: this.userId,
            $or:
            [
                { status: Constants.RetroStatuses.ACTIVE },
                { status: Constants.RetroStatuses.FROZEN }
            ]
        })

        // need to see if there is
        if (!retro) {
            throw new Meteor.Error('not-found', 'Retro not found!')
        }

        if (retro.status === Constants.RetroStatuses.ARCHIVED) {
            throw new Meteor.Error('invalid-state', 'Retro must not be archived!')
        }

        const newStatus = retro.status === Constants.RetroStatuses.FROZEN ? Constants.RetroStatuses.ACTIVE : Constants.RetroStatuses.FROZEN

        try {
            Retros.update(
                { _id: retro._id },
                {
                    $set:
                    { status: newStatus }
                }
            )
        } catch (err) {
            Logger.log(err)
            throw new Meteor.Error('update-failed', 'We could not freeze the retro - please try again later')
        }
    }

})
