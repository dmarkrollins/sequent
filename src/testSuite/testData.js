/* global moment */
import { Random } from 'meteor/random'
import { _ } from 'meteor/underscore'
import { Constants } from '../lib/constants'

const TestData = {

    fakeSettings(parameters) {
        let parms = {}

        if (!_.isUndefined(parameters)) {
            parms = parameters;
        }

        const Settings = {}
        Settings.backgroundImage = '/fakeOne.jpg'
        Settings.happyPlaceholder = 'Fake happy placeholder'
        Settings.mehPlaceholder = 'Fake meh placeholder'
        Settings.sadPlaceholder = 'Fake sad placeholder'

        return Settings
    },
    fakeBackgroundsArray(parameters) {
        let parms = {}

        if (!_.isUndefined(parameters)) {
            parms = parameters;
        }

        const Backgrounds = []

        Backgrounds.push({ name: 'fakeOne', value: '/fakeOne.jpg' })
        Backgrounds.push({ name: 'fakeTwo', value: '/fakeTwo.jpg' })
        Backgrounds.push({ name: 'fakeThree', value: '/fakeThree.jpg' })
        Backgrounds.push({ name: 'fakeFour', value: '/fakeFour.jpg' })
        Backgrounds.push({ name: 'fakeFive', value: '/fakeFive.jpg' })

        return Backgrounds
    },

    fakeRetroAction(parameters) {
        let parms = {}

        if (!_.isUndefined(parameters)) {
            parms = parameters;
        }

        const RetroAction = {}

        RetroAction._id = parms._id || Random.id()
        RetroAction.createdBy = parms.createdBy || Random.id()
        RetroAction.createdAt = parms.createdAt || new Date()
        RetroAction.title = parms.title || 'fake title'
        RetroAction.status = parms.status || Constants.RetroItemStatuses.PENDING
        RetroAction.completedAt = parms.completedAt || null

        return RetroAction
    },

    fakeRetroItem(parameters) {
        let parms = {}

        if (!_.isUndefined(parameters)) {
            parms = parameters;
        }

        const RetroItem = {}

        RetroItem.itemId = parms.itemId || Random.id()
        RetroItem.title = parms.title || 'fake title'
        RetroItem.status = parms.status || Constants.RetroItemStatuses.PENDING
        RetroItem.itemType = parms.itemType || Random.choice([Constants.RetroItemTypes.HAPPY, Constants.RetroItemTypes.MEH, Constants.RetroItemTypes.SAD])
        RetroItem.votes = parms.votes || 0
        RetroItem.createdAt = parms.createdAt || new Date()

        return RetroItem
    },

    fakeRetroItems(parameters, count) {
        const items = []

        if (!count) count = 1

        for (let i = 0; i < count; i += 1) {
            items.push(this.fakeRetroItem(parameters)) //  eslint-disable-line
        }

        return items
    },

    fakeRetro(parameters) {
        let parms = {}

        if (!_.isUndefined(parameters)) {
            parms = parameters;
        }

        const Retro = {}

        Retro._id = parms._id || Random.id()
        Retro.createdAt = new Date()
        Retro.createdBy = parms.createdBy || Random.id()
        Retro.title = parms.title || 'fake title'
        Retro.status = parms.status || Constants.RetroStatuses.ACTIVE
        Retro.items = parms.items || this.fakeRetroItems({}, parms.count || 3)
        Retro.showCompleted = _.isUndefined(parms.showCompleted) ? false : parms.showCompleted
        Retro.archivedAt = parms.archivedAt || new Date()
        Retro.happyPlaceholder = 'Fake happy placeholder'
        Retro.mehPlaceholder = 'Fake meh placeholder'
        Retro.sadPlaceholder = 'Fake sad placeholder'

        return Retro
    }
}

module.exports = { TestData }

