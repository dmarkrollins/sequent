import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { BlazeLayout } from 'meteor/kadira:blaze-layout'
import { Retros, RetroActions, Settings } from '../lib/sequent'

FlowRouter.route('/', {
    action: function () {
        if (Meteor.userId()) {
            FlowRouter.go('/retro/board')
        } else {
            BlazeLayout.render('startLayout', { content: 'start' });
        }
    },
    name: 'start'
});

FlowRouter.route('/new', {
    action: function () {
        BlazeLayout.render('newLayout', { content: 'newTeam' });
    },
    name: 'new-team'
});

FlowRouter.route('/versions', {
    subscriptions: function (params) {
        this.register('retros', Meteor.subscribe('active-retros'))
        this.register('actions', Meteor.subscribe('open-actions'))
        this.register('settings', Meteor.subscribe('settings'))
    },
    action: function () {
        BlazeLayout.render('retroLayout', { content: 'sequentVersions' });
    },
    name: 'versions'

})

FlowRouter.route('/history', {
    subscriptions: function (params) {
        this.register('retros', Meteor.subscribe('active-retros'))
        this.register('actions', Meteor.subscribe('open-actions'))
        this.register('settings', Meteor.subscribe('settings'))
    },
    action: function () {
        BlazeLayout.render('retroLayout', { content: 'historyChart' });
    },
    name: 'chart'

})

var RetroRouter = FlowRouter.group({ // eslint-disable-line
    prefix: '/retro',
    name: 'admin',
    triggersEnter: [function (context, redirect) {
        if (!Meteor.userId()) {
            FlowRouter.go('/')
        }
    }]
});

RetroRouter.route('/board', {
    subscriptions: function (params) {
        this.register('retros', Meteor.subscribe('active-retros'))
        this.register('actions', Meteor.subscribe('open-actions'))
        this.register('settings', Meteor.subscribe('settings'))
    },
    action: function () {
        BlazeLayout.render('retroLayout', { content: 'retroBoard' });
    },
    name: 'retro-board'
})

RetroRouter.route('/actions', {
    subscriptions: function (params) {
        this.register('retros', Meteor.subscribe('active-retros'))
        this.register('settings', Meteor.subscribe('settings'))
    },
    action: function () {
        BlazeLayout.render('retroLayout', { content: 'actionsList' });
    },
    name: 'actions'

})

RetroRouter.route('/settings', {
    subscriptions: function (params) {
        this.register('retros', Meteor.subscribe('active-retros'))
        this.register('actions', Meteor.subscribe('open-actions'))
        this.register('backgrounds', Meteor.subscribe('backgrounds'))
        this.register('settings', Meteor.subscribe('settings'))
    },
    action: function () {
        BlazeLayout.render('retroLayout', { content: 'settings' });
    }
})

RetroRouter.route('/archives', {
    subscriptions: function (params) {
        this.register('retros', Meteor.subscribe('archived-retros'))
        this.register('actions', Meteor.subscribe('open-actions'))
        this.register('settings', Meteor.subscribe('settings'))
    },
    action: function () {
        BlazeLayout.render('retroLayout', { content: 'archive' });
    },
    name: 'archives'
})

RetroRouter.route('/archives/:retroId', {
    subscriptions: function (params) {
        this.register('retros', Meteor.subscribe('single-archived-retro', params.retroId))
        this.register('actions', Meteor.subscribe('open-actions'))
        this.register('settings', Meteor.subscribe('settings'))
    },
    action: function () {
        BlazeLayout.render('retroLayout', { content: 'archiveBoard' });
    },
    name: 'archive-board'
})
