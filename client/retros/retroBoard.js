import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { Template } from 'meteor/templating'
import { $ } from 'meteor/jquery'
import { toastr } from 'meteor/chrismbeckett:toastr'
import { _ } from 'meteor/underscore'
import { ReactiveVar } from 'meteor/reactive-var'
import { Retros, RetroActions, Settings, Sequent } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import autosize from '../autosize'
import './retroBoard.html'

Template.retroBoard.onCreated(function () {
    const self = this

    self.retro = {}
    self.currentlyHighlighted = null
    self.selectedItemId = new ReactiveVar(null)

    self.insertItem = (itemType, title) => {
        Meteor.call(
            'createRetroItem',
            title,
            itemType,
            function (err, result) {
                if (err) {
                    toastr.error('Error occurred - retro not created')
                }
            },
        )
    }

    self.sortedList = (list) => {
        const sortDesc = Session.get('sortDescending')
        if (sortDesc) {
            return list.sort(function (a, b) { return b.votes - a.votes })
        }
        return list
    }
})

Template.retroBoard.onRendered(function () {
    autosize($('textarea'))
})

Template.retroBoard.helpers({
    greenItem() {
        const instance = Template.instance()
        const retro = Retros.findOne()
        if (retro) {
            const list = _.filter(retro.items, function (item) {
                return (item.itemType === Constants.RetroItemTypes.HAPPY && item.status === Constants.RetroItemStatuses.PENDING)
            })
            if (retro.showCompleted) {
                const list2 = _.filter(retro.items, function (item) {
                    return (item.itemType === Constants.RetroItemTypes.HAPPY && item.status === Constants.RetroItemStatuses.COMPLETE)
                })
                return instance.sortedList(list.concat(list2))
            }
            return instance.sortedList(list)
        }
    },
    yellowItem() {
        const instance = Template.instance()
        const retro = Retros.findOne()
        if (retro) {
            const list = _.filter(retro.items, function (item) {
                return (item.itemType === Constants.RetroItemTypes.MEH && item.status === Constants.RetroItemStatuses.PENDING)
            })
            if (retro.showCompleted) {
                const list2 = _.filter(retro.items, function (item) {
                    return (item.itemType === Constants.RetroItemTypes.MEH && item.status === Constants.RetroItemStatuses.COMPLETE)
                })
                return instance.sortedList(list.concat(list2))
            }
            return instance.sortedList(list)
        }
    },
    redItem() {
        const instance = Template.instance()
        const retro = Retros.findOne()
        if (retro) {
            const list = _.filter(retro.items, function (item) {
                return (item.itemType === Constants.RetroItemTypes.SAD && item.status === Constants.RetroItemStatuses.PENDING)
            })
            if (retro.showCompleted) {
                const list2 = _.filter(retro.items, function (item) {
                    return (item.itemType === Constants.RetroItemTypes.SAD && item.status === Constants.RetroItemStatuses.COMPLETE)
                })
                return instance.sortedList(list.concat(list2))
            }
            return instance.sortedList(list)
        }
    },
    action() {
        const actions = RetroActions.find().fetch()
        if (actions) {
            const list = _.filter(actions, function (item) {
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

        if (retro.status === Constants.RetroStatuses.FROZEN) {
            return false
        }

        return true
    },
    itemClass() {
        const retro = Retros.findOne()

        if (!retro) return 'listItem '

        if (retro.showCompleted && this.status === Constants.RetroItemStatuses.COMPLETE) {
            return 'listItemCompleted'
        }

        return 'listItem '
    },
    currentItem() {
        return {
            data: this,
            unHighlight: function () {
                $('div.retroItem').removeClass('itemHighlight')
            },
            selectedItemId: Template.instance().selectedItemId
        }
    },
    backGround() {
        const settings = Sequent.getSettings()
        return settings.backgroundImage
    },
    happyPlaceholder() {
        const settings = Sequent.getSettings()
        return settings.happyPlaceholder
    },
    mehPlaceholder() {
        const settings = Sequent.getSettings()
        return settings.mehPlaceholder
    },
    sadPlaceholder() {
        const settings = Sequent.getSettings()
        return settings.sadPlaceholder
    },

})

Template.retroBoard.events({
    'keypress div.greenItem textarea': function (event, instance) {
        if (event.which === 13) {
            if (event.currentTarget.value !== '') {
                instance.insertItem(Constants.RetroItemTypes.HAPPY, event.currentTarget.value)
                event.currentTarget.value = ''
                return false
            }
        }
    },
    'keypress div.yellowItem textarea': function (event, instance) {
        if (event.which === 13) {
            if (event.currentTarget.value !== '') {
                instance.insertItem(Constants.RetroItemTypes.MEH, event.currentTarget.value)
                event.currentTarget.value = ''
                return false
            }
        }
    },
    'keypress div.redItem textarea': function (event, instance) {
        if (event.which === 13) {
            if (event.currentTarget.value !== '') {
                instance.insertItem(Constants.RetroItemTypes.SAD, event.currentTarget.value)
                event.currentTarget.value = ''
                return false
            }
        }
    },
    'click div.listItem': function (event, instance) {
        const retro = Retros.findOne()

        $('div.retroItem').removeClass('itemHighlight')

        if (instance.currentlyHighlighted === event.currentTarget) {
            instance.currentlyHighlighted = null
            instance.selectedItemId.set(null)
            return
        }

        if (retro) {
            if (retro.showCompleted) {
                if (this.status === Constants.RetroItemStatuses.COMPLETE) {
                    return
                }
            }
        }

        event.currentTarget.classList.add('itemHighlight')
        instance.selectedItemId.set(this.itemId)
        instance.currentlyHighlighted = event.currentTarget
    },
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
    },


})
