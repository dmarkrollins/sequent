import { Retros, RetroActions } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

Template.actionsList.onCreated(function() {
    this.currentlyHighlighted = null
})

Template.actionsList.helpers({
    item() {
        return RetroActions.find()
    },
    okImage() {
        if (this.status === Constants.RetroItemStatuses.PENDING){
            return 'ok-gray.png'
        }
        return 'ok-green.png'
    }
})

Template.actionsList.events({
    'keypress #actionInput': function(event, template){
        if (event.which === 13) {
            if(event.currentTarget.value !== ''){
                Meteor.call('createRetroAction', event.currentTarget.value, function(err){
                    if(err){
                        console.log(err)
                        toastr.error('Error occurred - action not created')    
                    }
                    event.currentTarget.value = ''
                    return false
                })
            }
        }
    },
    'click div.listActionItem': function(event, template) {

        $( "div.actionItem" ).removeClass('actionItemHighlight')
        // $( "a.okButton" ).addClass('hidden')
        $( "a.deleteButton" ).addClass('hidden')
        
        if(template.currentlyHighlighted === event.currentTarget){
            template.currentlyHighlighted = null
            return
        }
            
        // $(event.currentTarget).find('a.okButton').removeClass('hidden')
        $(event.currentTarget).find('a.deleteButton').removeClass('hidden')
        $(event.currentTarget).find('div.actionItem').addClass('actionItemHighlight')
        template.currentlyHighlighted = event.currentTarget
    },
    'click a.deleteButton': function(event, template){
        var r = confirm("Are you sure?");
        if(!r) return
        Meteor.call('removeAction', event.currentTarget.id, function(err){
          if(err){
              console.log(err)
              toastr.error('Could not remove action - try again later')
          }  
        })
    },
    'click a.okButton': function(event, template){
        event.preventDefault()
        event.stopPropagation() 
        Meteor.call('toggleAction', event.currentTarget.id, function(err){
          if(err){
              console.log(err)
              toastr.error('Could not remove action - try again later')
          }  
        })
    }
})