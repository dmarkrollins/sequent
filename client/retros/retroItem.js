
import { Retros } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

Template.retroItem.onCreated(function(){
    const self = this

    self.currentlyHighlighted = null
    self.itemOkd = new ReactiveVar('ok-gray.png')
    
})

Template.retroItem.helpers({
    
    itemClass() {
        switch(this.data.itemType){
            case Constants.RetroItemTypes.HAPPY:
                return 'greenItem'
            case Constants.RetroItemTypes.MEH:
                return 'yellowItem'
            default:
                return 'redItem'
        }
    },
    notCompleted() {
        return (this.data.status === Constants.RetroItemStatuses.PENDING)
    },
    showVoteButton() {

        const retro = Retros.findOne()

        if(!retro) return true
        
        if (retro.status === Constants.RetroStatuses.FROZEN || retro.status === Constants.RetroStatuses.ARCHIVED) {
            return false
        }

        if (this.data.status !== Constants.RetroItemStatuses.PENDING) {
            return false
        }

        return true
        
    },
    okButton() {
        return Template.instance().itemOkd.get()
    }
})

Template.retroItem.events({
    'click a.completeButton': function(event, instance) {
        const self = this
        event.stopPropagation() 
        instance.itemOkd.set('ok-green.png')
        setTimeout(function(){

            Meteor.call('removeRetroItem', event.currentTarget.id, function(err){
                if(err) {
                    toastr.error(err.message);
                }
                self.unHighlight()
                instance.itemOkd.set('ok-gray.png')
            })
        }, 250)
    },
    'click #voteButton': function(event, instance) {
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
