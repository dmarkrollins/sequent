import { Meteor } from 'meteor/meteor'
import { Retros, RetroActions } from '../lib/sequent'
import { Schemas } from '../lib/schemas'
import { Constants } from '../lib/constants'
import { Random } from 'meteor/random'

Meteor.methods({
    
    toggleRetroFrozen() {
        
        let retroId = ''
        
        if(!this.userId){
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board.')
        }
        
        // validate item type
        
        let retro = Retros.findOne({ 
            createdBy: this.userId,
            $or: 
            [
                { status: Constants.RetroStatuses.ACTIVE },
                { status: Constants.RetroStatuses.FROZEN }
            ]
        })
        
        // need to see if there is 
        if(!retro) {
            return
        }
        
        if(retro.status === Constants.RetroStatuses.ARCHIVED){
            return
        }
        
        const newStatus = retro.status === Constants.RetroStatuses.FROZEN ? Constants.RetroStatuses.ACTIVE : Constants.RetroStatuses.FROZEN
                
        try {
            Retros.update({ _id: retro._id }, { $set: { status: newStatus }})
        }
        catch(err) {
            console.log(err)
            return new Meteor.Error('update-failed', 'We could not freeze the retro - please try again later')
        }
        
    }
    
})