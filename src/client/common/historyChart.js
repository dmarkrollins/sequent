import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Sequent } from '../../lib/sequent'

Template.historyChart.helpers({
    background() {
        const settings = Sequent.getSettings()
        return settings.backgroundImage
    }
})
