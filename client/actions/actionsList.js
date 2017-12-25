import { Retros, RetroActions, Settings, Sequent } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import './actionsList.html'
import './actionInput.html'
import './actionItem.html'

Template.actionsList.onCreated(function() {
    this.currentlyHighlighted = null
})

Template.actionsList.helpers({
    item() {
        return RetroActions.find()
    },
    backGround(){
        const settings = Sequent.getSettings()
        return settings.backgroundImage
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
    'click div.retroItem': function(event, template) {
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
})