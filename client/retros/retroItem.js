import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { toastr } from 'meteor/chrismbeckett:toastr'
import { $ } from 'meteor/jquery'
import { ConfirmDialog } from '../common/confirmDialog'
import { Retros } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import './retroItem.html'

Template.retroItem.onCreated(function () {
    const self = this

    self.currentlyHighlighted = null
    self.itemOkd = new ReactiveVar('ok-gray.png')
    self.editBtn = new ReactiveVar('edit-blue.png')

    self.editing = new ReactiveVar(false)
    self.title = ''
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
        return Template.instance().editing.get()
    },
    notEditing() {
        return !Template.instance().editing.get()
    },
    isSelected() {
        const instance = Template.instance()
        if (instance.data.selectedItemId.get() === this.data.itemId) {
            return true
        }
        instance.editing.set(false)
        return false
    },
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
                    toastr.error('Could not remove item - try again later')
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
                    toastr.error(err.message);
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
                toastr.error('Could not upvote - try again later')
            }
        })
    },
    'click a.editButton'(event, instance) {
        event.stopPropagation()
        instance.title = this.data.title
        instance.editing.set(true)
        setTimeout(function () {
            $('input#titleTextbox').focus().select()
        }, 100)
    },

    'keyup input': function (event, instance) {
        event.stopPropagation()
        const self = instance

        if (event.keyCode === 13) {
            // enter - save the info
            event.stopPropagation()
            const newTitle = event.currentTarget.value || ''
            Meteor.call('updateRetroItemTitle', event.currentTarget.dataset.id, newTitle, function (err) {
                if (err) {
                    toastr.error(err.message);
                }
                self.editing.set(false)
                return false
            })
        }
        if (event.keyCode === 27) {
            // escape - put things back
            event.stopPropagation()
            $('input#titleTextbox').val(instance.title)
            instance.title = ''
            instance.editing.set(false)
            return false
        }
        return true
    },
})
