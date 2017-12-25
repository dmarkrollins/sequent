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

if (Meteor.isServer){

    import '../../lib/method-saveSettings.js'

    describe('Save Settings Method', function (){

        let userId
        let sandbox
        let subject

        const fakeUser = {
            username: 'faketeamname'
        }

        beforeEach(function (){
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.saveSettings;
        });

        afterEach(function (){
            Retros.remove({})
            sandbox.restore()
        })

        it('must be logged in', function(){

            const context = {};
            let msg = '';

            try {
                resultId = subject.apply(context, ['fake-id']);
            }
            catch (error){
                msg = error.message;
            }

            expect(msg, 'should throw not logged in').to.be.equal('You must be logged into a retro board! [not-logged-in]');

        })

        it('not found insert - stubbed', function(){

            sandbox.stub(Settings, 'findOne')
            sandbox.stub(Settings, 'insert')

            const context = { userId: userId };
            let msg = '';

            const fakeSettings = TestData.fakeSettings()

            try {
                subject.apply(context, [fakeSettings])
            }
            catch (error){
                msg = error.message;
            }

            expect(Settings.findOne).to.have.been.called
            expect(Settings.insert).to.have.been.called
            const parms = Settings.insert.args[0][0]
            expect(parms.BackgroundImage).to.equal(fakeSettings.Backgrounds)
            expect(parms.happyPlaceholder).to.equal(fakeSettings.happyPlaceholder)
            expect(parms.mehPlaceholder).to.equal(fakeSettings.mehPlaceholder)
            expect(parms.sadPlaceholder).to.equal(fakeSettings.sadPlaceholder)
            expect(msg).to.equal('')
        })

        it('found update - stubbed', function(){

            const fakeId = Random.id()

            const fakeSettings = TestData.fakeSettings({ _id: fakeId })

            sandbox.stub(Settings, 'findOne').returns(fakeSettings)
            sandbox.stub(Settings, 'update')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, [fakeSettings])
            }
            catch (error){
                msg = error.message;
            }

            expect(Settings.findOne).to.have.been.called
            expect(Settings.update).to.have.been.called
            const parm1 = Settings.update.args[0][0]
            expect(parm1._id).to.equal(fakeSettings._id)

            const parm2 = Settings.update.args[0][1]
            expect(parm2.$set.Backgrounds).to.equal(fakeSettings.Backgrounds)
            expect(parm2.$set.happyPlaceholder).to.equal(fakeSettings.happyPlaceholder)
            expect(parm2.$set.mehPlaceholder).to.equal(fakeSettings.mehPlaceholder)
            expect(parm2.$set.sadPlaceholder).to.equal(fakeSettings.sadPlaceholder)
            

            expect(msg).to.equal('')
        })

    })
}