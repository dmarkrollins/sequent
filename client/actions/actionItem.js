import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { toastr } from 'meteor/chrismbeckett:toastr'
import { $ } from 'meteor/jquery'
import { ReactiveVar } from 'meteor/reactive-var'
import { Constants } from '../../lib/constants'
import { ConfirmDialog } from '../common/confirmDialog'
import autosize from '../autosize'

import './actionItem.html'

Template.actionItem.onCreated(function () {
    const self = this
    self.currentlyHighlighted = null
    self.editing = new ReactiveVar(false)
    self.title = ''
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
                    console.log(err)
                    toastr.error('Could not remove action - try again later')
                }
            })
        })
    },
    'click a.okButton'(event, instance) {
        event.preventDefault()
        event.stopPropagation()
        Meteor.call('toggleAction', event.currentTarget.dataset.id, function (err) {
            if (err) {
                toastr.error('Could not remove action - try again later')
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
        Meteor.call('updateActionTitle', event.currentTarget.dataset.id, newTitle, function (err) {
            if (err) {
                toastr.error(err.message);
            }
            instance.editing.set(false)
            instance.data.unHighlight()
        })
    },

    'click a#btnCancel'(event, instance) {
        event.stopPropagation()
        $('textarea#titleTextbox').val(instance.title)
        instance.title = ''
        instance.editing.set(false)
        instance.data.unHighlight()
    }


})
