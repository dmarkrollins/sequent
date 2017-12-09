
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
    voteDisabled() {
        const retro = Retros.findOne()
        if(!retro) return
        if(retro.status === Constants.RetroStatuses.FROZEN){
            return 'disabled'
        }
        return ''
    },
    notCompleted() {
        return (this.status === Constants.RetroItemStatuses.PENDING)
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
