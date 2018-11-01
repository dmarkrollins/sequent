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
    import '../../server/method-updateRetroItemTitle.js'

    describe('Update Retro Item Title Method', function () {
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
            subject = Meteor.server.method_handlers.updateRetroItemTitle;
        });

        afterEach(function () {
            Retros.remove({})
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                resultId = subject.apply(context, ['fake-id', 'fake-title']);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be logged into a retro board! [not-logged-in]');
        })

        it('retro not found error', function () {
            sandbox.stub(Retros, 'findOne')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['fake-id', 'fake-title'])
            } catch (error) {
                msg = error.message;
            }

            expect(msg).to.equal('Retro not found! [not-found]')
        })

        it('retro item not found', async function () {
            const fakeId = Random.id()

            const fakeRetro = await TestData.fakeRetro({ _id: fakeId, status: Constants.RetroStatuses.ACTIVE, showCompleted: false })

            sandbox.stub(Retros, 'findOne').returns(fakeRetro)
            sandbox.stub(Retros, 'update')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['fakeItemId', 'fake-title'])
            } catch (error) {
                msg = error.message;
            }

            expect(Retros.findOne).to.have.been.called

            expect(msg).to.equal('Retro Item not found! [not-found]')
        })

        it('html not allowed', async function () {
            const fakeId = Random.id()

            const fakeRetro = await TestData.fakeRetro({ _id: fakeId, status: Constants.RetroStatuses.ACTIVE, showCompleted: true })

            sandbox.stub(Retros, 'findOne').returns(fakeRetro)
            sandbox.stub(Retros, 'update')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, [fakeRetro.items[0].itemId, '<script>alert("hi")</script>'])
            } catch (error) {
                msg = error.message;
            }
            expect(msg, 'no html').to.equal('Invalid Retro Item. HTML tags not allowed. [invalid-title]')
        })

        it('title updated - stubbed', async function () {
            const fakeId = Random.id()

            const fakeRetro = await TestData.fakeRetro({ _id: fakeId, status: Constants.RetroStatuses.ACTIVE, showCompleted: true })

            sandbox.stub(Retros, 'findOne').returns(fakeRetro)
            sandbox.stub(Retros, 'update')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, [fakeRetro.items[0].itemId, 'fake-title'])
            } catch (error) {
                msg = error.message;
            }

            expect(msg).to.equal('')

            expect(Retros.findOne).to.have.been.called
            expect(Retros.update).to.have.been.called

            const parm1 = Retros.update.args[0][0]
            expect(parm1._id).to.equal(fakeId)
            expect(parm1['items.itemId']).to.equal(fakeRetro.items[0].itemId)

            const parm2 = Retros.update.args[0][1]
            expect(parm2.$set['items.$.title']).to.equal('fake-title')
        })
    })
}
