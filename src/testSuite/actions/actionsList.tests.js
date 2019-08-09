/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Random } from 'meteor/random'
import { $ } from 'meteor/jquery';
import { Session } from 'meteor/session'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { Tracker } from 'meteor/tracker';
import StubCollections from 'meteor/hwillson:stub-collections';
import { withRenderedTemplate } from '../client-test-helpers';
import { RetroActions, Retros, Backgrounds, Settings, Sequent } from '../../lib/sequent'

import { TestData } from '../testData'

const should = chai.should();

if (Meteor.isClient) {
    import '../../client/actions/actionsList.js'
    import '../../client/actions/actionItem.js'
    import '../../client/actions/actionInput.js'
    import { ConfirmDialog } from '../../client/common/confirmDialog'
    import { UXUtils } from '../../client/common/uxUtils'


    describe('Actions List', function () {
        let userId
        let sandbox

        const fakeSettings = {
            backgroundImage: 'fakebackground.png',
            happyPlaceholder: 'happy',
            mehPlaceholder: 'meh',
            sadPlaceholder: 'sad'
        }

        const fakeUser = {
            username: 'faketeamname'
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
        });

        afterEach(function () {
            Template.deregisterHelper('_')
            StubCollections.restore()
            sandbox.restore()
        })

        it('displays list correctly with team email', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            sandbox.stub(Sequent, 'getSettings').returns(fakeSettings)
            RetroActions.insert(TestData.fakeRetroAction())
            RetroActions.insert(TestData.fakeRetroAction())

            withRenderedTemplate('actionsList', {}, (el) => {
                expect($(el).find('input#actionInput'), 'action input').to.have.length(1)
                expect($(el).find('button#btnSend'), 'send button').to.have.length(1)
                expect($(el).find('div.retroItem'), 'items').to.have.length(2)
                expect($(el).find('div#listWrapper')[0].style.backgroundImage).to.equal('url("fakebackground.png")')
            });
        })

        it('displays list correctly with no team email', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            sandbox.stub(Sequent, 'getSettings').returns(fakeSettings)

            withRenderedTemplate('actionsList', {}, (el) => {
                expect($(el).find('input#actionInput'), 'action input').to.have.length(1)
                expect($(el).find('button#btnSend'), 'send button').to.have.length(0)
                expect($(el).find('div.retroItem'), 'items').to.have.length(0)
                expect($(el).find('div#listWrapper')[0].style.backgroundImage).to.equal('url("fakebackground.png")')
            });
        })

        it('when you tap an item it changes display mode', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            sandbox.stub(Sequent, 'getSettings').returns(fakeSettings)
            RetroActions.insert(TestData.fakeRetroAction())
            RetroActions.insert(TestData.fakeRetroAction())

            withRenderedTemplate('actionsList', {}, (el) => {
                expect($(el).find('input#actionInput')).to.have.length(1)
                expect($(el).find('div.retroItem')).to.have.length(2)

                $(el).find('div.retroItem')[0].click()
                Tracker.flush()

                expect($(el).find('div.retroItem a.editButton'), 'should have edit button').to.have.length(1)
                expect($(el).find('div.retroItem a.deleteButton'), 'should have delete button').to.have.length(1)
            });
        })

        it('when you tap send it sends correct email', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            sandbox.stub(Sequent, 'getSettings').returns(fakeSettings)
            const retro = TestData.fakeRetro()
            Retros.insert(retro)
            RetroActions.insert(TestData.fakeRetroAction())
            RetroActions.insert(TestData.fakeRetroAction())
            sandbox.stub(Meteor, 'call')
            sandbox.stub(ConfirmDialog, 'showConfirmation').yields(null)
            sandbox.stub(Session, 'get').returns('fake-email')
            sandbox.stub(UXUtils, 'findEmailInput').returns('fake-email')

            withRenderedTemplate('actionsList', {}, (el, template) => {
                expect($(el).find('button#btnSend'), 'send button').to.have.length(1)
                expect($(el).find('div.retroItem'), 'items').to.have.length(2)

                $(el).find('button#btnSend')[0].click()
                Tracker.flush()

                expect(Session.get, 'get session called').to.have.been.calledWith(Sequent.EMAIL_TARGET)
                expect(ConfirmDialog.showConfirmation, 'launches prompt').to.have.been.called
                expect(Meteor.call, 'should call send method').to.have.been.called
                expect(Meteor.call, 'calls send method').to.have.been.calledWith('sendActionsByEmail', retro._id, 'fake-email')
            });
        })

        it('should save new action with return', function (done) {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            sandbox.stub(Meteor, 'call').yields(null)
            sandbox.stub(Sequent, 'getSettings').returns(fakeSettings)
            const retro = TestData.fakeRetro()
            Retros.insert(retro)
            RetroActions.insert(TestData.fakeRetroAction())
            RetroActions.insert(TestData.fakeRetroAction())

            withRenderedTemplate('actionsList', {}, (el, template) => {
                expect($(el).find('input#actionInput')).to.have.length(1)

                $(el).find('input#actionInput').val('new fake action')

                const evt = new Event('keypress') //eslint-disable-line
                evt.which = 13
                $(el).find('input#actionInput')[0].dispatchEvent(evt) //eslint-disable-line
                Tracker.flush()
                setTimeout(() => {
                    expect(Meteor.call).to.have.been.called
                    expect(Meteor.call).to.have.been.calledWith('createRetroAction', 'new fake action')
                    done()
                }, 200)
            });
        })

        it('should not save new action if action is empty', function (done) {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            sandbox.stub(Meteor, 'call').yields(null)
            sandbox.stub(Sequent, 'getSettings').returns(fakeSettings)
            const retro = TestData.fakeRetro()
            Retros.insert(retro)
            RetroActions.insert(TestData.fakeRetroAction())
            RetroActions.insert(TestData.fakeRetroAction())

            withRenderedTemplate('actionsList', {}, (el, template) => {
                expect($(el).find('input#actionInput')).to.have.length(1)

                $(el).find('input#actionInput').val('\n')

                const evt = new Event('keypress') //eslint-disable-line
                evt.which = 13
                $(el).find('input#actionInput')[0].dispatchEvent(evt) //eslint-disable-line
                Tracker.flush()
                setTimeout(() => {
                    expect(Meteor.call).to.not.have.been.called
                    done()
                }, 200)
            });
        })
    })
}
