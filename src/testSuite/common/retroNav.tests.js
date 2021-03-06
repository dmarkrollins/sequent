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
import { RetroActions, Retros, Settings } from '../../lib/sequent'
import { Constants } from '../../lib/constants'
import { TestData } from '../testData'

const should = chai.should();

if (Meteor.isClient) {
    import '../../client/common/retroNav.js'
    import { ConfirmDialog } from '../../client/common/confirmDialog'

    describe('RetroNav Menu', function () {
        let userId
        let sandbox
        let callStub

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
            callStub = sandbox.stub(Meteor, 'call')
        });

        afterEach(function () {
            Template.deregisterHelper('_')
            StubCollections.restore()
            sandbox.restore()
        })

        it('Displays correctly - no retro - no actions', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            callStub.withArgs('getChartUrl').yields(null, '')

            withRenderedTemplate('retroNav', null, (el) => {
                expect($(el).find('a.navbar-brand')[0].href).to.contain('/retro/board')
                expect($(el).find('a.navbar-brand div')[0].innerText).to.equal('Faketeamname')
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
                expect($(el).find('a#sequentHelp'), 'show help link').to.have.length(1)
                expect($(el).find('a#clearBoard'), 'no clear board').to.have.length(0)
                expect($(el).find('a#versionInfo'), 'version info').to.have.length(1)
            });
        })

        it('Displays correctly - no retro - 2 actions', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            callStub.withArgs('getChartUrl').yields(null, '')

            RetroActions.insert(TestData.fakeRetroAction())
            RetroActions.insert(TestData.fakeRetroAction())

            withRenderedTemplate('retroNav', {}, (el) => {
                expect($(el).find('a.navbar-brand div')[0].innerText).to.equal('Faketeamname')
                expect($(el).find('a#actionCount span.badge-error')).to.have.length(1)
                expect($(el).find('a#actionCount')[0].innerText).to.equal('2')
            });
        })

        it('Displays correctly - with retro', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            Retros.insert(await TestData.fakeRetro())

            RetroActions.insert(await TestData.fakeRetroAction())
            RetroActions.insert(await TestData.fakeRetroAction())

            callStub.withArgs('getChartUrl').yields(null, '')

            withRenderedTemplate('retroNav', {}, (el) => {
                expect($(el).find('a.navbar-brand div')[0].innerText).to.equal('Faketeamname')
                expect($(el).find('a#sortByVotes'), 'sort menu option').to.have.length(1)
                expect($(el).find('a#sortByVotes')[0].innerText, 'sort text').to.equal(' Sort By Votes')
                expect($(el).find('a#freezeRetro'), 'freeze menu option').to.have.length(1)
                expect($(el).find('a#freezeRetro')[0].innerText, 'freeze text').to.equal(' Freeze')
                expect($(el).find('a#showCompleted'), 'show-completed menu option').to.have.length(1)
                expect($(el).find('a#showCompleted')[0].innerText, 'show-completed text').to.equal(' Show Completed')
                expect($(el).find('a#archiveRetro'), 'archive retro option').to.have.length(1)
                expect($(el).find('a#clearBoard'), 'show clear board').to.have.length(1)

                expect($(el).find('a#actionCount span.badge-error')).to.have.length(1)
                expect($(el).find('a#actionCount')[0].innerText).to.equal('2')
            });
        })

        it('Displays correctly - frozen', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            Retros.insert(await TestData.fakeRetro({ status: Constants.RetroStatuses.FROZEN }))

            RetroActions.insert(await TestData.fakeRetroAction())
            RetroActions.insert(await TestData.fakeRetroAction())

            callStub.withArgs('getChartUrl').yields(null, '')

            withRenderedTemplate('retroNav', {}, (el) => {
                expect($(el).find('a.navbar-brand div')[0].innerText).to.equal('Faketeamname - FROZEN')
                expect($(el).find('a#freezeRetro'), 'freeze menu item').to.have.length(1)
                expect($(el).find('a#freezeRetro')[0].innerText, 'freeze menu item text').to.equal(' Un-Freeze')
            });
        })

        it('Displays correctly - usage history activated', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            Retros.insert(await TestData.fakeRetro())

            RetroActions.insert(await TestData.fakeRetroAction())
            RetroActions.insert(await TestData.fakeRetroAction())

            callStub.withArgs('getChartUrl').yields(null, 'fake-url')

            withRenderedTemplate('retroNav', {}, (el) => {
                expect($(el).find('a#usageHistory'), 'show usage item').to.have.length(1)
                expect($(el).find('a#usageHistory')[0].innerText, 'show usage item text').to.equal(' Usage History')
            });
        })

        it('toggles show completed menu item', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            Retros.insert(await TestData.fakeRetro({ showCompleted: true }))

            RetroActions.insert(await TestData.fakeRetroAction())
            RetroActions.insert(await TestData.fakeRetroAction())

            callStub.withArgs('getChartUrl').yields(null, '')

            withRenderedTemplate('retroNav', {}, (el) => {
                expect($(el).find('a#showCompleted'), 'show completed menu item').to.have.length(1)
                expect($(el).find('a#showCompleted')[0].innerText, 'show completed menu item text').to.equal(' Hide Completed')
            });
        })

        it('Displays correctly - archive', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const archivedDate = new Date()
            const retro = await TestData.fakeRetro({ status: Constants.RetroStatuses.ARCHIVED, archivedAt: archivedDate })
            Retros.insert(retro)

            RetroActions.insert(TestData.fakeRetroAction())
            RetroActions.insert(TestData.fakeRetroAction())

            callStub.withArgs('getChartUrl').yields(null, '')

            const dateVal = moment(archivedDate).format('MM-DD-YYYY - LT')

            withRenderedTemplate('retroNav', {}, (el) => {
                expect($(el).find('a.navbar-brand div')[0].innerText).to.equal(`Faketeamname - ARCHIVED ${dateVal}`)
            });
        })

        it('Displays correctly - archive - with name', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const archivedDate = new Date()
            const retro = await TestData.fakeRetro({ status: Constants.RetroStatuses.ARCHIVED, archivedAt: archivedDate, archiveName: 'fake retro' })
            Retros.insert(retro)

            RetroActions.insert(TestData.fakeRetroAction())
            RetroActions.insert(TestData.fakeRetroAction())

            callStub.withArgs('getChartUrl').yields(null, '')

            const dateVal = moment(archivedDate).format('MM-DD-YYYY - LT')

            withRenderedTemplate('retroNav', {}, (el) => {
                expect($(el).find('a.navbar-brand div')[0].innerText).to.equal('Faketeamname - ARCHIVED fake retro')
            });
        })

        it('Sort menu item toggles correctly', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const archivedDate = new Date()
            const retro = await TestData.fakeRetro()
            Retros.insert(retro)

            callStub.withArgs('getChartUrl').yields(null, '')

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

        it('When archiving retro user is prompted for optional retro name', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            sandbox.stub(ConfirmDialog, 'showConfirmation').yields('fake archive name')

            const retro = await TestData.fakeRetro()
            Retros.insert(retro)

            callStub.withArgs('getChartUrl').yields(null, '')

            withRenderedTemplate('retroNav', {}, (el) => {
                expect($(el).find('a#archiveRetro'), 'archive retro option').to.have.length(1)

                $(el).find('a#archiveRetro')[0].click()
                Tracker.flush()

                expect(ConfirmDialog.showConfirmation).to.have.been.called
                const args = ConfirmDialog.showConfirmation.args[0]
                expect(args, 'should have 7 args').to.have.length(7)
                expect(args[6], 'input id').to.contain('archiveName')
                expect(args[0], 'the message').to.contain('Are you sure you want to archive this retro?')
                expect(args[0], 'the message input').to.contain('<input')
                expect(args[0], 'the message input').to.contain('id="archiveName"')
                expect(Meteor.call).to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('archiveRetro', retro._id, 'fake archive name')
            });
        })

        it('When clearing retro user is prompted to confirm', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            sandbox.stub(ConfirmDialog, 'showConfirmation').yields('')

            const retro = await TestData.fakeRetro()
            Retros.insert(retro)

            callStub.withArgs('getChartUrl').yields(null, '')

            withRenderedTemplate('retroNav', {}, (el) => {
                expect($(el).find('a#clearBoard'), 'clear board option').to.have.length(1)

                $(el).find('a#clearBoard')[0].click()
                Tracker.flush()

                expect(ConfirmDialog.showConfirmation).to.have.been.called
                const args = ConfirmDialog.showConfirmation.args[0]
                expect(args[0]).to.equal('<p>Are you sure you want clear this retro board?</p><p>All retro items entered, both completed and not completed, will be DELETED!</p><p style="color: #aaa; padding-left: 12px; padding-right: 12px;">If you want to clear the board but save the items for review later <b>Archive</b> this retro instead.</p>')
                expect(args[1]).to.equal('Clear Retro Board?')
                expect(args[2]).to.equal('warning')
                expect(args[3]).to.be.null
                expect(Meteor.call).to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('clearRetroBoard', retro._id)
            });
        })
    })
}
