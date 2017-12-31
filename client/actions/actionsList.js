import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { $ } from 'meteor/jquery'
import { ReactiveVar } from 'meteor/reactive-var'
import { toastr } from 'meteor/chrismbeckett:toastr'
import { Retros, RetroActions, Settings, Sequent } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

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
                        toastr.error('Error occurred - action not created')
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
})
