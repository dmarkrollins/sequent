
import { Retros } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

Template.retroItem.onCreated(function(){
    
    this.currentlyHighlighted = null
    
})

Template.retroItem.helpers({
    
    itemClass() {
        console.log('item type', this.itemType)
        switch(this.itemType){
            case Constants.RetroItemTypes.HAPPY:
                return 'greenItem'
            case Constants.RetroItemTypes.MEH:
                return 'yellowItem'
            default:
                return 'redItem'
        }
    },
    notCompleted() {
        return (this.status === Constants.RetroItemStatuses.PENDING)
    },
    showVoteButton() {

        const retro = Retros.findOne()

        if(!retro) return true
        
        if (retro.status === Constants.RetroStatuses.FROZEN || retro.status === Constants.RetroStatuses.ARCHIVED) {
            return false
        }

        if (this.status !== Constants.RetroItemStatuses.PENDING) {
            return false
        }

        return true
        
    }
})

Template.retroItem.events({
    'click a.deleteButton': function(event, template) {
        Meteor.call('removeRetroItem', event.currentTarget.id, function(err){
            if(err) {
                toastr.error(err.message);
            }
        })
    },
    'click #voteButton': function(event, template) {
        event.preventDefault()
        event.stopPropagation()
        Meteor.call('upVoteItem', event.currentTarget.dataset.id, function(err){
            if(err){
                console.log(err)
                toastr.error('Could not upvote - try again later')
            }
        })
    }
})
