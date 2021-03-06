/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import { _ } from 'meteor/underscore'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { Logger } from '../../lib/logger'
import { Retros, Settings } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../server/method-clearRetroBoard.js'

    describe('Clear Retro Board Method', function () {
        let userId
        let sandbox
        let subject
        let resultId

        const fakeUser = {
            username: 'faketeamname'
        }

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            sandbox.stub(Logger, 'log')
            subject = Meteor.server.method_handlers.clearRetroBoard;
        });

        afterEach(function () {
            Retros.remove({})
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                resultId = subject.apply(context, ['fake-id']);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be logged into a retro board!');
        })

        it('must be the users retro', function () {
            sandbox.stub(Retros, 'findOne').returns(null)

            const context = { userId: userId };
            let msg = '';

            try {
                resultId = subject.apply(context, ['fake-id']);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw not your retro').to.be.equal('Retro could not be found!');
        })

        it('retro cannot already be archived', async function () {
            sandbox.stub(Retros, 'findOne').returns(await TestData.fakeRetroAction({ status: Constants.RetroStatuses.ARCHIVED }))

            const context = { userId: userId };
            let msg = '';

            try {
                resultId = subject.apply(context, ['fake-id']);
            } catch (error) {
                msg = error.reason;
            }

            expect(msg, 'should throw already archived').to.be.equal('Retro is archived and cannot be cleared!');
        })

        it('clears the retro', function () {
            const retro = TestData.fakeRetroAction()
            sandbox.stub(Retros, 'findOne').returns(retro)
            sandbox.stub(Retros, 'update')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['fake-id', 'fake archive name']);
            } catch (error) {
                msg = error.message;
            }

            expect(Retros.update, 'retros update').to.have.been.called
            const args = Retros.update.args[0]
            expect(args[0]._id).to.equal(retro._id)

            expect(args[1].$set.items).to.deep.equal([])
        })

        it('clears the retro and handles error', function () {
            const retro = TestData.fakeRetroAction()
            sandbox.stub(Retros, 'findOne').returns(retro)
            const fakeError = new Error('fake-error')
            sandbox.stub(Retros, 'update').throws(new Error('fake-error'))

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['fake-id', 'fake archive name']);
            } catch (error) {
                msg = error.reason;
            }

            expect(Retros.update, 'retros update').to.have.been.called
            const args = Retros.update.args[0]
            expect(args[0]._id).to.equal(retro._id)
            expect(args[1].$set.items).to.deep.equal([])

            expect(Logger.log).to.have.been.called

            expect(msg).to.equal('We could not clear this retro board - please try again later.')
        })
    })
}
