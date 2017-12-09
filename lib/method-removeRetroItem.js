import { Meteor } from 'meteor/meteor'
import { Retros } from './sequent'
import { Schemas } from './schemas'
import { Constants } from './constants'
import { Random } from 'meteor/random'

Meteor.methods({
    
    removeRetroItem(itemId) {
        
        let retroId = ''
        
        if(!this.userId){
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board.')
        }
        
        // validate item type
        
        let retro = Retros.findOne({ 
            createdBy: this.userId, 
            $or: [
                { status: Constants.RetroStatuses.ACTIVE },
                { status: Constants.RetroStatuses.FROZEN }
            ]
        })
        
        // need to see if there is 
        if(!retro) {
            throw new Meteor.Error('not-found', 'Retro not found')
        }
        
        
        try {
            Retros.update(
                {
                    _id: retro._id, 
                    'items.itemId' : itemId
                }, 
                {
                    $set: {
                        'items.$.status' : Constants.RetroItemStatuses.COMPLETE
                    }
                }
            )
        }
        catch(err) {
            console.log(err)
            return new Meteor.Error('insert-failed', 'We could not add retro item to the retro - please try again later')
        }
        
    }
    
})