
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Constants } from './constants'

const Schemas = {}

Schemas.RetroItem = new SimpleSchema({
    
    itemId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    },
    title: {
        type: String,
        max: 255
    },
    status: {
        type: String,
        allowedValues: Constants.RetroItemStatuses.values
    },
    itemType: {
        type: String,
        allowedValues: Constants.RetroItemTypes.values
    },
    votes: {
        type: Number,
        optional: true
    },
    createdAt: {
        type: Date
    }
    
})

Schemas.Retros = new SimpleSchema({
    
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    },
    createdAt: {
        type: Date,   
        autoValue: function() {
            if ( this.isInsert ) {
                return new Date;
            }
            else {
                this.unset()
            }
        }
    },
    createdBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue: function() {
            if ( this.isInsert ) {
                return this.userId;
            } else {
                this.unset()
            }
        }
    },
    status: {
        type: String,
        allowedValues: Constants.RetroStatuses.values
    },
    items: {
        type: [Schemas.RetroItem]
    },
    showCompleted: {
        type: Boolean,
        optional: true,
        defaultValue: false
    }
})

Schemas.Actions = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    },
    createdAt: {
        type: Date,   
        autoValue: function() {
            if ( this.isInsert ) {
                return new Date;
            }
            else {
                this.unset()
            }
        }
    },
    createdBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue: function() {
            if ( this.isInsert ) {
                return this.userId;
            } else {
                this.unset()
            }
        }
    },
    title: {
        type: String,
        max: 255
    },
    status: {
        type: String,
        allowedValues: Constants.RetroItemStatuses.values
    },
    completedAt: {
        type: Date,
        optional: true
    }
})

Schemas.NewTeam = new SimpleSchema({
    name: {
        type: String,
        max: 60,
        min: 5
    },
    description: {
        type: String,
        optional: true,
        max: 255
    },
    password: {
        type: String,
        regEx: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        min: 8,
    },
    confirmPassword: {
        type: String,
        min: 8,
        custom() {
            if (this.value !== this.field('password').value) {
                return "passwordMismatch";
            }
        }
    }
})

module.exports = { Schemas }
