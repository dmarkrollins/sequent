import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { toastr } from 'meteor/chrismbeckett:toastr'
import { Constants } from '../../lib/constants'
import { ConfirmDialog } from '../common/confirmDialog'
import './actionItem.html'

Template.actionItem.onCreated(function () {
    this.currentlyHighlighted = null
})

Template.actionItem.helpers({
    okImage() {
        if (this.status === Constants.RetroItemStatuses.PENDING) {
            return 'ok-gray.png'
        }
        return 'ok-green.png'
    },
})

Template.actionItem.events({
    'click a.deleteButton'(event, instance) {
        const title = 'Delete Action Item?'
        const msg = `Are you sure you want permanently delete action item: '${this.title}' ?`

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
                console.log(err)
                toastr.error('Could not remove action - try again later')
            }
        })
    },
})
