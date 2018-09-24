/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { RetroActions, Retros } from '../../lib/sequent'
import { Constants } from '../../lib/constants'
import { ServerUtils } from '../../server/serverUtils'
import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../server/method-sendActionsByEmail'

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

        it('must be valid retro', function () {
            const context = { userId };
            let msg = '';
            sandbox.stub(Retros, 'findOne').returns(undefined)

            try {
                subject.apply(context, ['fake-id', 'fake-email']);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw retro not found').to.be.equal('Retro not found!');
        })

        it('must be the retro owner', function () {
            const context = { userId };
            let msg = '';
            sandbox.stub(Retros, 'findOne').returns(TestData.fakeRetro())

            try {
                subject.apply(context, ['fake-id', 'fake-email']);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw not retro owner').to.be.equal('You are not the owner of this retro!');
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

            expect(msg, 'should throw no actions').to.be.equal('There are no actions to send!');
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
            data.actions = []
            actionItems.forEach((action) => {
                data.actions.push({ status: action.status, title: action.title.toProperCase() })
            })
            expect(args[4], 'email data').to.deep.equal(data)
        })
    })
}
