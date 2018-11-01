import { Meteor } from 'meteor/meteor'
import { $ } from 'meteor/jquery'
import { _ } from 'meteor/underscore'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Settings, Backgrounds, Sequent } from '../../lib/sequent'
import { RetroPrompts } from './prompts'

import './settings.html'

Template.settings.onCreated(function () {
    const self = this

    self.message = new ReactiveVar('')

    self.setMessage = (msg) => {
        self.message.set(msg)
    }

    self.containsEmoji = (str) => {
        var ranges = [
            '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
            '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
            '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
        ];
        if (str.match(ranges.join('|'))) {
            return true;
        }
        return false;
    }

    self.updateSettings = (settings) => {
        $('#settingsForm').prop('disabled', true);

        Meteor.call('saveSettings', settings, function (err) {
            $('#start-fs').prop('disabled', false);
            if (err) {
                self.setMessage(err.reason)
                return false
            }
            self.setMessage('Settings saved!')
            return true
        })
    }
})

Template.settings.helpers({
    errMessage() {
        return Template.instance().message.get()
    },
    background() {
        return Backgrounds.find()
    },
    selected() {
        const settings = Settings.findOne()
        if (!_.isUndefined(settings)) {
            return this.value === settings.backgroundImage
        }
        return this.value === Sequent.defaultBackground
    },
    backGround() {
        const settings = Sequent.getSettings()
        return settings.backgroundImage
    },
    happy() {
        const settings = Sequent.getSettings()
        return settings.happyPlaceholder
    },
    meh() {
        const settings = Sequent.getSettings()
        return settings.mehPlaceholder
    },
    sad() {
        const settings = Sequent.getSettings()
        return settings.sadPlaceholder
    }
})

Template.settings.events({
    'change #selectedBackground': function (event, instance) {
        instance.message.set('')
        const background = event.currentTarget.value || '';

        if (background === '') {
            instance.setMessage('Please choose a background!')
            return
        }

        const settings = Sequent.getSettings()

        settings.backgroundImage = background

        instance.updateSettings(settings)
    },
    'change #happyPlaceholder': function (event, instance) {
        instance.message.set('')
        let prompt = event.currentTarget.value || ''

        if (prompt === '') {
            prompt = ':)'
        }

        if (instance.containsEmoji(prompt)) {
            instance.setMessage('Emoji not supported at this time')
            return
        }

        let settings = Sequent.getSettings()

        settings.happyPlaceholder = prompt

        if (!instance.updateSettings(settings)) {
            settings = Sequent.getSettings()
            $('#happyPlaceholder').val(settings.happyPlaceholder)
        }
    },
    'change #mehPlaceholder': function (event, instance) {
        instance.message.set('')
        let prompt = event.currentTarget.value || ''

        if (prompt === '') {
            prompt = ':|'
        }

        if (instance.containsEmoji(prompt)) {
            instance.setMessage('Emoji not supported at this time')
            return
        }

        let settings = Sequent.getSettings()

        settings.mehPlaceholder = prompt

        if (!instance.updateSettings(settings)) {
            settings = Sequent.getSettings()
            $('#mehlaceholder').val(settings.mehPlaceholder)
        }
    },
    'change #sadPlaceholder': function (event, instance) {
        instance.message.set('')
        let prompt = event.currentTarget.value || ''

        if (prompt === '') {
            prompt = ':('
        }

        if (instance.containsEmoji(prompt)) {
            instance.setMessage('Emoji not supported at this time')
            return
        }

        let settings = Sequent.getSettings()

        settings.sadPlaceholder = prompt

        if (!instance.updateSettings(settings)) {
            settings = Sequent.getSettings()
            $('#sadPlaceholder').val(settings.sadPlaceholder)
        }
    },
    'click #btnCancel': function (event, instance) {
        FlowRouter.go('/retro/board')
    },
    'click #btnRandom': function (event, instance) {
        const promptSet = RetroPrompts.getRandomPromptSet()
        $('#happyPlaceholder').val(promptSet.happyPlaceholder)
        $('#mehPlaceholder').val(promptSet.mehPlaceholder)
        $('#sadPlaceholder').val(promptSet.sadPlaceholder)

        const settings = Sequent.getSettings()

        settings.happyPlaceholder = promptSet.happyPlaceholder
        settings.mehPlaceholder = promptSet.mehPlaceholder
        settings.sadPlaceholder = promptSet.sadPlaceholder

        instance.updateSettings(settings)
    }
})
