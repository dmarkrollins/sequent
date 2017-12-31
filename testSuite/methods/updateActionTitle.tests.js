/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Random } from 'meteor/random'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import moment from 'moment'
import { withRenderedTemplate } from '../client-test-helpers';
import { RetroActions, Retros, Backgrounds, Settings } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../lib/method-updateActionTitle.js'

    describe('Update Action Title Method', function () {
        let userId
        let sandbox
        let subject

        const fakeUser = {
            username: 'faketeamname'
        }

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.updateActionTitle;
        });

        afterEach(function () {
            Retros.remove({})
            sandbox.restore()
        })

        it('must be logged in', function () {
            const context = {};
            let msg = '';

            try {
                subject.apply(context, ['fake-id']);
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

        it('found action updated - stubbed', function () {
            const fakeId = Random.id()

            const fakeAction = TestData.fakeRetroAction({ _id: fakeId })

            sandbox.stub(RetroActions, 'findOne').returns(fakeAction)
            sandbox.stub(RetroActions, 'update')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, [fakeId, 'fake-title'])
            } catch (error) {
                msg = error.message;
            }

            expect(RetroActions.findOne).to.have.been.called
            expect(RetroActions.update).to.have.been.called

            const parm1 = RetroActions.update.args[0][0]
            expect(parm1._id).to.equal(fakeId)

            const parm2 = RetroActions.update.args[0][1]
            expect(parm2.$set.title).to.equal('fake-title')

            expect(msg).to.equal('')
        })
    })
}
