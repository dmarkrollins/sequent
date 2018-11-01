/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Random } from 'meteor/random'
import { ReactiveVar } from 'meteor/reactive-var'
import { $ } from 'meteor/jquery';
import { Tracker } from 'meteor/tracker';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { withRenderedTemplate } from '../client-test-helpers';
import { Constants } from '../../lib/constants'

import { TestData } from '../testData'

const should = chai.should();

if (Meteor.isClient) {
    import '../../client/actions/actionItem.js'
    import { ConfirmDialog } from '../../client/common/confirmDialog'
    import { Toast } from '../../client/common/toast'

    describe('Action Item', function () {
        let userId
        let sandbox

        const fakeUser = {
            username: 'faketeamname'
        }

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            Template.registerHelper('_', key => key);
            sandbox.stub(Meteor, 'subscribe').callsFake(() => ({
                subscriptionId: 0,
                ready: () => true,
            }));
        });

        afterEach(function () {
            Template.deregisterHelper('_')
            sandbox.restore()
        })

        it('displays correctly - unselected pending', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const selectedVar = new ReactiveVar(null)

            const data = await TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.PENDING })

            const item = {
                data,
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            withRenderedTemplate('actionItem', item, (el) => {
                expect($(el).find('div.tappable-text')[0].innerText).to.equal(item.data.title)
                const source = $(el).find('a.okButton img')[0].attributes.src.value
                expect(source).to.equal('/ok-gray.png')
                expect($(el).find('a.deleteButton'), 'no delete button').to.have.length(0)
                expect($(el).find('a.editButton'), 'no edit button').to.have.length(0)
            });
        })

        it('displays correctly - unselected complete', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: await TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.COMPLETE }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            withRenderedTemplate('actionItem', item, (el) => {
                expect($(el).find('div.tappable-text')[0].innerText).to.equal(item.data.title)
                const source = $(el).find('a.okButton img')[0].attributes.src.value
                expect(source).to.equal('/ok-green.png')
                expect($(el).find('a.deleteButton'), 'no delete button').to.have.length(0)
                expect($(el).find('a.editButton'), 'no edit button').to.have.length(0)
            });
        })

        it('pending selected item has edit and delete buttons', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: await TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.PENDING }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            withRenderedTemplate('actionItem', item, (el) => {
                selectedVar.set(item.data._id)
                Tracker.flush()

                expect($(el).find('div.tappable-text')[0].innerText).to.equal(item.data.title)
                const source = $(el).find('a.okButton img')[0].attributes.src.value
                expect(source).to.equal('/ok-gray.png')
                expect($(el).find('a.deleteButton'), 'should have delete button').to.have.length(1)
                expect($(el).find('a.editButton'), 'should have edit button').to.have.length(1)
            });
        })

        it('pending selected item - delete button works properly', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: await TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.PENDING }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            sandbox.stub(Meteor, 'call')
            sandbox.stub(ConfirmDialog, 'showConfirmation').yields(null)

            withRenderedTemplate('actionItem', item, (el) => {
                selectedVar.set(item.data._id)
                Tracker.flush()

                expect($(el).find('a.deleteButton'), 'should have delete button').to.have.length(1)

                $(el).find('a.deleteButton')[0].click()

                expect(ConfirmDialog.showConfirmation).to.have.been.called
                expect(Meteor.call).to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('removeAction', item.data._id)
            });
        })

        it('pending selected item - edit button works properly', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: await TestData.fakeRetroAction({ title: 'fake action', status: Constants.RetroItemStatuses.PENDING }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            sandbox.stub(Meteor, 'call').yields(null)

            withRenderedTemplate('actionItem', item, (el) => {
                selectedVar.set(item.data._id)
                Tracker.flush()

                expect($(el).find('a.editButton'), 'should have edit button').to.have.length(1)

                $(el).find('a.editButton')[0].click()
                Tracker.flush()

                expect($(el).find('a.okButton'), 'should not have ok button').to.have.length(0)
                expect($(el).find('a.editButton'), 'should not have edit button').to.have.length(0)
                expect($(el).find('a.deleteButton'), 'should not have delete button').to.have.length(0)
                expect($(el).find('textarea#actionItemTextarea'), 'should have edit text box').to.have.length(1)
                expect($(el).find('textarea#actionItemTextarea')[0].value, 'textarea should have correct value').to.equal('fake action')
                expect($(el).find('a#btnCancel'), 'should have cancel button').to.have.length(1)
                expect($(el).find('a#btnSave'), 'should have save button').to.have.length(1)

                $(el).find('textarea#actionItemTextarea').val('new fake action')

                $(el).find('a#btnSave')[0].click()
                Tracker.flush()

                expect($(el).find('textarea#actionItemTextarea'), 'no textarea ').to.have.length(0)
                expect($(el).find('a#btnCancel'), 'no cancel button').to.have.length(0)
                expect($(el).find('a#btnSave'), 'no save button').to.have.length(0)
                expect($(el).find('div.tappable-text'), 'should have title text').to.have.length(1)
                expect($(el).find('a.deleteButton'), 'has delete button').to.have.length(1)
                expect($(el).find('a.editButton'), 'has edit button').to.have.length(1)

                expect(Meteor.call, 'method should have been called').to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('updateActionTitle', item.data._id, 'new fake action')
                expect(item.unHighlight, 'unhighlight should have been called').to.have.been.called
            });
        })

        it('pending selected item - save works properly when pressing enter', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: await TestData.fakeRetroAction({ title: 'fake action', status: Constants.RetroItemStatuses.PENDING }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            sandbox.stub(Meteor, 'call').yields(null)

            withRenderedTemplate('actionItem', item, (el) => {
                selectedVar.set(item.data._id)
                Tracker.flush()

                expect($(el).find('a.editButton'), 'should have edit button').to.have.length(1)

                $(el).find('a.editButton')[0].click()
                Tracker.flush()

                expect($(el).find('a.okButton'), 'should not have ok button').to.have.length(0)
                expect($(el).find('a.editButton'), 'should not have edit button').to.have.length(0)
                expect($(el).find('a.deleteButton'), 'should not have delete button').to.have.length(0)
                expect($(el).find('textarea#actionItemTextarea'), 'should have edit text box').to.have.length(1)
                expect($(el).find('textarea#actionItemTextarea')[0].value, 'textarea should have correct value').to.equal('fake action')
                expect($(el).find('a#btnCancel'), 'should have cancel button').to.have.length(1)
                expect($(el).find('a#btnSave'), 'should have save button').to.have.length(1)

                $(el).find('textarea#actionItemTextarea').val('new fake action')

                const evt = new Event('keypress') //eslint-disable-line
                evt.which = 13
                $(el).find('textarea#actionItemTextarea')[0].dispatchEvent(evt) //eslint-disable-line
                Tracker.flush()

                expect($(el).find('textarea#actionItemTextarea'), 'no textarea ').to.have.length(0)
                expect($(el).find('a#btnCancel'), 'no cancel button').to.have.length(0)
                expect($(el).find('a#btnSave'), 'no save button').to.have.length(0)
                expect($(el).find('div.tappable-text'), 'should have title text').to.have.length(1)
                expect($(el).find('a.deleteButton'), 'has delete button').to.have.length(1)
                expect($(el).find('a.editButton'), 'has edit button').to.have.length(1)

                expect(Meteor.call, 'method should have been called').to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('updateActionTitle', item.data._id, 'new fake action')
                expect(item.unHighlight, 'unhighlight should have been called').to.have.been.called
            });
        })

        it('handles method call error correctly', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            sandbox.stub(Toast, 'showError')

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: await TestData.fakeRetroAction({ title: 'fake action', status: Constants.RetroItemStatuses.PENDING }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            sandbox.stub(Meteor, 'call').yields({ reason: 'fake reason' })

            withRenderedTemplate('actionItem', item, (el) => {
                selectedVar.set(item.data._id)
                Tracker.flush()

                expect($(el).find('a.editButton'), 'should have edit button').to.have.length(1)

                $(el).find('a.editButton')[0].click()
                Tracker.flush()

                $(el).find('textarea#actionItemTextarea').val('fake title')

                const evt = new Event('keypress') //eslint-disable-line
                evt.which = 13
                $(el).find('textarea#actionItemTextarea')[0].dispatchEvent(evt) //eslint-disable-line
                Tracker.flush()

                expect(Meteor.call, 'method should have been called').to.have.been.called
                expect(Meteor.call).to.have.been.calledWith('updateActionTitle', item.data._id, 'fake title')
                expect(Toast.showError).to.have.been.called
                expect(Toast.showError).to.have.been.calledWith('fake reason')
            });
        })


        it('pending selected item - cancel button works properly', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const selectedVar = new ReactiveVar(null)

            const item = {
                data: await TestData.fakeRetroAction({ title: 'fake action', status: Constants.RetroItemStatuses.PENDING }),
                unHighlight: sandbox.stub(),
                selectedItemId: selectedVar
            }

            sandbox.stub(Meteor, 'call').yields(null)

            withRenderedTemplate('actionItem', item, (el) => {
                selectedVar.set(item.data._id)
                Tracker.flush()

                expect($(el).find('a.editButton'), 'should have edit button').to.have.length(1)

                $(el).find('a.editButton')[0].click()
                Tracker.flush()

                expect($(el).find('a.okButton'), 'should not have ok button').to.have.length(0)
                expect($(el).find('a.editButton'), 'should not have edit button').to.have.length(0)
                expect($(el).find('a.deleteButton'), 'should not have delete button').to.have.length(0)
                expect($(el).find('textarea#actionItemTextarea'), 'should have edit text box').to.have.length(1)
                expect($(el).find('textarea#actionItemTextarea')[0].value, 'textarea should have correct value').to.equal('fake action')
                expect($(el).find('a#btnCancel'), 'should have cancel button').to.have.length(1)
                expect($(el).find('a#btnSave'), 'should have save button').to.have.length(1)

                $(el).find('textarea#actionItemTextarea').val('new fake action')

                $(el).find('a#btnCancel')[0].click()
                Tracker.flush()

                expect($(el).find('textarea#actionItemTextarea'), 'no textarea ').to.have.length(0)
                expect($(el).find('a#btnCancel'), 'no cancel button').to.have.length(0)
                expect($(el).find('a#btnSave'), 'no save button').to.have.length(0)
                expect($(el).find('div.tappable-text'), 'should have title text').to.have.length(1)
                expect($(el).find('div.tappable-text')[0].innerText).to.equal(item.data.title)
                expect($(el).find('a.deleteButton'), 'has delete button').to.have.length(1)
                expect($(el).find('a.editButton'), 'has edit button').to.have.length(1)
                expect(item.unHighlight, 'unhighlight should have been called').to.have.been.called
            });
        })
    })
}
