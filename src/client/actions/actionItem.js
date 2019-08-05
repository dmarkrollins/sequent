import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { $ } from 'meteor/jquery'
import { ReactiveVar } from 'meteor/reactive-var'
import { Toast } from '../common/toast'
import { Constants } from '../../lib/constants'
import { ConfirmDialog } from '../common/confirmDialog'
import autosize from '../autosize'

import './actionItem.html'

Template.actionItem.onCreated(function () {
    const self = this
    self.currentlyHighlighted = null
    self.editing = new ReactiveVar(false)
    self.title = ''

    self.saveAction = (id, newTitle) => {
        Meteor.call('updateActionTitle', id, newTitle, function (err) {
            if (err) {
                Toast.showError(err.reason);
            }
            self.editing.set(false)
            self.data.unHighlight()
        })
    }
})

Template.actionItem.helpers({
    okImage() {
        if (this.data.status === Constants.RetroItemStatuses.PENDING) {
            return 'ok-gray.png'
        }
        return 'ok-green.png'
    },
    isSelected() {
        return Template.instance().data.selectedItemId.get() === this.data._id
    },
    editing() {
        return Template.instance().editing.get()
    }
})

Template.actionItem.events({
    'click a.deleteButton'(event, instance) {
        const title = 'Delete Action Item?'
        const msg = `Are you sure you want permanently delete action item: '${this.data.title}' ?`

        ConfirmDialog.showConfirmation(msg, title, 'danger', null, () => {
            Meteor.call('removeAction', event.currentTarget.dataset.id, function (err) {
                if (err) {
                    Toast.showError('Could not remove action - try again later')
                }
            })
        })
    },
    'click a.okButton'(event, instance) {
        event.preventDefault()
        event.stopPropagation()
        Meteor.call('toggleAction', event.currentTarget.dataset.id, function (err) {
            if (err) {
                Toast.showError('Could not remove action - try again later')
            }
        })
    },
    'click a.editButton'(event, instance) {
        event.stopPropagation()
        instance.title = this.data.title
        instance.editing.set(true)
        setTimeout(function () {
            autosize($('textarea#actionItemTextarea'))
            $('textarea#actionItemTextarea').focus().select()
        }, 100)
    },

    'click a#btnSave'(event, instance) {
        event.stopPropagation()
        const newTitle = $('textarea#actionItemTextarea')[0].value
        instance.saveAction(event.currentTarget.dataset.id, newTitle)
    },

    'click a#btnCancel'(event, instance) {
        event.stopPropagation()
        $('textarea#titleTextbox').val(instance.title)
        instance.title = ''
        instance.editing.set(false)
        instance.data.unHighlight()
    },

    'keypress #actionItemTextarea': function (event, instance) {
        if (event.which === 13) {
            const val = event.currentTarget.value.replace('\n', '').trim()
            if (val !== '') {
                instance.saveAction(event.currentTarget.dataset.id, val)
                event.currentTarget.value = ''
                return false
            }
            event.currentTarget.value = ''
        }
    }
})
