import { Meteor } from 'meteor/meteor'
import { Retros, RetroActions } from './sequent'
import { Schemas } from './schemas'
import { Constants } from './constants'
import { Logger } from './logger'

Meteor.methods({

    createRetroAction(title) {
        const retroId = ''

        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

        const action = {}
        action.title = title
        action.status = Constants.RetroItemStatuses.PENDING

        try {
            const actionId = RetroActions.insert(action)
            return actionId
        } catch (err) {
            Logger.log(err)
            throw new Meteor.Error('insert-failed', 'We could not add retro item to the retro - please try again later')
        }
    }

})
