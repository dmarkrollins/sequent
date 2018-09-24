/* global Assets Template */
import { Meteor } from 'meteor/meteor'
import { SSR } from 'meteor/meteorhacks:ssr'
import { Email } from 'meteor/email'
import check from 'meteor/check'
import { Constants } from '../lib/constants'

if (!String.prototype.toProperCase) {
    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    };
}

SSR.compileTemplate('actionItems', Assets.getText('emailTemplates/actionItems.html'));

Template.actionItems.helpers({
    isComplete: function () {
        return this.status === Constants.RetroItemStatuses.COMPLETE
    }
})

const ServerUtils = {}

ServerUtils.sendEmail = (to, from, subject, text) => {
    check([to, from, subject, text], [String]);

    Meteor.defer(function () {
        Email.send({
            to: to,
            from: from || 'noreply@6thcents.com',
            subject: subject,
            text: text
        });
    });
}

ServerUtils.sendHtmlEmail = (to, from, subject, templateName, data) => {
    var body = SSR.render(templateName, data);

    Meteor.defer(function () {
        Email.send({
            to: to,
            from: from || 'noreply@6thcents.com',
            subject: subject,
            html: body
        })
    });
}

module.exports = { ServerUtils }
