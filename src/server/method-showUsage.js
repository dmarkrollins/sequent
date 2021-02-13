import { Meteor } from 'meteor/meteor'

Meteor.methods({

    showUsage() {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in', 'You must be logged into a retro board!')
        }

        const retval = process.env.SHOW_USAGE || 'no'

        return (retval === 'yes')
    }
})
