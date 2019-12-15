import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { Retros, RetroActions } from '../lib/sequent'
import { Constants } from '../lib/constants'
import { ServerUtils } from './serverUtils'
import cleanInput from './cleanInput'

Meteor.methods({
    sendActionsByEmail(currentRetro, targetEmail) {
        // console.log('hi there')
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged in to perform this action!')
        }

        // const retro = Retros.findOne({ _id: currentRetro })

        // if (!retro) {
        //     throw new Meteor.Error('not-found', 'Retro not found!')
        // }

        // if (retro.createdBy !== this.userId) {
        //     throw new Meteor.Error('not-the-owner', 'You are not the owner of this retro!')
        // }

        const emailToUse = targetEmail || ''

        if (emailToUse === '') {
            throw new Meteor.Error('email-address-required', 'An email address is required!')
        }

        const newEmail = cleanInput(emailToUse)

        if (newEmail === '') {
            throw new Meteor.Error('contains-html', 'Invalid email address!')
        }

        // console.log('email', newEmail)

        const actions = RetroActions.find({
            createdBy: this.userId,
            $or: [
                { status: Constants.RetroItemStatuses.PENDING },
                {
                    status: Constants.RetroItemStatuses.COMPLETE,
                    completedAt: { $gt: new Date(Date.now() - (24 * 60 * 60 * 1000)) }
                }
            ]
        }).fetch()

        if (actions.length === 0) {
            throw new Meteor.Error('no-actions', 'There are no active or recently completed actions to send!')
        }

        const data = {}

        const user = Meteor.users.findOne(this.userId)

        data.retroName = user.username.toProperCase()
        data.currentYear = new Date().getFullYear()
        // turn into html list
        let items = '<tr><th>Action Item</th><th class="text-center" style="width: 25%;">Status</th></tr>'
        data.retroItems = _.sortBy(actions, 'status').forEach((item) => {
            const isComplete = (item.status === Constants.RetroItemStatuses.COMPLETE) ? 'Complete' : 'Active'
            const itemStyle = (item.status === Constants.RetroItemStatuses.COMPLETE) ? 'color: #999; padding: 4px 4px 4px 0px; vertical-align: top;' : 'padding: 4px 4px 4px 0px; vertical-align: top;'
            items += `<tr></tr><td style="${itemStyle}">${item.title}</td><td style="${itemStyle}">${isComplete}</td></tr>`
        })

        data.retroItems = items

        const from = process.env.FROM_EMAIL_ADDRESS || 'sequent@6thcents.com'

        ServerUtils.sendHtmlEmail(newEmail, from, `${user.username.toProperCase()} Action Items`, 'actionItems', data)
    }
})
