import { Meteor } from 'meteor/meteor'
import { Retros, RetroActions } from '../lib/sequent'
import { Schemas } from '../lib/schemas'
import { Constants } from '../lib/constants'
import { Logger } from '../lib/logger'
import cleanInput from './cleanInput'

Meteor.methods({

    createRetroAction(title) {
        const retroId = ''

        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

        const action = {}
        action.title = cleanInput(title)

        action.status = Constants.RetroItemStatuses.PENDING

        if (action.title === '') {
            throw new Meteor.Error('title-required', 'Invalid action item! HTML Tags not allowed.')
        }

        try {
            const actionId = RetroActions.insert(action)
            return actionId
        } catch (err) {
            Logger.log(err)
            throw new Meteor.Error('insert-failed', 'We could not add retro item to the retro - please try again later')
        }
    }

})
