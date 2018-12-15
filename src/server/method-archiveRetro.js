import { Meteor } from 'meteor/meteor'
import moment from 'moment'
import { Settings, Retros } from '../lib/sequent'
import { Schemas } from '../lib/schemas'
import { Constants } from '../lib/constants'
import { Logger } from '../lib/logger'
import cleanInput from './cleanInput'

const inputName = (name, dateVal) => {
    const newName = cleanInput(name)
    if (!newName) return `${dateVal}`
    if (newName === '') return `${dateVal}`
    return newName
}


Meteor.methods({

    archiveRetro(retroId, name) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

        const retro = Retros.findOne({
            _id: retroId,
            createdBy: this.userId
        })

        if (!retro) {
            throw new Meteor.Error('not-found', 'Retro could not be found!')
        }

        if (retro.status === Constants.RetroStatuses.ARCHIVED) {
            throw new Meteor.Error('already-archived', 'Retro was already archived!')
        }

        const archivedAt = new Date()

        const dateVal = moment(archivedAt).format('MM-DD-YYYY - LT')

        const archiveName = inputName(name, dateVal)

        if (archiveName !== name && name !== '') {
            throw new Meteor.Error('invalid-name', 'Invalid Archive name. HTML tags not allowed!')
        }

        let settings = Settings.findOne({ createdBy: this.userId })

        if (!settings) {
            settings = {
                happyPlaceholder: ':)',
                mehPlaceholder: ':|',
                sadPlaceholder: ':('
            }
        }

        try {
            Retros.update(
                { _id: retro._id },
                {
                    $set:
                    {
                        status: Constants.RetroStatuses.ARCHIVED,
                        archivedAt,
                        archiveName,
                        happyPlaceholder: settings.happyPlaceholder,
                        mehPlaceholder: settings.mehPlaceholder,
                        sadPlaceholder: settings.sadPlaceholder
                    }
                }
            )
        } catch (err) {
            Logger.log(err)
            throw new Meteor.Error('update-failed', 'We could not archive the retro - please try again later')
        }
    }

})
