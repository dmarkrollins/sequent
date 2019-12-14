import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Retros, RetroActions } from '../../lib/sequent'
import './actionInput.html'

Template.actionInput.helpers({
    shouldShowButtons() {
        return this.showSend
    },
    retroId() {
        const retro = Retros.findOne()
        if (retro) {
            return retro._id
        }
        return null
    },
    completedIcon() {
        return this.showCompleted ? 'fa-toggle-on' : 'fa-toggle-off'
    }
})
