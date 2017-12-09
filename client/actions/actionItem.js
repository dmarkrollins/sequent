import { Constants } from '../../lib/constants'

Template.actionItem.onCreated(function(){
    this.currentlyHighlighted = null
})

Template.actionItem.helpers({
    okImage() {
        if (this.status === Constants.RetroItemStatuses.PENDING){
            return 'ok-gray.png'
        }
        return 'ok-green.png'
    }
})

Template.actionItem.events({
    'click a.deleteButton': function(event, template){
        var r = confirm("Are you sure?");
        if(!r) return
        Meteor.call('removeAction', event.currentTarget.dataset.id, function(err){
          if(err){
              console.log(err)
              toastr.error('Could not remove action - try again later')
          }  
        })
    },
    'click a.okButton': function(event, template){
        event.preventDefault()
        event.stopPropagation() 
        Meteor.call('toggleAction', event.currentTarget.dataset.id, function(err){
          if(err){
              console.log(err)
              toastr.error('Could not remove action - try again later')
          }  
        })
    }
})