import { Retros, RetroActions } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

Template.retroNav.helpers({
    projectName() {
        if (!Meteor.user()) return ''
        
        return Meteor.user().username
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
            return 'Un-Freeze Retro'
        }
        return 'Freeze Retro'
    },
    freezeTitle(){
        const retro = Retros.findOne()
        if(!retro) return
        if (retro.status === Constants.RetroStatuses.FROZEN) {
            return ' - FROZEN'
        }
        return ''
    }
})

Template.retroNav.events({
    'click #signOut'() {
        Meteor.logout((err)=>{
            if(!err){
                FlowRouter.go('/')
            }
        })
    },
    'click #freezeRetro'() {
        Meteor.call('toggleRetroFrozen', function(err){
            if(err){
                console.log(err)
                toastr.error('Failed to freeze the retro!')
            }
        })
    },
    'click #archiveRetro'() {
        const r = confirm('Are you sure?')
        if(!r) return
        
        const retro = Retros.findOne()
        
        Meteor.call('archiveRetro', retro._id, function(err){
            if(err){
                console.log(err)
                toastr.error('Failed to archive the retro!')
            }
        })
    }
    
})