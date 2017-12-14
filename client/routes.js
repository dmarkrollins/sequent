import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { BlazeLayout } from 'meteor/kadira:blaze-layout'
import { Retros, RetroActions } from '../lib/sequent'

FlowRouter.route('/', {
    action: function() {
        if (Meteor.userId()) {
            FlowRouter.go('/retro/board')
        }
        else {
            BlazeLayout.render('layout', { content: 'start' });
        }
    }
});

FlowRouter.route('/new', {
    action: function() {
        BlazeLayout.render('layout', {content: 'newTeam'});
    }
});

RetroRouter = FlowRouter.group({
    prefix: '/retro',
    name: 'admin',
    triggersEnter: [function(context, redirect) {
        if(!Meteor.userId()) {
            FlowRouter.go('/')
        }
    }]
  });

RetroRouter.route('/board', {
    subscriptions: function(params) {
      this.register('retros', Meteor.subscribe('active-retros'))  
      this.register('actions', Meteor.subscribe('open-actions'))
    },
    action: function() {
        BlazeLayout.render('retroLayout', {content: 'retroBoard'});
    }
    
})

RetroRouter.route('/actions', {
    subscriptions: function(params) {
      this.register('retros', Meteor.subscribe('active-retros'))  
      this.register('actions', Meteor.subscribe('open-actions'))
    },
    action: function() {
        BlazeLayout.render('retroLayout', {content: 'actionsList'});
    }
    
})

RetroRouter.route('/versions', {
    subscriptions: function(params) {
        this.register('retros', Meteor.subscribe('active-retros'))  
        this.register('actions', Meteor.subscribe('open-actions'))
      },
      action: function() {
        BlazeLayout.render('retroLayout', {content: 'sequentVersions'});
    }
    
})