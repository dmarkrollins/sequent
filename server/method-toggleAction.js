import { Meteor } from 'meteor/meteor'
import { Retros, RetroActions } from '../lib/sequent'
import { Schemas } from '../lib/schemas'
import { Constants } from '../lib/constants'
import { Random } from 'meteor/random'

Meteor.methods({
    
    toggleAction(actionId) {
        
        let retroId = ''
        
        if(!this.userId){
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board.')
        }
                
        let action = RetroActions.findOne({ _id: actionId, createdBy: this.userId })
        
        if(!action) {
            return
        }
        
        const newValue = action.status === Constants.RetroItemStatuses.PENDING ? Constants.RetroItemStatuses.COMPLETE : Constants.RetroItemStatuses.PENDING
        
        let newDate
        
        if (newValue === Constants.RetroItemStatuses.COMPLETE){
            newDate = new Date()
        }
        else {
            newDate = null
        }
        
        
        try {
            RetroActions.update({ _id: actionId }, { $set: { status: newValue, completedAt: newDate  }})
        }
        catch(err) {
            console.log(err)
            return new Meteor.Error('delete-failed', 'We could not delete the action - please try again later')
        }
    }
    
})