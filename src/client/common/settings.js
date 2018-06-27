import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating' 
import { ReactiveVar } from 'meteor/reactive-var'
import { Settings, Backgrounds, Sequent } from '../../lib/sequent'
import { RetroPrompts } from './prompts'

import './settings.html'

Template.settings.onCreated(function() {

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
        } else {
            return false;
        }
    }

    self.updateSettings = (settings) => {

        $("#settingsForm").prop('disabled',true);

        Meteor.call('saveSettings', settings, function(err){
            $("#start-fs").prop('disabled',false);
            if(err){
                self.setMessage(err)
                return
            }
            self.setMessage('Settings saved!')
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
        if(!_.isUndefined(settings)){
            return this.value === settings.backgroundImage
        }
        return this.value === Sequent.defaultBackground
    },
    backGround(){
        const settings = Sequent.getSettings()
        return settings.backgroundImage
    },
    happy(){
        const settings = Sequent.getSettings()
        return settings.happyPlaceholder
    },
    meh(){
        const settings = Sequent.getSettings()
        return settings.mehPlaceholder
    },
    sad(){
        const settings = Sequent.getSettings()
        return settings.sadPlaceholder
    }
})

Template.settings.events({
    'change #selectedBackground': function(event, template) {
        template.message.set('')
        const background = event.currentTarget.value || '';
        
        if(background === ''){
            template.setMessage('Please choose a background!')
            return
        }

        const settings = Sequent.getSettings()

        settings.backgroundImage = background
       
        template.updateSettings(settings)

    },
    'change #happyPlaceholder': function(event, template){
        template.message.set('')
        const prompt = event.currentTarget.value || ''

        if(prompt === ''){
            prompt = ':)'
        }

        if(template.containsEmoji(prompt)){
            template.setMessage('Emoji not supported at this time')
            return
        }

        const settings = Sequent.getSettings()

        settings.happyPlaceholder = prompt

        template.updateSettings(settings)
        
    },
    'change #mehPlaceholder': function(event, template){
        template.message.set('')
        const prompt = event.currentTarget.value || ''

        if(prompt === ''){
            prompt = ':|'
        }

        if(template.containsEmoji(prompt)){
            template.setMessage('Emoji not supported at this time')
            return
        }

        const settings = Sequent.getSettings()

        settings.mehPlaceholder = prompt

        template.updateSettings(settings)        
    },
    'change #sadPlaceholder': function(event, template){
        template.message.set('')
        const prompt = event.currentTarget.value || ''

        if(prompt === ''){
            prompt = ':('
        }

        if(template.containsEmoji(prompt)){
            template.setMessage('Emoji not supported at this time')
            return
        }

        const settings = Sequent.getSettings()

        settings.sadPlaceholder = prompt

        template.updateSettings(settings)        
    },
    'click #btnCancel': function(event, instance) {
        FlowRouter.go('/retro/board')
    },
    'click #btnRandom': function(event, instance) {
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