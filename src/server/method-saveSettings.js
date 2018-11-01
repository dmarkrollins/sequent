import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { Match } from 'meteor/check'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { _ } from 'meteor/underscore'
import { Settings } from '../lib/sequent'
import { Schemas } from '../lib/schemas'
import { Logger } from '../lib/logger'
import cleanInput from './cleanInput'

Meteor.methods({

    saveSettings(doc) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

        Schemas.Settings.validate(doc)

        const settings = Settings.findOne({ createdBy: this.userId })

        const happy = cleanInput(doc.happyPlaceholder, ':)')
        const meh = cleanInput(doc.mehPlaceholder, ':|')
        const sad = cleanInput(doc.sadPlaceholder, ':(')

        if (happy !== doc.happyPlaceholder || meh !== doc.mehPlaceholder || sad !== doc.sadPlaceholder) {
            throw new Meteor.Error('invalid-prompt', 'Invalid prompt! HTML Tags not allowed.')
        }

        try {
            if (_.isUndefined(settings)) {
                Settings.insert(doc)
            } else {
                Settings.update(
                    { _id: settings._id },
                    {
                        $set: {
                            backgroundImage: doc.backgroundImage,
                            happyPlaceholder: happy,
                            mehPlaceholder: meh,
                            sadPlaceholder: sad
                        }
                    }
                )
            }
        } catch (err) {
            Logger.log(err)
            throw new Meteor.Error('update-failed', 'We could not update settings - please try again later')
        }
    }

})
