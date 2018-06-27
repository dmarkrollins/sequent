import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Retros, Sequent } from '../../lib/sequent';

import './archive.html';

Template.archive.helpers({
    items() {
        return Retros.find({}, {
            sort: { createdAt: -1 },
        });
    },
    myName() {
        if (Meteor.user()) {
            return Meteor.user().username.toProperCase();
        }
    },
    backGround() {
        const settings = Sequent.getSettings();
        return settings.backgroundImage;
    },

});
