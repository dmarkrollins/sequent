/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { RetroActions, Retros } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../lib/method-toggleAction.js'

    describe('Toggle Action Method', function () {
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
            subject = Meteor.server.method_handlers.toggleAction;
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
            sandbox.stub(RetroActions, 'findOne')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['fake-id'])
            } catch (error) {
                msg = error.message;
            }

            expect(msg).to.equal('RetroAction not found! [not-found]')
        })

        it('found action is toggled - PENDING - stubbed', async function () {
            const fakeId = Random.id()

            const fakeAction = await TestData.fakeRetroAction({ _id: fakeId })

            sandbox.stub(RetroActions, 'findOne').returns(fakeAction)
            sandbox.stub(RetroActions, 'update')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, [fakeId])
            } catch (error) {
                msg = error.message;
            }

            expect(RetroActions.findOne).to.have.been.called
            expect(RetroActions.update).to.have.been.called

            const parm1 = RetroActions.update.args[0][0]
            expect(parm1._id).to.equal(fakeId)

            const parm2 = RetroActions.update.args[0][1]
            expect(parm2.$set.status).to.equal(Constants.RetroItemStatuses.COMPLETE)
            expect(parm2.$set.completedAt).to.not.be.null

            expect(msg).to.equal('')
        })

        it('found action is toggled - COMPLETE - stubbed', async function () {
            const fakeId = Random.id()

            const fakeAction = await TestData.fakeRetroAction({ _id: fakeId, status: Constants.RetroItemStatuses.COMPLETE })

            sandbox.stub(RetroActions, 'findOne').returns(fakeAction)
            sandbox.stub(RetroActions, 'update')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, [fakeId])
            } catch (error) {
                msg = error.message;
            }

            expect(RetroActions.findOne).to.have.been.called
            expect(RetroActions.update).to.have.been.called

            const parm1 = RetroActions.update.args[0][0]
            expect(parm1._id).to.equal(fakeId)

            const parm2 = RetroActions.update.args[0][1]
            expect(parm2.$set.status).to.equal(Constants.RetroItemStatuses.PENDING)
            expect(parm2.$set.completedAt).to.be.null

            expect(msg).to.equal('')


            expect(msg).to.equal('')
        })
    })
}
