import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { $ } from 'meteor/jquery'
import { ConfirmDialog } from '../common/confirmDialog'
import { Toast } from '../common/toast'
import { Retros } from '../../lib/sequent'
import { Constants } from '../../lib/constants'
import autosize from '../autosize'

import './retroItem.html'

Template.retroItem.onCreated(function () {
    const self = this

    self.currentlyHighlighted = null
    self.itemOkd = new ReactiveVar('ok-gray.png')
    self.editBtn = new ReactiveVar('edit-blue.png')

    self.editing = new ReactiveVar(false)
    self.title = ''

    self.timer = null
    self.timerValue = 0
    self.timerText = new ReactiveVar('00:00:00')

    self.startTimer = () => {
        if (!self.timer) {
            self.timer = setInterval(function () {
                self.timerValue += 1
                const secs = self.timerValue % 60;
                const mins = parseInt(self.timerValue / 60, 10);
                const hours = parseInt(self.timerValue / 60 / 60, 10);
                self.timerText.set(`${(hours < 10 ? '0' : '')}${hours}:${(mins < 10 ? '0' : '')}${mins}:${(secs < 10 ? '0' : '')}${secs}`)
            }, 1000);
        }
    }

    self.stopTimer = () => {
        if (self.timer) {
            clearInterval(self.timer);
            self.timer = null;
            self.timerValue = 0
        }
    }

    self.saveAction = (id, title) => {
        Meteor.call('updateRetroItemTitle', id, title, function (err) {
            if (err) {
                Toast.showError(err.message);
            }
            self.editing.set(false)
        })
    }
})

Template.retroItem.helpers({

    itemClass() {
        switch (this.data.itemType) {
            case Constants.RetroItemTypes.HAPPY:
                return 'greenItem'
            case Constants.RetroItemTypes.MEH:
                return 'yellowItem'
            default:
                return 'redItem'
        }
    },
    pending() {
        const isEditing = Template.instance().editing.get()

        if (isEditing) return false

        return (this.data.status === Constants.RetroItemStatuses.PENDING)
    },
    showVoteButton() {
        const isEditing = Template.instance().editing.get()

        if (isEditing) return false

        const retro = Retros.findOne()

        if (!retro) return true

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
    },
    editButton() {
        return Template.instance().editBtn.get()
    },
    editMode() {
        if (Template.instance().data.status === Constants.RetroItemStatuses.COMPLETE) {
            return false
        }
        return Template.instance().editing.get()
    },
    notEditing() {
        if (Template.instance().data.status === Constants.RetroItemStatuses.COMPLETE) {
            return true
        }
        return !Template.instance().editing.get()
    },
    isSelected() {
        const instance = Template.instance()
        if (instance.data.status === Constants.RetroItemStatuses.COMPLETE) {
            instance.stopTimer()
            instance.timerText.set('00:00:00')
            instance.editing.set(false)
            return false
        }
        if (instance.data.selectedItemId.get() === this.data.itemId) {
            instance.startTimer()
            return true
        }
        instance.stopTimer()
        instance.timerText.set('00:00:00')
        instance.editing.set(false)
        return false
    },
    currentTimer() {
        return Template.instance().timerText.get()
    }
})

Template.retroItem.events({
    'click div.selected-item'(event, instance) {
        if (instance.editing.get()) {
            event.stopPropagation()
        }
    },
    'click a.deleteButton'(event, instance) {
        const self = this
        event.stopPropagation()
        const msg = `Are you sure you want to <i>permanently</i> remove item: '${this.data.title}' ?`
        const title = 'Remove Item?'
        ConfirmDialog.showConfirmation(msg, title, 'danger', event.currentTarget.dataset.id, (id) => {
            Meteor.call('removeRetroItem', id, function (err) {
                if (err) {
                    Toast.showError('Could not remove item - try again later')
                }
                instance.data.selectedItemId.set(null)
                instance.data.unHighlight()
            })
        })
    },
    'click a.completeButton'(event, instance) {
        const self = this
        event.stopPropagation()
        instance.itemOkd.set('ok-green.png')
        setTimeout(function () {
            Meteor.call('completeRetroItem', event.currentTarget.dataset.id, function (err) {
                if (err) {
                    Toast.showError(err.message);
                }
                instance.data.selectedItemId.set(null)
                instance.data.unHighlight()
                instance.itemOkd.set('ok-gray.png')
            })
        }, 250)
    },
    'click #voteButton'(event, instance) {
        event.preventDefault()
        event.stopPropagation()
        Meteor.call('upVoteItem', event.currentTarget.dataset.id, function (err) {
            if (err) {
                Toast.showError('Could not upvote - try again later')
            }
        })
    },
    'click a.editButton'(event, instance) {
        event.stopPropagation()
        instance.title = this.data.title
        instance.editing.set(true)
        setTimeout(function () {
            autosize($('textarea#titleTextBox'))
            $('textarea#titleTextBox').focus().select()
        }, 100)
    },

    'click a#btnSave'(event, instance) {
        event.stopPropagation()
        const newTitle = $('textarea#titleTextBox')[0].value
        instance.saveAction(event.currentTarget.dataset.id, newTitle)
    },

    'keypress textarea#titleTextBox': function (event, instance) {
        if (event.which === 13) {
            const newTitle = event.currentTarget.value
            instance.saveAction(event.currentTarget.dataset.id, newTitle)
        }
    },

    'click a#btnCancel'(event, instance) {
        event.stopPropagation()
        $('textarea#titleTextbox').val(instance.title)
        instance.title = ''
        instance.editing.set(false)
    }


})
