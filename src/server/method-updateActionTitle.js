import { Meteor } from 'meteor/meteor'
import { Retros, RetroActions } from '../lib/sequent'
import { Schemas } from '../lib/schemas'
import { Constants } from '../lib/constants'
import { Logger } from '../lib/logger'
import cleanInput from './cleanInput'

Meteor.methods({

    updateActionTitle(actionId, title) {
        const retroId = ''

        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

        const action = RetroActions.findOne({ _id: actionId, createdBy: this.userId })

        if (!action) {
            throw new Meteor.Error('not-found', 'RetroAction not found!')
        }

        const newTitle = cleanInput(title)

        if (newTitle !== title) {
            throw new Meteor.Error('invalid-title', 'Invalid action! HTML tags not allowed.')
        }

        try {
            RetroActions.update(
                { _id: actionId },
                {
                    $set:
                    {
                        title: newTitle
                    }
                }
            )
        } catch (err) {
            Logger.log(err)
            throw new Meteor.Error('delete-failed', 'We could not delete the action - please try again later')
        }
    }

})
