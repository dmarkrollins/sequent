import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { $ } from 'meteor/jquery'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { Toast } from '../../client/common/toast'
import { Retros, RetroActions, Settings, Sequent } from '../../lib/sequent'
import { Constants } from '../../lib/constants'
import { ConfirmDialog } from '../common/confirmDialog'
import { UXUtils } from '../common/uxUtils'

import './actionsList.html'
import './actionInput.html'
import './actionItem.html'

Template.actionsList.onCreated(function () {
    const self = this
    self.currentlyHighlighted = null
    self.selectedItemId = new ReactiveVar(null)
    self.limit = new ReactiveVar(Sequent.pageSize())
    self.loaded = new ReactiveVar()

    self.autorun(function () {
        const showAll = Session.get('showAllCompleted')
        const search = { showAll, limit: self.limit.get() }
        const subscription = self.subscribe('all-actions', search)

        if (subscription.ready()) {
            const count = RetroActions.find().count()
            self.loaded.set(count)
        }
    })
})

Template.actionsList.helpers({
    item() {
        if (Session.get('showAllCompleted')) {
            return RetroActions.find({}, { sort: { completedAt: 1 } })
        }
        return RetroActions.find({
            status: Constants.RetroItemStatuses.PENDING
        })
    },
    backGround() {
        const settings = Sequent.getSettings()
        return settings.backgroundImage
    },
    currentItem() {
        return {
            data: this,
            unHighlight: function () {
                $('div.actionItem').removeClass('actionItemHighlight')
            },
            selectedItemId: Template.instance().selectedItemId
        }
    },
    showCompletedItems() {
        return Session.get('showAllCompleted')
    },
    hasMoreActions() {
        const loaded = Template.instance().loaded.get()
        const limit = Template.instance().limit.get()

        if (loaded === limit) {
            return true
        }

        return false
    },
})

Template.actionsList.events({
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
    'click div.retroItem': function (event, instance) {
        $('div.actionItem').removeClass('actionItemHighlight')

        if (instance.currentlyHighlighted === event.currentTarget) {
            instance.currentlyHighlighted = null
            instance.selectedItemId.set(null)
            return
        }

        $(event.currentTarget).find('div.actionItem').addClass('actionItemHighlight')
        instance.currentlyHighlighted = event.currentTarget
        instance.selectedItemId.set(this._id)
    },
    'click #btnSend': function (event, instance) {
        const targetemail = Session.get(Sequent.EMAIL_TARGET) || ''
        const msg = `<p style="margin-bottom: 12px; color: #aaa;">Enter an email address to send outstanding action items to:</p><input type="text" id="actionEmail" class="form-control" placeholder="Target email address" value="${targetemail}"/>`

        ConfirmDialog.showConfirmation(msg, 'Share Action Items', 'primary', null, () => {
            const email = UXUtils.findEmailInput()
            if (email === '') {
                Toast.showError('Email address is required!')
            } else {
                Session.setPersistent(Sequent.EMAIL_TARGET, email)
                Meteor.call('sendActionsByEmail', event.currentTarget.dataset.id, email, function (err) {
                    if (err) {
                        // console.log('Action item send error', err)
                        Toast.showError('Could not send action items - try again later')
                    } else {
                        Toast.showSuccess('Action items have been sent - check spam folder too!')
                    }
                })
            }
        })
    },
    'click #btnShowCompleted': function (event, instance) {
        Session.set('showAllCompleted', !Session.get('showAllCompleted'))
    },
    'click #btnGetMore': function (event, instance) {
        let newLimit = instance.limit.get()
        instance.limit.set(newLimit += Sequent.pageSize())
    }
})
