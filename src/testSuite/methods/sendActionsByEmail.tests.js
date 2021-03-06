/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import { _ } from 'meteor/underscore'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { RetroActions, Retros } from '../../lib/sequent'
import { Constants } from '../../lib/constants'
import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../server/method-sendActionsByEmail'
    import { ServerUtils } from '../../server/serverUtils'

    describe('Method - Send Action Items', function () {
        let userId
        let sandbox
        let subject

        const fakeUser = {
            username: 'faketeamname'
        }

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.sendActionsByEmail;
        });

        afterEach(function () {
            Retros.remove({})
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                subject.apply(context, ['fake-id', 'fake-email']);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be logged in to perform this action!');
        })

        it('there must be actions', function () {
            const context = { userId };
            let msg = '';
            const fakeRetro = TestData.fakeRetro({ createdBy: userId })
            sandbox.stub(Retros, 'findOne').returns(fakeRetro)
            sandbox.stub(RetroActions, 'find').returns({
                fetch: () => []
            })

            try {
                subject.apply(context, ['fake-id', 'fake-email']);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw no actions').to.be.equal('There are no active or recently completed actions to send!');
        })

        it('must have a target email', function () {
            const context = { userId };
            let msg = '';
            const fakeRetro = TestData.fakeRetro({ createdBy: userId })
            sandbox.stub(Retros, 'findOne').returns(fakeRetro)
            const actionItems = []
            actionItems.push(TestData.fakeRetroAction())
            actionItems.push(TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.COMPLETE }))
            sandbox.stub(RetroActions, 'find').returns({
                fetch: () => actionItems
            })

            sandbox.stub(ServerUtils, 'sendHtmlEmail')
            sandbox.stub(Meteor.users, 'findOne').returns({ username: 'fakeusername' })

            try {
                subject.apply(context, ['fake-id']);
            } catch (error) {
                msg = error.reason;
            }
            expect(msg, 'must specify email address').to.equal('An email address is required!')
        })

        it('email address may not contain html', function () {
            const context = { userId };
            let msg = '';
            const fakeRetro = TestData.fakeRetro({ createdBy: userId })
            sandbox.stub(Retros, 'findOne').returns(fakeRetro)
            const actionItems = []
            actionItems.push(TestData.fakeRetroAction())
            actionItems.push(TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.COMPLETE }))
            sandbox.stub(RetroActions, 'find').returns({
                fetch: () => actionItems
            })

            sandbox.stub(ServerUtils, 'sendHtmlEmail')
            sandbox.stub(Meteor.users, 'findOne').returns({ username: 'fakeusername' })

            try {
                subject.apply(context, ['fake-id', '<script>alert("hi")</script>']);
            } catch (error) {
                msg = error.reason;
            }
            expect(msg, 'may not contain html').to.equal('Invalid email address!')
        })

        it('sends email stubbed ', function () {
            const context = { userId };
            let msg = '';
            const fakeRetro = TestData.fakeRetro({ createdBy: userId })
            sandbox.stub(Retros, 'findOne').returns(fakeRetro)
            const actionItems = []
            actionItems.push(TestData.fakeRetroAction())
            actionItems.push(TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.COMPLETE }))
            sandbox.stub(RetroActions, 'find').returns({
                fetch: () => actionItems
            })

            sandbox.stub(ServerUtils, 'sendHtmlEmail')
            sandbox.stub(Meteor.users, 'findOne').returns({ username: 'fakeusername' })

            try {
                subject.apply(context, ['fake-id', 'fake-email']);
            } catch (error) {
                msg = error.reason;
            }

            expect(ServerUtils.sendHtmlEmail).to.have.been.called
            const args = ServerUtils.sendHtmlEmail.args[0]
            // console.log(args)
            // ServerUtils.sendHtmlEmail(targetEmail, 'noreply@6thcents.com', `${user.username.toProperCase()} Action Items`, 'actionItems', data)
            expect(args[0], 'target email').to.equal('fake-email')
            expect(args[2], 'user name').to.equal('Fakeusername Action Items')
            const data = {}
            data.retroName = 'Fakeusername'
            data.currentYear = new Date().getFullYear()
            // data.actions = _.sortBy(actionItems, 'status')
            let items = '<tr><th>Action Item</th><th class="text-center" style="width: 25%;">Status</th></tr>'
            data.retroItems = _.sortBy(actionItems, 'status').forEach((item) => {
                const isComplete = (item.status === Constants.RetroItemStatuses.COMPLETE) ? 'Complete' : 'Active'
                const itemStyle = (item.status === Constants.RetroItemStatuses.COMPLETE) ? 'color: #999; padding: 4px 4px 4px 0px; vertical-align: top;' : 'padding: 4px 4px 4px 0px; vertical-align: top;'
                items += `<tr></tr><td style="${itemStyle}">${item.title}</td><td style="${itemStyle}">${isComplete}</td></tr>`
            })

            data.retroItems = items

            // console.log(JSON.stringify(args[4], null, 4))
            // console.log(JSON.stringify(data, null, 4))

            expect(args[4], 'email data').to.deep.equal(data)
        })
    })
}
