import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { Retros, RetroActions } from '../lib/sequent'
import { Schemas } from './schemas'
import { Constants } from './constants'
import { Logger } from './logger'

Meteor.methods({

    toggleAction(actionId) {
        const retroId = ''

        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

        const action = RetroActions.findOne({ _id: actionId, createdBy: this.userId })

        if (!action) {
            throw new Meteor.Error('not-found', 'RetroAction not found!')
        }

        const newValue = action.status === Constants.RetroItemStatuses.PENDING ? Constants.RetroItemStatuses.COMPLETE : Constants.RetroItemStatuses.PENDING

        let newDate

        if (newValue === Constants.RetroItemStatuses.COMPLETE) {
            newDate = new Date()
        } else {
            newDate = null
        }


        try {
            RetroActions.update(
                { _id: actionId },
                {
                    $set:
                    {
                        status: newValue,
                        completedAt: newDate
                    }
                }
            )
        } catch (err) {
            Logger.log(err)
            return new Meteor.Error('delete-failed', 'We could not delete the action - please try again later')
        }
    }

})
