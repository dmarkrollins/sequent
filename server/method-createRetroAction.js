import { Meteor } from 'meteor/meteor'
import { Retros, RetroActions } from '../lib/sequent'
import { Schemas } from '../lib/schemas'
import { Constants } from '../lib/constants'
import { Random } from 'meteor/random'

Meteor.methods({
    
    createRetroAction(title) {
        
        let retroId = ''
        
        if(!this.userId){
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board.')
        }
        
        // validate item type
        
        let retro = Retros.findOne({ 
            createdBy: this.userId, 
            status: Constants.RetroStatuses.ACTIVE 
        })
        
        // need to see if there is 
        if(!retro) {
            const retroDoc = {}
            retroDoc.status = Constants.RetroStatuses.ACTIVE
            retroDoc.items = []
            
            retroId = Retros.insert(retroDoc)   
            
            retro = Retros.findOne({_id: retroId})
        }
        else {
            retroId = retro._id
        }
        
        const action = {}
        action.title = title
        action.status = Constants.RetroItemStatuses.PENDING
                
        try {
            const actionId = RetroActions.insert(action)
            return actionId
        }
        catch(err) {
            console.log(err)
            return new Meteor.Error('insert-failed', 'We could not add retro item to the retro - please try again later')
        }
        
    }
    
})