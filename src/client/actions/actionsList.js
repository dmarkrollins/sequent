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
    this.currentlyHighlighted = null
    this.selectedItemId = new ReactiveVar(null)
})

Template.actionsList.helpers({
    item() {
        return RetroActions.find()
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
    }
})

Template.actionsList.events({
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
                        Toast.showError('Could send action items - try again later')
                    } else {
                        Toast.showSuccess('Action items have been sent!')
                    }
                })
            }
        })
    }
})
