import { Retros, RetroActions } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import autosize from '../autosize'

Template.retroBoard.onCreated(function(){
    const self = this
    
    self.retro = {}
    self.currentlyHighlighted = null
    
    // self.refreshData(){
                
    // }   
    
    self.insertItem = (itemType, title) => {
        Meteor.call(
            'createRetroItem', 
            title, 
            itemType,
        function(err, result){
            if(err){
                console.log(err)
                toastr.error('Error occurred - retro not created')                             
            }
        })
    }
})

Template.retroBoard.onRendered(function(){
    autosize($('textarea'))
})

Template.retroBoard.helpers({
    greenItem() {
        const retro = Retros.findOne()
        if(retro){
            const list = _.filter(retro.items, function(item){
                return (item.itemType === Constants.RetroItemTypes.HAPPY && item.status === Constants.RetroItemStatuses.PENDING)
            })
            return list
        }
    },
    yellowItem() {
        const retro = Retros.findOne()
        if(retro){
            const list = _.filter(retro.items, function(item){
                return (item.itemType === Constants.RetroItemTypes.MEH && item.status === Constants.RetroItemStatuses.PENDING)
            })
            return list
        }
    },
    redItem() {
        const retro = Retros.findOne()
        if(retro){
            const list = _.filter(retro.items, function(item){
                return (item.itemType === Constants.RetroItemTypes.SAD && item.status === Constants.RetroItemStatuses.PENDING)
            })
            return list
        }
    },
    action() {
        const actions = RetroActions.find().fetch()
        if(actions){
            const list = _.filter(actions, function(item){
                return (item.status === Constants.RetroItemStatuses.PENDING)
            })
            return list
        }
    },
    notFrozen() {
        const retro = Retros.findOne()
        
        if (!retro) {
            return true
        }
        
        if (retro.status === Constants.RetroStatuses.FROZEN){
            return false
        }
        
        return true
    }
})

Template.retroBoard.events({
    'keypress div.greenItem textarea': function(event, template) {
        if (event.which === 13) {
            if(event.currentTarget.value !== '') {
                template.insertItem(Constants.RetroItemTypes.HAPPY, event.currentTarget.value)
                event.currentTarget.value = ''
                return false
            }
        }
    },
    'keypress div.yellowItem textarea': function(event, template) {
        if (event.which === 13) {
            if(event.currentTarget.value !== '') {
                template.insertItem(Constants.RetroItemTypes.MEH, event.currentTarget.value)
                event.currentTarget.value = ''
                return false
            }
        }
    },
    'keypress div.redItem textarea': function(event, template) {
        if (event.which === 13) {
            if(event.currentTarget.value !== '') {
                template.insertItem(Constants.RetroItemTypes.SAD, event.currentTarget.value)
                event.currentTarget.value = ''
                return false
            }
        }
    },
    'click div.listItem': function(event, template) {

        $( "div.retroItem" ).removeClass('itemHighlight')
        // $( "a.okButton" ).addClass('hidden')
        $( "a.deleteButton" ).addClass('hidden')
        
        if(template.currentlyHighlighted === event.currentTarget){
            template.currentlyHighlighted = null
            return
        }

        // $(event.currentTarget).find('a.okButton').removeClass('hidden')
        $(event.currentTarget).find('a.deleteButton').removeClass('hidden')
        event.currentTarget.classList.add('itemHighlight')
        template.currentlyHighlighted = event.currentTarget
    },
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
    }

    
})