import { Mongo } from 'meteor/mongo'
import { Schemas } from './schemas'

const Sequent = {
    archiveRouteName: 'archives',
    defaultBackground: '/backgrounds/triangles.png',
    defaultConfirmMsg: 'Are you sure?',

    getSettings(){

        let settings = Settings.findOne()
    
        if (!settings){
            settings = {}
            settings.backgroundImage = Sequent.defaultBackground
            settings.happyPlaceholder = ':)'
            settings.mehPlaceholder = ':|'
            settings.sadPlaceholder = ':('
        } 
    
        return settings
    }
}

if (!String.prototype.toProperCase) {
    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
}

const Retros = new Mongo.Collection('retros')
const RetroActions = new Mongo.Collection('retro-actions')
const Backgrounds = new Mongo.Collection('backgrounds')
const Settings = new Mongo.Collection('settings')

Retros.attachSchema(Schemas.Retros)
RetroActions.attachSchema(Schemas.Actions)
Settings.attachSchema(Schemas.Settings)

module.exports = { Sequent, Retros, RetroActions, Backgrounds, Settings }
