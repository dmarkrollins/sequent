/* global PackageInfo Spacebars */
import moment from 'moment'
// const React = await import('react')
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Toast } from '../../client/common/toast'
import { ConfirmDialog } from './confirmDialog'
import { Retros, RetroActions, Sequent } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import '../version'
import './retroNav.html'

Template.retroNav.onCreated(function () {
    const self = this

    self.showUsage = new ReactiveVar(false)

    Meteor.call('showUsage', (err, val) => {
        if (err) {
            self.showUsage.set(false)
        }
        self.showUsage.set(val)
    })
})

Template.retroNav.helpers({
    projectName() {
        if (!Meteor.user()) return ''

        return Meteor.user().username.toProperCase()
    },
    actionCount() {
        return RetroActions.find({
            status: Constants.RetroItemStatuses.PENDING
        }).count()
    },
    badgeClass() {
        if (RetroActions.find().count() > 0) {
            return 'badge-error'
        }
        return ''
    },
    sortText() {
        if (Session.get('sortDescending')) {
            return 'Remove Sort'
        }
        return 'Sort By Votes'
    },
    sortIcon() {
        if (Session.get('sortDescending')) {
            return 'fa-sort'
        }
        return 'fa-sort-amount-desc'
    },
    freezeText() {
        const retro = Retros.findOne()
        if (!retro) return
        if (retro.status === Constants.RetroStatuses.FROZEN) {
            return 'Un-Freeze'
        }
        return 'Freeze'
    },
    freezeTitle() {
        let dateToUse
        let dateVal
        const retro = Retros.findOne()
        if (!retro) return ''

        if (FlowRouter.current().route.name === Sequent.archiveRouteName) {
            return ''
        }

        switch (retro.status) {
            case Constants.RetroStatuses.FROZEN:
                return Spacebars.SafeString('<span style="color: #00BFFF;"> - FROZEN</span>')
            case Constants.RetroStatuses.ARCHIVED:
                dateToUse = retro.archivedAt || retro.createdAt
                dateVal = retro.archiveName || moment(dateToUse).format('MM-DD-YYYY - LT')
                return Spacebars.SafeString(`<span style="color: #DAA520;"> - ARCHIVED ${dateVal}</span>`)
            default:
                return ''
        }
    },
    showActiveRetroMenuItems() {
        // {$or: [{expires: {$gte: new Date()}}, {expires: null}]}
        const retro = Retros.findOne({ $or: [{ status: Constants.RetroStatuses.ACTIVE }, { status: Constants.RetroStatuses.FROZEN }] })
        if (!retro) return false
        return true
    },
    completeViewClass() {
        const retro = Retros.findOne()
        if (!retro) return 'fa-eye menuBlue'

        if (retro.showCompleted) return 'fa-eye-slash menuRed'

        return 'fa-eye menuBlue'
    },
    completeViewColor() {
        const retro = Retros.findOne()
        if (!retro) return '#2b71cc'

        if (retro.showCompleted) return '#990000'

        return '#2b71cc'
    },
    showCompletedText() {
        const retro = Retros.findOne()

        if (!retro) return ''

        if (retro.showCompleted) return 'Hide Completed'

        return 'Show Completed'
    },
    currentVersion() {
        return `Version ${PackageInfo.version}`
    },
    showUsage() {
        return Template.instance().showUsage.get()
    }

})

Template.retroNav.events({

    'click #archiveRetro'() {
        const title = 'Archive Retro?'
        const msg = '<p>Are you sure you want to archive this retro?</p> <div class="form-group"><input type="text" class="form-control" id="archiveName" placeholder="Optional archive name" style="width: 90%; margin: auto;"></div>'

        ConfirmDialog.showConfirmation(msg, title, 'warning', null, function (value) {
            const retro = Retros.findOne()

            if (!retro) return

            Meteor.call('archiveRetro', retro._id, value, function (err, result) {
                if (err) {
                    Toast.showError(err.reason)
                }
            })
        }, null, 'archiveName')
    },

    'click #signOut'() {
        Meteor.logout((err) => {
            if (!err) {
                FlowRouter.go('/')
            }
        })
    },
    'click #freezeRetro'() {
        const retro = Retros.findOne()

        if (!retro) return

        Meteor.call('toggleRetroFrozen', function (err) {
            if (err) {
                Toast.showError('Failed to freeze the retro!')
            }
        })
    },
    'click #showCompleted'() {
        const retro = Retros.findOne()

        if (!retro) return

        Meteor.call('toggleShowCompleted', retro._id, function (err) {
            if (err) {
                Toast.showError('Failed to toggle completed view!')
            }
        })
    },
    'click #sortByVotes'() {
        const currentValue = Session.get('sortDescending')
        Session.set('sortDescending', !currentValue)
    }
})
