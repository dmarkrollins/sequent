import { Meteor } from 'meteor/meteor'
import { Retros, RetroActions } from '../lib/sequent'
import { Schemas } from './schemas'
import { Constants } from './constants'
import { Logger } from './logger'

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

        try {
            RetroActions.update(
                { _id: actionId },
                {
                    $set:
                    {
                        title: title
                    }
                }
            )
        } catch (err) {
            Logger.log(err)
            throw new Meteor.Error('delete-failed', 'We could not delete the action - please try again later')
        }
    }

})