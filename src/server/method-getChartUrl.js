import { Meteor } from 'meteor/meteor'

Meteor.methods({
    getChartUrl() {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

        const retval = process.env.USAGE_URL || ''

        return retval
    }
})
