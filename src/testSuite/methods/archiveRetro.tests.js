/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import { _ } from 'meteor/underscore'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { Sequent, Retros, Settings } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../lib/method-archiveRetro.js'

    describe('Archive Retro Method', function () {
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
            subject = Meteor.server.method_handlers.archiveRetro;
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

        it('must be the users retro', function () {
            // sandbox.stub(Retros, 'findOne').returns(null)

            const context = { userId: userId };
            let msg = '';

            try {
                resultId = subject.apply(context, ['fake-id']);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not your retro').to.be.equal('Retro could not be found! [not-found]');
        })

        it('retro cannot already be archived', async function () {
            sandbox.stub(Retros, 'findOne').returns(await TestData.fakeRetroAction({ status: Constants.RetroStatuses.ARCHIVED }))

            const context = { userId: userId };
            let msg = '';

            try {
                resultId = subject.apply(context, ['fake-id']);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw already archived').to.be.equal('Retro was already archived! [already-archived]');
        })

        it('archives the retro - stubbed', function () {
            const retro = TestData.fakeRetroAction()
            sandbox.stub(Retros, 'findOne').returns(retro)
            sandbox.stub(Retros, 'update')
            sandbox.stub(Settings, 'findOne').returns(TestData.fakeSettings())

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['fake-id']);
            } catch (error) {
                msg = error.message;
            }

            expect(Retros.update, 'retros update').to.have.been.called
            const args = Retros.update.args[0]
            expect(args[0]._id).to.equal(retro._id)

            expect(args[1].$set.status).to.equal(Constants.RetroStatuses.ARCHIVED)
            expect(_.isDate(args[1].$set.archivedAt)).to.be.true

            expect(Settings.findOne, 'settings find one').to.have.been.called
            expect(args[1].$set.happyPlaceholder).to.equal('Fake happy placeholder')
            expect(args[1].$set.mehPlaceholder).to.equal('Fake meh placeholder')
            expect(args[1].$set.sadPlaceholder).to.equal('Fake sad placeholder')

            expect(msg, 'should have no message').to.be.equal('');
        })
    })
}
