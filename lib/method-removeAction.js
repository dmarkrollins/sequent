import { Meteor } from 'meteor/meteor'
import { Retros, RetroActions } from './sequent'
import { Schemas } from './schemas'
import { Constants } from './constants'
import { Logger } from './logger'

Meteor.methods({

    removeAction(actionId) {
        const retroId = ''

        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

        const action = RetroActions.findOne({ _id: actionId, createdBy: this.userId })

        if (!action) {
            throw new Meteor.Error('not-found', 'Action not found!')
        }
        try {
            RetroActions.remove({ _id: actionId })
        } catch (err) {
            Logger.log(err)
            return new Meteor.Error('delete-failed', 'We could not delete the action - please try again later')
        }
    }

})
