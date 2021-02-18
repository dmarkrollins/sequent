import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { Template } from 'meteor/templating'
import { $ } from 'meteor/jquery'
import { _ } from 'meteor/underscore'
import { ReactiveVar } from 'meteor/reactive-var'
import { Toast } from '../common/toast'
import { Retros, RetroActions, Settings, Sequent } from '../../lib/sequent'
import { Constants } from '../../lib/constants'
import { UXUtils } from '../common/uxUtils'

import autosize from '../autosize'
import './retroBoard.html'

Template.retroBoard.onCreated(function () {
    const self = this

    self.retro = {}
    self.currentlyHighlighted = null
    self.selectedItemId = new ReactiveVar(null)
    self.happyCount = new ReactiveVar('')
    self.mehCount = new ReactiveVar('')
    self.sadCount = new ReactiveVar('')

    self.insertItem = (itemType, title) => {
        Meteor.call(
            'createRetroItem',
            title,
            itemType,
            function (err, result) {
                if (err) {
                    Toast.showError(err.reason)
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
    frozenEntry() {
        const retro = Retros.findOne()

        if (!retro) {
            return ''
        }

        if (retro.status === Constants.RetroStatuses.FROZEN) {
            return 'disabled'
        }

        return ''
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
    happyCount() {
        return Template.instance().happyCount.get()
    },
    mehCount() {
        return Template.instance().mehCount.get()
    },
    sadCount() {
        return Template.instance().sadCount.get()
    }

})

Template.retroBoard.events({
    'input textarea#happy-textarea': function (event, instance) {
        const tval = event.target.value
        const cval = UXUtils.remainingChars(tval)
        instance.happyCount.set(cval)
    },
    'input textarea#meh-textarea': function (event, instance) {
        const tval = event.target.value
        const cval = UXUtils.remainingChars(tval)
        instance.mehCount.set(cval)
    },
    'input textarea#sad-textarea': function (event, instance) {
        const tval = event.target.value
        const cval = UXUtils.remainingChars(tval)
        instance.sadCount.set(cval)
    },
    'keypress div.greenItem textarea': function (event, instance) {
        if (event.which === 13) {
            const val = event.currentTarget.value.replace('\n', '').trim()
            event.currentTarget.value = ''
            instance.happyCount.set('')
            if (val !== '') {
                instance.insertItem(Constants.RetroItemTypes.HAPPY, val)
                return false
            }
        }
    },
    'keypress div.yellowItem textarea': function (event, instance) {
        if (event.which === 13) {
            const val = event.currentTarget.value.replace('\n', '').trim()
            event.currentTarget.value = ''
            instance.mehCount.set('')
            if (val !== '') {
                instance.insertItem(Constants.RetroItemTypes.MEH, val)
                return false
            }
        }
    },
    'keypress div.redItem textarea': function (event, instance) {
        if (event.which === 13) {
            const val = event.currentTarget.value.replace('\n', '').trim()
            event.currentTarget.value = ''
            instance.sadCount.set('')
            if (val !== '') {
                instance.insertItem(Constants.RetroItemTypes.SAD, val)
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
                        Toast.showError(err.reason)
                    }
                    event.currentTarget.value = ''
                    return false
                })
            }
        }
    },


})
