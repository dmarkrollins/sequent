import { Meteor } from 'meteor/meteor'
import { Retros } from '../../lib/sequent'

Template.archive.helpers({
    items(){
        return Retros.find({}, {
            sort: { createdAt: -1 }
        });
    },
    myName(){
        if(Meteor.user()){
            return Meteor.user().username
        }
    }
})