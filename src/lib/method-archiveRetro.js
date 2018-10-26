import { Meteor } from 'meteor/meteor'
import moment from 'moment'
import { Settings, Retros } from './sequent'
import { Schemas } from './schemas'
import { Constants } from './constants'
import { Logger } from './logger'

const inputName = (name, dateVal) => {
    if (!name) return `${dateVal}`
    if (name === '') return `${dateVal}`
    return name
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

        // console.log('Archive Name', archiveName)

        const settings = Settings.findOne({ createdBy: this.userId })

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
