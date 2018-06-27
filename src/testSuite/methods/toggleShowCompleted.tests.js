/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { Retros } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../lib/method-toggleShowCompleted.js'

    describe('Toggle Show Completed Method', function () {
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
            subject = Meteor.server.method_handlers.toggleShowCompleted;
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
                msg = error.message;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be logged into a retro board! [not-logged-in]');
        })

        it('not found error', function () {
            sandbox.stub(Retros, 'findOne')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['fake-id'])
            } catch (error) {
                msg = error.message;
            }

            expect(msg).to.equal('Retro not found! [not-found]')
        })

        it('retro toggled - Show - stubbed', async function () {
            const fakeId = Random.id()

            const fakeRetro = await TestData.fakeRetro({ _id: fakeId, status: Constants.RetroStatuses.ACTIVE, showCompleted: false })

            sandbox.stub(Retros, 'findOne').returns(fakeRetro)
            sandbox.stub(Retros, 'update')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, [])
            } catch (error) {
                msg = error.message;
            }

            expect(Retros.findOne).to.have.been.called
            expect(Retros.update).to.have.been.called

            const parm1 = Retros.update.args[0][0]
            expect(parm1._id).to.equal(fakeId)

            const parm2 = Retros.update.args[0][1]
            expect(parm2.$set.showCompleted).to.equal(true)

            expect(msg).to.equal('')
        })

        it('retro toggled - Hide - stubbed', async function () {
            const fakeId = Random.id()

            const fakeRetro = await TestData.fakeRetro({ _id: fakeId, status: Constants.RetroStatuses.ACTIVE, showCompleted: true })

            sandbox.stub(Retros, 'findOne').returns(fakeRetro)
            sandbox.stub(Retros, 'update')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, [])
            } catch (error) {
                msg = error.message;
            }

            expect(Retros.findOne).to.have.been.called
            expect(Retros.update).to.have.been.called

            const parm1 = Retros.update.args[0][0]
            expect(parm1._id).to.equal(fakeId)

            const parm2 = Retros.update.args[0][1]
            expect(parm2.$set.showCompleted).to.equal(false)

            expect(msg).to.equal('')
        })
    })
}
