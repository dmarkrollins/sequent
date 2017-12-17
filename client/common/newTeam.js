import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Sequent, Settings } from '../../lib/sequent'
import { ReactiveVar } from 'meteor/reactive-var'

Template.newTeam.onCreated(function(){
    
    this.message = new ReactiveVar('')
    
    this.setMessage = (msg) => {
        this.message.set(msg)
    }
})

Template.newTeam.helpers({
    errMessage() {
        return Template.instance().message.get()
    },
    backGround(){
        const settings = Settings.findOne()

        if(!settings){
            return Sequent.defaultBackground
        }
        else {
            return settings.backgoundImage
        }
    }
})

Template.newTeam.events({
    'click #btnCancel': (event) => {
        event.preventDefault()
        FlowRouter.go('/')
    },
    'click #btnCreateNewTeam': (event, template) => {
        event.preventDefault()
        
        template.message.set('')
        const doc = {}
        doc.name = event.target.form.teamName.value || ''
        doc.description = event.target.form.description.value || ''
        doc.password = event.target.form.password.value || ''
        doc.confirmPassword = event.target.form.confirmPassword.value || ''
        
        if(doc.name === ''){
            template.setMessage('Team name required')
            return 
        }
        
        if(doc.password === '' || doc.password !== doc.confirmPassword){
            template.setMessage('Passwords do not match!')
            return
        }
        
        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(doc.password)){
            template.setMessage('Password must be 8 chars and at least 1 uppercase, 1 lowercase, and 1 number :)')
            return
        }            
        
        const options = {
            username: doc.name,
            password: doc.password,
            profile: { description: doc.description}
        }
        
        Accounts.createUser(options, function(err){
            if(err){
                template.setMessage(err)
                return
            }
            FlowRouter.go('/retro/board')
        })
        
    }
})