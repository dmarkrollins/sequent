/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Random } from 'meteor/random'
import { Session } from 'meteor/session'
import { Tracker } from 'meteor/tracker'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment'
import StubCollections from 'meteor/hwillson:stub-collections';
import { withRenderedTemplate } from '../client-test-helpers';
import { RetroActions, Retros, Backgrounds, Settings } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import { TestData } from '../testData'

const should = chai.should();

if (Meteor.isClient) {
    import '../../client/common/retroNav.js'

    describe('RetroNav Menu', function () {
        let userId
        let sandbox

        const fakeUser = {
            username: 'faketeamname'
        }

        const fakeRoute = {
            route: {
                name: 'Fake Route'
            }
        }

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            Template.registerHelper('_', key => key);
            StubCollections.stub([Retros, RetroActions, Settings]);
            sandbox.stub(Meteor, 'subscribe').callsFake(() => ({
                subscriptionId: 0,
                ready: () => true,
            }));
            sandbox.stub(FlowRouter, 'current').returns(fakeRoute)
        });

        afterEach(function () {
            Template.deregisterHelper('_')
            StubCollections.restore()
            sandbox.restore()
        })

        it('Displays correctly - no retro - no actions', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            withRenderedTemplate('retroNav', null, (el) => {
                expect($(el).find('a.navbar-brand span')[0].innerText).to.equal('Faketeamname')
                expect($(el).find('a#actionCount span.badge-error')).to.have.length(0)
                expect($(el).find('a#actionCount')[0].innerText).to.equal('0')
                expect($(el).find('a#btnOptions')).to.have.length(1)
                expect($(el).find('a#btnRetroBoard')).to.have.length(1)
                // active retro items should not appear
                expect($(el).find('a#sortByVotes'), 'sort menu option').to.have.length(0)
                expect($(el).find('a#freezeRetro'), 'freeze menu option').to.have.length(0)
                expect($(el).find('a#showCompleted'), 'show-completed menu option').to.have.length(0)
                expect($(el).find('a#archiveRetro'), 'archive retro option').to.have.length(0)
                // should show standard stuff
                expect($(el).find('a#viewArchives'), 'view archives').to.have.length(1)
                expect($(el).find('a#preferences'), 'preferences').to.have.length(1)
                expect($(el).find('a#shareSequent'), 'share sequent').to.have.length(1)
                expect($(el).find('a#versionInfo'), 'version info').to.have.length(1)
            });
        })

        it('Displays correctly - no retro - 2 actions', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            RetroActions.insert(TestData.fakeRetroAction())
            RetroActions.insert(TestData.fakeRetroAction())

            withRenderedTemplate('retroNav', {}, (el) => {
                expect($(el).find('a.navbar-brand span')[0].innerText).to.equal('Faketeamname')
                expect($(el).find('a#actionCount span.badge-error')).to.have.length(1)
                expect($(el).find('a#actionCount')[0].innerText).to.equal('2')
            });
        })

        it('Displays correctly - with retro', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            Retros.insert(TestData.fakeRetro())

            RetroActions.insert(TestData.fakeRetroAction())
            RetroActions.insert(TestData.fakeRetroAction())


            withRenderedTemplate('retroNav', {}, (el) => {
                expect($(el).find('a.navbar-brand span')[0].innerText).to.equal('Faketeamname')
                expect($(el).find('a#sortByVotes'), 'sort menu option').to.have.length(1)
                expect($(el).find('a#sortByVotes')[0].innerText, 'sort text').to.equal(' Sort By Votes')
                expect($(el).find('a#freezeRetro'), 'freeze menu option').to.have.length(1)
                expect($(el).find('a#freezeRetro')[0].innerText, 'freeze text').to.equal(' Freeze')
                expect($(el).find('a#showCompleted'), 'show-completed menu option').to.have.length(1)
                expect($(el).find('a#showCompleted')[0].innerText, 'show-completed text').to.equal(' Show Completed')
                expect($(el).find('a#archiveRetro'), 'archive retro option').to.have.length(1)

                expect($(el).find('a#actionCount span.badge-error')).to.have.length(1)
                expect($(el).find('a#actionCount')[0].innerText).to.equal('2')
            });
        })

        it('Displays correctly - frozen', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            Retros.insert(TestData.fakeRetro({ status: Constants.RetroStatuses.FROZEN }))

            RetroActions.insert(TestData.fakeRetroAction())
            RetroActions.insert(TestData.fakeRetroAction())

            withRenderedTemplate('retroNav', {}, (el) => {
                expect($(el).find('a.navbar-brand span')[0].innerText).to.equal('Faketeamname - FROZEN')
                expect($(el).find('a#freezeRetro'), 'freeze menu item').to.have.length(1)
                expect($(el).find('a#freezeRetro')[0].innerText, 'freeze menu item text').to.equal(' Un-Freeze')
            });
        })

        it('toggles show completed menu item', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            Retros.insert(TestData.fakeRetro({ showCompleted: true }))

            RetroActions.insert(TestData.fakeRetroAction())
            RetroActions.insert(TestData.fakeRetroAction())

            withRenderedTemplate('retroNav', {}, (el) => {
                expect($(el).find('a#showCompleted'), 'show completed menu item').to.have.length(1)
                expect($(el).find('a#showCompleted')[0].innerText, 'show completed menu item text').to.equal(' Hide Completed')
            });
        })

        it('Displays correctly - archive', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const archivedDate = new Date()
            const retro = TestData.fakeRetro({ status: Constants.RetroStatuses.ARCHIVED, archivedAt: archivedDate })
            Retros.insert(retro)

            RetroActions.insert(TestData.fakeRetroAction())
            RetroActions.insert(TestData.fakeRetroAction())

            const dateVal = moment(archivedDate).format('MM-DD-YYYY - LT')

            withRenderedTemplate('retroNav', {}, (el) => {
                expect($(el).find('a.navbar-brand span')[0].innerText).to.equal(`Faketeamname - ARCHIVED ${dateVal}`)
            });
        })

        it('Sort menu item toggles correctly', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const archivedDate = new Date()
            const retro = TestData.fakeRetro()
            Retros.insert(retro)

            withRenderedTemplate('retroNav', {}, (el) => {
                expect($(el).find('a#sortByVotes'), 'sort menu option').to.have.length(1)
                expect($(el).find('a#sortByVotes')[0].innerText, 'sort text').to.equal(' Sort By Votes')
                expect($(el).find('a#sortByVotes i.fa-sort-amount-desc'), 'has asc sort icon').to.have.length(1)
                expect($(el).find('a#sortByVotes i.fa-sort'), 'should not have default sort icon').to.have.length(0)

                Session.set('sortDescending', true)
                Tracker.flush()

                expect($(el).find('a#sortByVotes')[0].innerText, 'sort text').to.equal(' Remove Sort')
                expect($(el).find('a#sortByVotes i.fa-sort-amount-desc'), 'no asc sort icon').to.have.length(0)
                expect($(el).find('a#sortByVotes i.fa-sort'), 'has default sort icon').to.have.length(1)
            });
        })
    })
}
