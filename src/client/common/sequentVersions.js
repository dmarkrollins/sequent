import { Template } from 'meteor/templating'
import { Sequent } from '../../lib/sequent'

Template.sequentVersions.helpers({
    background() {
        const settings = Sequent.getSettings()
        return settings.backgroundImage
    }
})
