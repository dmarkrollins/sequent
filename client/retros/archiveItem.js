Template.archiveItem.helpers({
    itemCount(){
        return this.items.length
    },
    archiveDate(){
        return this.archivedAt || this.createdAt
    }
})