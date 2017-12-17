import { Retros, RetroActions } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import autosize from '../autosize'

Template.archiveBoard.onCreated(function(){
    const self = this
    
    self.retro = {}
    
})

Template.archiveBoard.helpers({
    greenItem() {
        const retro = Retros.findOne()
        if(retro){
            const list2 = _.filter(retro.items, function(item){
                return (item.itemType === Constants.RetroItemTypes.HAPPY )
            })
            return list2
        }
    },
    yellowItem() {
        const retro = Retros.findOne()
        if(retro){
            const list2 = _.filter(retro.items, function(item){
                return (item.itemType === Constants.RetroItemTypes.MEH )
            })
            return list2
        }
    },
    redItem() {
        const retro = Retros.findOne()
        if(retro){
            const list2 = _.filter(retro.items, function(item){
                return (item.itemType === Constants.RetroItemTypes.SAD )
            })
            return list2
        }
    },
    itemClass() {
        return 'listItemCompleted'
    },
    currentItem() {
        return {
            data: this,
            unHighlight: function(){
            }
        }
    }
})

Template.archiveBoard.events({
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