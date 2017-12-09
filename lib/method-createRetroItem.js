import { Meteor } from 'meteor/meteor'
import { Retros } from './sequent'
import { Schemas } from './schemas'
import { Constants } from './constants'
import { Random } from 'meteor/random'

Meteor.methods({
    
    createRetroItem(title, itemType) {
        
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
        
        const doc = {}
        doc.itemId = Random.id()
        doc.title = title
        doc.itemType = itemType
        doc.status = Constants.RetroItemStatuses.PENDING
        doc.votes = 0
        doc.createdAt = new Date()
        
        if(!_.isArray(retro.items)){
            retro.items = []
        }
        
        retro.items.push(doc)
        
        try {
            Retros.update(
                { _id: retroId },
                { 
                    $push: {
                        items: doc
                    }
                }
            )        
            return retroId
        }
        catch(err) {
            console.log(err)
            return new Meteor.Error('insert-failed', 'We could not add retro item to the retro - please try again later')
        }
        
    }
    
})