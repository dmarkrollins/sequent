import { Meteor } from 'meteor/meteor'
import { Retros } from '../lib/sequent'
import { Constants } from '../lib/constants'

Retros._ensureIndex('createdBy', 1)
Retros._ensureIndex('status', 1)

Meteor.publish('active-retros', function() {
    
    if(!this.userId) {
        return null
    }
    
    return Retros.find({ 
        createdBy: this.userId, 
        status: { 
            $in: [ Constants.RetroStatuses.ACTIVE, Constants.RetroStatuses.FROZEN ]
        }
    })
    
});

Meteor.publish('archived-retros', function(teamId) {
    
    if(!this.userId) {
        return null
    }
    
    return Retros.find({ createdBy: this.userId, status: Constants.RetroStatuses.ARCHIVE})
 
});