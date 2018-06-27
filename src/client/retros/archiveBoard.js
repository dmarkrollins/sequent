import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { _ } from 'meteor/underscore'
import { toastr } from 'meteor/chrismbeckett:toastr'
import { Retros, RetroActions, Sequent } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import './archiveBoard.html'

Template.archiveBoard.onCreated(function () {
    const self = this

    self.retro = {}
})

Template.archiveBoard.helpers({
    greenItem() {
        const retro = Retros.findOne()
        if (retro) {
            const list2 = _.filter(retro.items, function (item) {
                return (item.itemType === Constants.RetroItemTypes.HAPPY)
            })
            return list2
        }
    },
    yellowItem() {
        const retro = Retros.findOne()
        if (retro) {
            const list2 = _.filter(retro.items, function (item) {
                return (item.itemType === Constants.RetroItemTypes.MEH)
            })
            return list2
        }
    },
    redItem() {
        const retro = Retros.findOne()
        if (retro) {
            const list2 = _.filter(retro.items, function (item) {
                return (item.itemType === Constants.RetroItemTypes.SAD)
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
            unHighlight: function () {
            }
        }
    },
    backGround() {
        const settings = Sequent.getSettings()
        return settings.backgroundImage
    }
})

Template.archiveBoard.events({
    'keypress #actionInput': function (event, instance) {
        if (event.which === 13) {
            if (event.currentTarget.value !== '') {
                Meteor.call('createRetroAction', event.currentTarget.value, function (err) {
                    if (err) {
                        toastr.error('Error occurred - action not created')
                    }
                    event.currentTarget.value = ''
                    return false
                })
            }
        }
    }
})
