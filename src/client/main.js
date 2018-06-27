/* global Image */

import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { Template } from 'meteor/templating'
import { _ } from 'meteor/underscore'
import { BlazeLayout } from 'meteor/kadira:blaze-layout'
import moment from 'moment'

let loadedImages = []

const preLoadImages = () => {
    Meteor.call('componentImages', function (error, result) {
        if (!error) {
            loadedImages = []
            result.forEach((item) => {
                const img = new Image()
                img.src = `https://${window.location.hostname}${item.fileName}` //eslint-disable-line
                loadedImages.push(img)
            })
        }
    })
}

Meteor.startup(() => {
    BlazeLayout.setRoot('body')
    Session.set('sortDescending', false)
    preLoadImages()
})

if (!String.prototype.toProperCase) {
    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    };
}

Template.registerHelper('formatDate', function (value) {
    if (_.isDate(value)) {
        return moment(value).format('MM-DD-YYYY');
    }

    return '';
});

Template.registerHelper('formatDateWithTime', function (value) {
    if (_.isDate(value)) {
        return moment(value).format('MM-DD-YYYY - LT');
    }
    return '';
});
