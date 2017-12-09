import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Sequent } from '../../lib/sequent'

import './start.html'

Template.start.onCreated(function() {
    this.message = new ReactiveVar('')
    
    this.setMessage = (msg) => {
        this.message.set(msg)
    }
})

Template.start.helpers({
    errMessage() {
        return Template.instance().message.get()
    }
})

Template.start.events({
    'click #btnNewTeam'(event) {
        event.preventDefault();
        FlowRouter.go('/new')
    },
    'click #btnNext': function(event, template) {
        event.preventDefault();
        
        template.message.set('')
        const name = event.target.form.teamName.value || '';
        const password = event.target.form.password.value|| '';
        
        if(name === '' || password === ''){
            template.message.set('Invalid team name and password combination!')
            return
        }
        
        $("#start-fs").prop('disabled',true);
        
        Meteor.loginWithPassword(name, password, function(err){
            $("#start-fs").prop('disabled',false);
            if(err){
                template.setMessage(err)
                return
            }
            FlowRouter.go('/retro/board')
        })
        
    }
})