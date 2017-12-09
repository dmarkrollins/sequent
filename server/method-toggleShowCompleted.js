import { Meteor } from 'meteor/meteor'
import { Retros, RetroActions } from '../lib/sequent'
import { Schemas } from '../lib/schemas'
import { Constants } from '../lib/constants'
import { Random } from 'meteor/random'

Meteor.methods({
    
    toggleShowCompleted() {
        
        let retroId = ''
        
        if(!this.userId){
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board.')
        }
                
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
                
        const show = retro.showCompleted ? false : true
                
        try {
            Retros.update({ _id: retro._id }, { $set: { showCompleted: show }})
        }
        catch(err) {
            console.log(err)
            return new Meteor.Error('update-failed', 'We could toggle retro show completed - please try again later')
        }
        
    }
    
})