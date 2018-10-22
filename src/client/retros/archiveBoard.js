import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { _ } from 'meteor/underscore'
import { Toast } from '../common/toast'
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
    },
    happyPlaceholder() {
        const retro = Retros.findOne()
        if (retro) {
            const settings = Sequent.getSettings()
            return retro.happyPlaceholder || settings.happyPlaceholder
        }
    },
    mehPlaceholder() {
        const retro = Retros.findOne()
        if (retro) {
            const settings = Sequent.getSettings()
            return retro.mehPlaceholder || settings.mehPlaceholder
        }
    },
    sadPlaceholder() {
        const retro = Retros.findOne()
        if (retro) {
            const settings = Sequent.getSettings()
            return retro.sadPlaceholder || settings.sadPlaceholder
        }
    }
})

Template.archiveBoard.events({
    'keypress #actionInput': function (event, instance) {
        if (event.which === 13) {
            if (event.currentTarget.value !== '') {
                Meteor.call('createRetroAction', event.currentTarget.value, function (err) {
                    if (err) {
                        Toast.showError('Error occurred - action not created')
                    }
                    event.currentTarget.value = ''
                    return false
                })
            }
        }
    }
})
