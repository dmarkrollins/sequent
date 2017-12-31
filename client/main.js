import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { _ } from 'meteor/underscore'
import { BlazeLayout } from 'meteor/kadira:blaze-layout'
import moment from 'moment'

Meteor.startup(() => {
    BlazeLayout.setRoot('body')
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
