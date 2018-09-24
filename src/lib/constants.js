const Constants = {
    RetroStatuses: {
        ACTIVE: 'Active',
        ARCHIVED: 'Archived',
        FROZEN: 'Frozen',
        values: ['Active', 'Archived', 'Frozen']
    },
    RetroItemStatuses: {
        PENDING: 'Pending',
        COMPLETE: 'Complete',
        values: ['Pending', 'Complete']
    },
    RetroItemTypes: {
        HAPPY: 'Happy',
        MEH: 'Meh',
        SAD: 'Sad',
        ACTION: 'Action',
        values: ['Happy', 'Meh', 'Sad', 'Action']
    }
}

module.exports = { Constants }
