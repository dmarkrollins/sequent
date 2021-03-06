import { Meteor } from 'meteor/meteor'
import { Retros, RetroActions } from './sequent'
import { Schemas } from './schemas'
import { Constants } from './constants'
import { Logger } from './logger'

Meteor.methods({

    toggleShowCompleted() {
        const retroId = ''

        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

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

        const show = !retro.showCompleted

        try {
            Retros.update(
                {
                    _id: retro._id
                },
                {
                    $set:
                    {
                        showCompleted: show
                    }
                }
            )
        } catch (err) {
            Logger.log(err)
            throw new Meteor.Error('update-failed', 'We could toggle retro show completed - please try again later')
        }
    }

})
