/* global ConfirmDialog */
/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var'
import { Random } from 'meteor/random'
import { $, jQuery } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment'
import StubCollections from 'meteor/hwillson:stub-collections';
import { Tracker } from 'meteor/tracker';
import { withRenderedTemplate } from '../client-test-helpers';
import { RetroActions, Retros, Backgrounds, Settings } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import { TestData } from '../testData'

const should = chai.should();

if (Meteor.isClient) {
    import '../../client/retros/retroItem.js'
    import '../../client/main.js'
    import { ConfirmDialog } from '../../client/common/confirmDialog'

    describe('Retro Item', function () {
        let userId
        let sandbox

        const fakeUser = {
            username: 'faketeamname',
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

        it('displays default correctly ', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            Retros.insert(TestData.fakeRetro())

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: TestData.fakeRetroItem(),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            withRenderedTemplate('retroItem', item, (el) => {
                expect($(el).find('div.viewable-item'), 'read view should appear').to.have.length(1)
                expect($(el).find('div.selected-item'), 'edit view should disappear').to.have.length(0)
                expect($(el).find('div.tappable-text')[0].innerText).to.equal(item.data.title)
                expect($(el).find('a#voteButton')).to.have.length(1)
                expect($(el).find('p#voteCount')[0].innerText).to.equal('0')
                expect($(el).find('a.completeButton.hidden')).to.have.length(0)
                expect($(el).find('a.editButton.hidden')).to.have.length(0)
                expect($(el).find('a.deleteButton.hidden')).to.have.length(0)
                expect($(el).find('#timer')).to.have.length(0)
            });
        })

        it('displays votes correctly ', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const fakeRetro = TestData.fakeRetro()

            Retros.insert(fakeRetro)

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: TestData.fakeRetroItem({ votes: 3 }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            withRenderedTemplate('retroItem', item, (el) => {
                expect($(el).find('div.viewable-item'), 'read view should appear').to.have.length(1)
                expect($(el).find('div.selected-item'), 'edit view should disappear').to.have.length(0)
                expect($(el).find('div.tappable-text')[0].innerText).to.equal(item.data.title)
                expect($(el).find('a#voteButton')).to.have.length(1)
                expect($(el).find('p#voteCount')[0].innerText).to.equal('3')
                expect($(el).find('a.completeButton.hidden')).to.have.length(0)
                expect($(el).find('a.editButton.hidden')).to.have.length(0)
                expect($(el).find('a.deleteButton.hidden')).to.have.length(0)
                expect($(el).find('#timer')).to.have.length(0)
            });
        })

        it('hides vote correctly ', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            Retros.insert(TestData.fakeRetro({ status: Constants.RetroStatuses.ARCHIVED }))

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: TestData.fakeRetroItem({ votes: 3 }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            withRenderedTemplate('retroItem', item, (el) => {
                expect($(el).find('div.viewable-item'), 'read view should appear').to.have.length(1)
                expect($(el).find('div.selected-item'), 'edit view should disappear').to.have.length(0)
                expect($(el).find('div.tappable-text')[0].innerText).to.equal(item.data.title)
                expect($(el).find('a#voteButton')).to.have.length(0)
                expect($(el).find('p#voteCount')[0].innerText).to.equal('3')
                expect($(el).find('a.completeButton.hidden')).to.have.length(0)
                expect($(el).find('a.editButton.hidden')).to.have.length(0)
                expect($(el).find('a.deleteButton.hidden')).to.have.length(0)
                expect($(el).find('#timer')).to.have.length(0)
            });
        })

        it('completed items display correctly', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            Retros.insert(TestData.fakeRetro())

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: TestData.fakeRetroItem({ votes: 3, status: Constants.RetroItemStatuses.COMPLETE }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            withRenderedTemplate('retroItem', item, (el) => {
                expect($(el).find('div.viewable-item'), 'read view should appear').to.have.length(1)
                expect($(el).find('div.selected-item'), 'edit view should disappear').to.have.length(0)
                expect($(el).find('div.tappable-text')[0].innerText).to.equal(item.data.title)
                expect($(el).find('a#voteButton'), 'vote button should not be visible').to.have.length(0)
                expect($(el).find('p#voteCount')[0].innerText).to.equal('3')
                expect($(el).find('a.completeButton'), 'complete button should not be visible').to.have.length(0)
            });
        })

        it('goes into highlight mode correctly', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            Retros.insert(TestData.fakeRetro())

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: TestData.fakeRetroItem({ votes: 3, status: Constants.RetroItemStatuses.PENDING }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            withRenderedTemplate('retroItem', item, (el, template) => {
                selectedVar.set(item.data.itemId)
                Tracker.flush()
                expect($(el).find('div.viewable-item'), 'read view should disappear').to.have.length(0)
                expect($(el).find('div.selected-item'), 'edit view should appear').to.have.length(1)
                expect($(el).find('input#titleTextbox'), 'should not have title edit input').to.have.length(0)
                expect($(el).find('div.tappable-text'), 'should show title read only').to.have.length(1)
                expect($(el).find('a#voteButton'), 'no vote button').to.have.length(0)
                expect($(el).find('div#timer'), 'should have timer').to.have.length(1)
                expect($(el).find('a.completeButton'), 'has complete button').to.have.length(1)
                expect($(el).find('a.editButton'), 'has edit button').to.have.length(1)
                expect($(el).find('a.deleteButton'), 'has delete button').to.have.length(1)
            });
        })

        it('once in edit mode with new text - escape cancels edit', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            Retros.insert(TestData.fakeRetro())

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: TestData.fakeRetroItem({ votes: 3, status: Constants.RetroItemStatuses.PENDING }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            sandbox.stub(Meteor, 'call')

            withRenderedTemplate('retroItem', item, (el, template) => {
                selectedVar.set(item.data.itemId)
                Tracker.flush()

                expect($(el).find('div.viewable-item'), 'read view should disappear').to.have.length(0)
                expect($(el).find('div.selected-item'), 'edit view should appear').to.have.length(1)

                $(el).find('a.editButton')[0].click()
                Tracker.flush()

                // should have text input and no buttons
                expect($(el).find('textarea#titleTextBox'), 'should have title textarea').to.have.length(1)
                expect($(el).find('a.completeButton'), 'hide complete button').to.have.length(0)
                expect($(el).find('a.editButton'), 'hide edit button').to.have.length(0)
                expect($(el).find('a.deleteButton'), 'hide delete button').to.have.length(0)
                expect($(el).find('a#btnCancel'), 'cancel button visible').to.have.length(1)
                expect($(el).find('a#btnSave'), 'save button visible').to.have.length(1)


                $(el).find('textarea#titleTextBox').val('new fake title')

                $(el).find('a#btnCancel')[0].click()
                Tracker.flush()

                expect($(el).find('textarea#titleTextBox'), 'should have no title edit input').to.have.length(0)
                expect($(el).find('div.tappable-text'), 'should have title text').to.have.length(1)
                expect($(el).find('div.tappable-text')[0].innerText).to.equal(item.data.title)
                expect($(el).find('a.completeButton'), 'has complete button').to.have.length(1)
                expect($(el).find('a.editButton'), 'has edit button').to.have.length(1)
                expect($(el).find('a.deleteButton'), 'has delete button').to.have.length(1)
                expect($(el).find('a#btnCancel'), 'cancel button not visible').to.have.length(0)
                expect($(el).find('a#btnSave'), 'save button not visible').to.have.length(0)
            });
        })

        it('once in edit mode with new text - enter saves new title', function (done) {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            Retros.insert(TestData.fakeRetro())

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: TestData.fakeRetroItem({ votes: 3, status: Constants.RetroItemStatuses.PENDING, title: 'fake title' }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            sandbox.stub(Meteor, 'call').yields(null)

            withRenderedTemplate('retroItem', item, (el, template) => {
                selectedVar.set(item.data.itemId)
                Tracker.flush()

                $(el).find('a.editButton')[0].click()
                Tracker.flush()

                expect($(el).find('textarea#titleTextBox'), 'should title textarea').to.have.length(1)
                expect($(el).find('a#btnCancel'), 'cancel button visible').to.have.length(1)
                expect($(el).find('a#btnSave'), 'save button visible').to.have.length(1)

                $(el).find('textarea#titleTextBox').val('new fake title')

                $(el).find('a#btnSave')[0].click()
                Tracker.flush()

                expect(Meteor.call).to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('updateRetroItemTitle', item.data.itemId, 'new fake title')

                setTimeout(function () {
                    expect($(el).find('div.tappable-text'), 'should have title text').to.have.length(1)
                    expect($(el).find('textarea#titleTextBox'), 'should have no title edit input').to.have.length(0)
                    expect($(el).find('a.completeButton'), 'has complete button').to.have.length(1)
                    expect($(el).find('a.editButton'), 'has edit button').to.have.length(1)
                    expect($(el).find('a.deleteButton'), 'has edit button').to.have.length(1)
                    expect($(el).find('a#btnCancel'), 'cancel button not visible').to.have.length(0)
                    expect($(el).find('a#btnSave'), 'save button not visible').to.have.length(0)
                    done()
                }, 500)
            });
        })

        it('completes the item', function (done) {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            Retros.insert(TestData.fakeRetro())

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: TestData.fakeRetroItem({ votes: 3, status: Constants.RetroItemStatuses.PENDING, title: 'fake title' }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            sandbox.stub(Meteor, 'call').yields(null)

            withRenderedTemplate('retroItem', item, (el, template) => {
                selectedVar.set(item.data.itemId)
                Tracker.flush()

                expect($(el).find('a.completeButton'), 'show complete button').to.have.length(1)

                $(el).find('a.completeButton')[0].click()
                Tracker.flush()

                setTimeout(function () {
                    expect(Meteor.call).to.have.been.called
                    expect(Meteor.call).to.have.been.calledWith('completeRetroItem', item.data.itemId)
                    setTimeout(function () {
                        expect(selectedVar.get()).to.equal(null)
                        expect($(el).find('div.tappable-text'), 'should have title text').to.have.length(1)
                        expect($(el).find('input#titleTextbox'), 'should have no title edit input').to.have.length(0)
                        expect($(el).find('a.completeButton'), 'has no complete button').to.have.length(0)
                        expect($(el).find('a.editButton'), 'has no edit button').to.have.length(0)
                        expect($(el).find('a.deleteButton'), 'has no delete button').to.have.length(0)
                        expect(item.unHighlight, 'unhighlight was called').to.have.been.called
                        done()
                    }, 250)
                }, 300)
            });
        })

        it('deletes the item', function (done) {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            Retros.insert(TestData.fakeRetro())

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: TestData.fakeRetroItem({ votes: 3, status: Constants.RetroItemStatuses.PENDING, title: 'fake title' }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            sandbox.stub(Meteor, 'call').yields(null)

            sandbox.stub(ConfirmDialog, 'showConfirmation').yields(item.data.itemId)

            withRenderedTemplate('retroItem', item, (el, template) => {
                selectedVar.set(item.data.itemId)
                Tracker.flush()

                expect($(el).find('a.deleteButton'), 'show delete button').to.have.length(1)

                $(el).find('a.deleteButton')[0].click()
                Tracker.flush()

                setTimeout(function () {
                    expect(ConfirmDialog.showConfirmation).to.have.been.called
                    expect(Meteor.call).to.have.been.called
                    expect(Meteor.call).to.have.been.calledWith('removeRetroItem', item.data.itemId)
                    setTimeout(function () {
                        expect(selectedVar.get()).to.equal(null)
                        expect($(el).find('div.tappable-text'), 'should have title text').to.have.length(1)
                        expect($(el).find('input#titleTextbox'), 'should have no title edit input').to.have.length(0)
                        expect($(el).find('a.completeButton'), 'has no complete button').to.have.length(0)
                        expect($(el).find('a.editButton'), 'has no edit button').to.have.length(0)
                        expect($(el).find('a.deleteButton'), 'has no delete button').to.have.length(0)
                        expect(item.unHighlight, 'unhighlight was called').to.have.been.called
                        done()
                    }, 100)
                }, 100)
            });
        })

        it('timer starts on select', function (done) {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            Retros.insert(TestData.fakeRetro())

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: TestData.fakeRetroItem({ votes: 3, status: Constants.RetroItemStatuses.PENDING, title: 'fake title' }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            withRenderedTemplate('retroItem', item, (el, template) => {
                selectedVar.set(item.data.itemId)
                Tracker.flush()
                setTimeout(function () {
                    expect($(el).find('div#timer')[0].innerText).to.equal('00:00:01')
                    done()
                }, 1200)
            })
        })
    })
}
