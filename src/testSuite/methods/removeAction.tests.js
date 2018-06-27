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
    import '../../lib/method-removeAction.js'

    describe('Remove Action Method', function () {
        let userId
        let sandbox
        let subject

        const fakeUser = {
            username: 'faketeamname'
        }

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.removeAction;
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
            sandbox.stub(RetroActions, 'findOne').returns(null)

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['fake-id'])
            } catch (error) {
                msg = error.message;
            }

            expect(RetroActions.findOne).to.have.been.called
            expect(msg).to.equal('Action not found! [not-found]')
        })

        it('removes action - stubbed', function () {
            const fakeId = Random.id()

            sandbox.stub(RetroActions, 'findOne').returns(TestData.fakeRetroAction({ _id: fakeId }))
            sandbox.stub(RetroActions, 'remove')


            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, [fakeId])
            } catch (error) {
                msg = error.message;
            }

            expect(RetroActions.findOne).to.have.been.called
            expect(RetroActions.remove).to.have.been.called
            expect(RetroActions.remove).to.have.been.calledWith({ _id: fakeId })
            expect(msg).to.equal('')
        })
    })
}
