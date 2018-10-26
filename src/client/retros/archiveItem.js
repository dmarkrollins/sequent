import { Template } from 'meteor/templating'
import moment from 'moment'
import './archiveItem.html'

Template.archiveItem.helpers({
    itemCount() {
        return this.items.length
    },
    archiveDate() {
        return this.archivedAt || this.createdAt
    },
    nameOfArchive() {
        if (!this.archiveName) {
            return moment(this.archivedAt).format('MM-DD-YYYY - LT')
        }
        return this.archiveName
    }
})
