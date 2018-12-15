import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { $ } from 'meteor/jquery'
import { Sequent, Settings } from '../../lib/sequent'

import './start.html'

Template.start.onCreated(function () {
    this.message = new ReactiveVar('')

    this.setMessage = (msg) => {
        this.message.set(msg)
    }
})

Template.start.helpers({
    errMessage() {
        return Template.instance().message.get()
    },
    backGround() {
        const settings = Sequent.getSettings()
        return settings.backgroundImage
    }
})

Template.start.events({
    'keypress form#start-form'(event, template) {
        if (event.which === 13) {
            event.preventDefault();
            $('#start-form').submit()
        }
    },
    'click #btnNewTeam'(event) {
        event.preventDefault();
        FlowRouter.go('/new')
    },
    'submit #start-form': function (event, template) {
        event.preventDefault();

        template.message.set('')
        const name = event.target.teamName.value || '';
        const password = event.target.password.value || '';

        if (name === '' || password === '') {
            template.message.set('Invalid team name and password combination!')
            return
        }

        $('#start-fs').prop('disabled', true);

        Meteor.loginWithPassword(name, password, function (err) {
            $('#start-fs').prop('disabled', false);
            if (err) {
                template.setMessage('Invalid user name password combination!')
                return
            }
            FlowRouter.go('/retro/board')
        })
    }
})
