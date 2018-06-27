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

    import '../../lib/method-createRetroAction.js'

    describe('Create Retro Action Method', function (){

        let userId
        let sandbox
        let subject

        const fakeUser = {
            username: 'faketeamname'
        }

        beforeEach(function (){
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.createRetroAction;
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

        it('creates the action - stubbed', function(){

            sandbox.stub(RetroActions, 'insert')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['fake-title'])
            }
            catch (error){
                msg = error.message;
            }

            expect(RetroActions.insert).to.have.been.called
            const parms = RetroActions.insert.args[0][0]
            expect(parms.title).to.equal('fake-title')
            expect(parms.status).to.equal(Constants.RetroItemStatuses.PENDING)             
            expect(msg, 'should have no message').to.be.equal('');

        })
        

    })
}