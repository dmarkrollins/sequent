import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Retros, RetroActions } from '../../lib/sequent'
import './actionInput.html'

Template.actionInput.helpers({
    shouldShowSend() {
        const items = RetroActions.find().fetch().length
        if (items > 0 && this.showSend) {
            return true
        }
        return false
    },
    retroId() {
        const retro = Retros.findOne()
        if (retro) {
            return retro._id
        }
        return null
    }
})
