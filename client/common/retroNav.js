/* global PackageInfo */
import moment from 'moment'
import { ConfirmDialog } from './confirmDialog'
import { Retros, RetroActions, Sequent } from '../../lib/sequent'
import { Constants} from '../../lib/constants'

import '../version'
import './retroNav.html'

Template.retroNav.helpers({
    projectName() {
        if (!Meteor.user()) return ''
        
        return Meteor.user().username.toProperCase()
    },
    actionCount() {
        return RetroActions.find().count()
    },
    badgeClass() {
        if ( RetroActions.find().count() > 0) {
            return 'badge-error'
        }
        return ''
    },
    freezeText() {
        const retro = Retros.findOne()
        if(!retro) return
        if (retro.status === Constants.RetroStatuses.FROZEN) {
            return 'Un-Freeze'
        }
        return 'Freeze'
    },
    freezeTitle(){
        const retro = Retros.findOne()
        if(!retro) return ''

        if(FlowRouter.current().route.name === Sequent.archiveRouteName){
            return ''
        }

        switch(retro.status){
            case Constants.RetroStatuses.FROZEN: 
                return Spacebars.SafeString('<span style="color: #00BFFF;"> - FROZEN</span>')
            case Constants.RetroStatuses.ARCHIVED:
                const dateToUse = retro.archivedAt || retro.createdAt
                const dateVal = moment(dateToUse).format("MM-DD-YYYY - LT")
                return Spacebars.SafeString(`<span style="color: #DAA520;"> - ARCHIVED ${dateVal}</span>`)
            default:
                return ''
        }
    },
    showActiveRetroMenuItems() {
        // {$or: [{expires: {$gte: new Date()}}, {expires: null}]}
        const retro = Retros.findOne({ $or: [{ status: Constants.RetroStatuses.ACTIVE }, { status: Constants.RetroStatuses.FROZEN }] })
        if(!retro) return false
        return true
    },
    completeViewClass() {
        const retro = Retros.findOne()
        if(!retro) return 'fa-eye menuBlue'

        if(retro.showCompleted) return 'fa-eye-slash menuRed'

        return 'fa-eye menuBlue'
    },
    completeViewColor() {
        const retro = Retros.findOne()
        if(!retro) return '#2b71cc'

        if(retro.showCompleted) return '#990000'

        return '#2b71cc'
    },
    showCompletedText() {
        const retro = Retros.findOne()

        if(!retro) return ''

        if(retro.showCompleted) return 'Hide Completed'

        return 'Show Completed'
    },
    currentVersion() {
        return `Version ${PackageInfo.version}`        
    }
    
})

Template.retroNav.events({

    'click #archiveRetro'(){
        const title = 'Archive Retro?'
        const msg = 'Are you sure you want to archive this retro?'

        ConfirmDialog.showConfirmation(msg, title, 'warning', null, function(){
            const retro = Retros.findOne()

            if(!retro) return
    
            Meteor.call('archiveRetro', retro._id, function(err){
                if(err){
                    console.log(err)
                    toastr.error('Failed to archive the retro!')
                }
            })
        })
    },

    'click #signOut'() {
        Meteor.logout((err)=>{
            if(!err){
                FlowRouter.go('/')
            }
        })
    },
    'click #freezeRetro'() {

        const retro = Retros.findOne()
        
        if(!retro) return
        
        Meteor.call('toggleRetroFrozen', function(err){
            if(err){
                console.log(err)
                toastr.error('Failed to freeze the retro!')
            }
        })
    },
    'click #showCompleted'() {
        
        const retro = Retros.findOne()

        if(!retro) return
        
        Meteor.call('toggleShowCompleted', retro._id, function(err){
            if(err){
                console.log(err)
                toastr.error('Failed to toggle completed view!')
            }
        })        
    }
    
})