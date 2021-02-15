import { Meteor } from 'meteor/meteor'
import { ReactiveVar } from 'meteor/reactive-var'
import { Template } from 'meteor/templating'
import { Sequent } from '../../lib/sequent'

Template.historyChart.onCreated(function () {
    const self = this

    self.chartUrl = new ReactiveVar('')

    Meteor.call('getChartUrl', function (err, result) {
        if (!err) {
            self.chartUrl.set(result)
        }
    })
})

Template.historyChart.helpers({
    background() {
        const settings = Sequent.getSettings()
        return settings.backgroundImage
    },
    historyUrl() {
        return Template.instance().chartUrl.get()
    }
})
