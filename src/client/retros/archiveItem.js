import { Template } from 'meteor/templating'
import './archiveItem.html'

Template.archiveItem.helpers({
    itemCount() {
        return this.items.length
    },
    archiveDate() {
        return this.archivedAt || this.createdAt
    },
})
