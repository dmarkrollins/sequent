/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import { _ } from 'meteor/underscore'
import moment from 'moment'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { Sequent, Retros, Settings } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../server/method-archiveRetro.js'

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

        it('html not allowed', async function () {
            const retro = TestData.fakeRetroAction()
            sandbox.stub(Retros, 'findOne').returns(retro)
            sandbox.stub(Settings, 'findOne').returns(TestData.fakeSettings())

            const context = { userId: userId };
            let msg = '';

            try {
                resultId = subject.apply(context, ['fake-id', '<script>alert("hi")</script>']);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'html not allowed').to.be.equal('Invalid Archive name. HTML tags not allowed! [invalid-name]');
        })

        it('archives the retro - stubbed with name', function () {
            const retro = TestData.fakeRetroAction()
            sandbox.stub(Retros, 'findOne').returns(retro)
            sandbox.stub(Retros, 'update')
            sandbox.stub(Settings, 'findOne').returns(TestData.fakeSettings())

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

            expect(args[1].$set.status).to.equal(Constants.RetroStatuses.ARCHIVED)
            expect(_.isDate(args[1].$set.archivedAt)).to.be.true
            expect(args[1].$set.archiveName, 'archive name').to.equal('fake archive name')

            expect(Settings.findOne, 'settings find one').to.have.been.called
            expect(Settings.findOne, 'settings find one').to.have.been.calledWith({ createdBy: userId })
            expect(args[1].$set.happyPlaceholder).to.equal('Fake happy placeholder')
            expect(args[1].$set.mehPlaceholder).to.equal('Fake meh placeholder')
            expect(args[1].$set.sadPlaceholder).to.equal('Fake sad placeholder')

            expect(msg, 'should have no message').to.be.equal('');
        })

        it('archives the retro - stubbed - no name', function () {
            const retro = TestData.fakeRetroAction()
            sandbox.stub(Retros, 'findOne').returns(retro)
            sandbox.stub(Retros, 'update')
            sandbox.stub(Settings, 'findOne').returns(TestData.fakeSettings())

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['fake-id', '']);
            } catch (error) {
                msg = error.message;
            }

            expect(Retros.update, 'retros update').to.have.been.called
            const args = Retros.update.args[0]
            expect(args[0]._id).to.equal(retro._id)

            expect(args[1].$set.status).to.equal(Constants.RetroStatuses.ARCHIVED)
            expect(_.isDate(args[1].$set.archivedAt)).to.be.true

            const archiveName = `${moment(retro.archivedAt).format('MM-DD-YYYY')}`

            expect(args[1].$set.archiveName, 'archive name').to.contains(archiveName)
            expect(args[1].$set.archiveName, 'archive name').to.not.contains('ARCHIVED')

            expect(Settings.findOne, 'settings find one').to.have.been.called
            expect(Settings.findOne, 'settings find one').to.have.been.calledWith({ createdBy: userId })
            expect(args[1].$set.happyPlaceholder).to.equal('Fake happy placeholder')
            expect(args[1].$set.mehPlaceholder).to.equal('Fake meh placeholder')
            expect(args[1].$set.sadPlaceholder).to.equal('Fake sad placeholder')

            expect(msg, 'should have no message').to.be.equal('');
        })

        it('archives the retro - stubbed - no settings defined', function () {
            const retro = TestData.fakeRetroAction()
            sandbox.stub(Retros, 'findOne').returns(retro)
            sandbox.stub(Retros, 'update')
            sandbox.stub(Settings, 'findOne').returns(null)

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['fake-id', '']);
            } catch (error) {
                msg = error.message;
            }

            expect(Retros.update, 'retros update').to.have.been.called
            const args = Retros.update.args[0]
            expect(args[0]._id).to.equal(retro._id)

            expect(args[1].$set.status).to.equal(Constants.RetroStatuses.ARCHIVED)
            expect(_.isDate(args[1].$set.archivedAt)).to.be.true

            const archiveName = `${moment(retro.archivedAt).format('MM-DD-YYYY')}`

            expect(args[1].$set.archiveName, 'archive name').to.contains(archiveName)
            expect(args[1].$set.archiveName, 'archive name').to.not.contains('ARCHIVED')

            expect(Settings.findOne, 'settings find one').to.have.been.called
            expect(Settings.findOne, 'settings find one').to.have.been.calledWith({ createdBy: userId })
            expect(args[1].$set.happyPlaceholder).to.equal(':)')
            expect(args[1].$set.mehPlaceholder).to.equal(':|')
            expect(args[1].$set.sadPlaceholder).to.equal(':(')

            expect(msg, 'should have no message').to.be.equal('');
        })
    })
}
