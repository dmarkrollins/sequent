import { Meteor } from 'meteor/meteor'
import { Retros, RetroActions } from '../lib/sequent'
import { Schemas } from '../lib/schemas'
import { Constants } from '../lib/constants'
import { Random } from 'meteor/random'

Meteor.methods({
    
    archiveRetro(retroId) {
        
        
        if(!this.userId){
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board.')
        }
        
        // validate item type
        
        let retro = Retros.findOne({ 
            _id: retroId,
            createdBy: this.userId
        })
        
        // need to see if there is 
        if(!retro) {
            return
        }
        
        if(retro.status === Constants.RetroStatuses.ARCHIVED){
            return
        }
                        
        try {
            Retros.update({ _id: retro._id }, { $set: { status: Constants.RetroStatuses.ARCHIVED }})
        }
        catch(err) {
            console.log(err)
            return new Meteor.Error('update-failed', 'We could not archive the retro - please try again later')
        }
        
    }
    
})