import { Meteor } from 'meteor/meteor'
import { Settings } from '../lib/sequent'

Settings._ensureIndex('createdBy', 1)

Meteor.publish('settings', function () {
    if (!Meteor.userId()) {
        return null
    }

    return Settings.find({ createdBy: Meteor.userId() })
});

