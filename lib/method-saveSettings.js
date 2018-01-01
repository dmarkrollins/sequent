import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { Match } from 'meteor/check'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { _ } from 'meteor/underscore'
import { Settings } from './sequent'
import { Schemas } from './schemas'
import { Logger } from './logger'

Meteor.methods({

    saveSettings(doc) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

        Schemas.Settings.validate(doc)

        const settings = Settings.findOne({ createdBy: this.userId })

        try {
            if (_.isUndefined(settings)) {
                Settings.insert(doc)
            } else {
                Settings.update(
                    { _id: settings._id },
                    {
                        $set: {
                            backgroundImage: doc.backgroundImage,
                            happyPlaceholder: doc.happyPlaceholder,
                            mehPlaceholder: doc.mehPlaceholder,
                            sadPlaceholder: doc.sadPlaceholder
                        }
                    }
                )
            }
        } catch (err) {
            Logger.log(err)
            return new Meteor.Error('update-failed', 'We could not update settings - please try again later')
        }
    }

})
