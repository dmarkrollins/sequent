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
    import '../../server/method-createRetroItem.js'

    describe('Create Retro Item Method', function () {
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
            subject = Meteor.server.method_handlers.createRetroItem;
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

        it('does not accept html', async function () {
            const fakeId = Random.id()

            sandbox.stub(Retros, 'findOne').returns(await TestData.fakeRetro({ _id: fakeId, items: [] }))

            sandbox.stub(Retros, 'insert')
            sandbox.stub(Retros, 'update')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['<script>alert("")</script>', Constants.RetroItemTypes.HAPPY])
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'invalid html').to.be.equal('Invalid retro item! HTML Tags not allowed. [title-required]')
        })


        it('creates the item - new retro - stubbed', async function () {
            const fakeId = Random.id()

            const findOne = sandbox.stub(Retros, 'findOne')

            findOne.onCall(0).returns(null)

            sandbox.stub(Retros, 'insert').returns(fakeId)
            sandbox.stub(Retros, 'update')

            findOne.onCall(1).returns(await TestData.fakeRetro({ _id: fakeId, items: [] }))

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['fake-title', Constants.RetroItemTypes.HAPPY])
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should have no message').to.be.equal('');

            expect(Retros.insert).to.have.been.called
            expect(Retros.update).to.have.been.called
            const idVal = Retros.update.args[0][0]._id
            expect(idVal).to.equal(fakeId)
            const doc = Retros.update.args[0][1].$push.items
            expect(doc.title).to.equal('fake-title')
            expect(doc.itemType).to.equal(Constants.RetroItemTypes.HAPPY)
            expect(doc.status).to.equal(Constants.RetroItemStatuses.PENDING)
            expect(doc.votes).to.equal(0)
            expect(doc.createdAt).to.not.be.null
        })

        it('creates the item - existing retro - stubbed', async function () {
            const fakeId = Random.id()

            sandbox.stub(Retros, 'findOne').returns(await TestData.fakeRetro({ _id: fakeId, items: [] }))

            sandbox.stub(Retros, 'insert')
            sandbox.stub(Retros, 'update')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['fake-title', Constants.RetroItemTypes.HAPPY])
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should have no message').to.be.equal('');

            expect(Retros.insert).to.not.have.been.called
            expect(Retros.update).to.have.been.called
            const idVal = Retros.update.args[0][0]._id
            expect(idVal).to.equal(fakeId)
            const doc = Retros.update.args[0][1].$push.items
            expect(doc.title).to.equal('fake-title')
            expect(doc.itemType).to.equal(Constants.RetroItemTypes.HAPPY)
            expect(doc.status).to.equal(Constants.RetroItemStatuses.PENDING)
            expect(doc.votes).to.equal(0)
            expect(doc.createdAt).to.not.be.null
        })
    })
}
