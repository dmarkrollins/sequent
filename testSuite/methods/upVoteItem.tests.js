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

    import '../../lib/method-upVoteItem.js'

    describe('Upvote Item Method', function (){

        let userId
        let sandbox
        let subject

        const fakeUser = {
            username: 'faketeamname'
        }

        beforeEach(function (){
            sandbox = sinon.createSandbox()
            userId = Random.id()
            subject = Meteor.server.method_handlers.upVoteItem;
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

        it('retro not found error', function(){

            sandbox.stub(Retros, 'findOne')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['fake-id'])
            }
            catch (error){
                msg = error.message;
            }

           expect(msg).to.equal('Retro not found! [not-found]')
        })

        it('retro item not found', function(){

            const fakeId = Random.id()

            const fakeRetro = TestData.fakeRetro({ _id: fakeId, status: Constants.RetroStatuses.ACTIVE, showCompleted: false })

            sandbox.stub(Retros, 'findOne').returns(fakeRetro)
            sandbox.stub(Retros, 'update')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, ['fakeItemId'])
            }
            catch (error){
                msg = error.message;
            }

            expect(Retros.findOne).to.have.been.called

            expect(msg).to.equal('Retro Item not found! [not-found]')
        })

        it('vote count updated - stubbed', function(){

            const fakeId = Random.id()

            const fakeRetro = TestData.fakeRetro({ _id: fakeId, status: Constants.RetroStatuses.ACTIVE, showCompleted: true })

            sandbox.stub(Retros, 'findOne').returns(fakeRetro)
            sandbox.stub(Retros, 'update')

            const context = { userId: userId };
            let msg = '';

            try {
                subject.apply(context, [fakeRetro.items[0].itemId])
            }
            catch (error){
                msg = error.message;
            }

            expect(msg).to.equal('')

            expect(Retros.findOne).to.have.been.called
            expect(Retros.update).to.have.been.called

            const parm1 = Retros.update.args[0][0]
            expect(parm1._id).to.equal(fakeId)
            expect(parm1['items.itemId']).to.equal(fakeRetro.items[0].itemId)

            const parm2 = Retros.update.args[0][1]
            expect(parm2.$set['items.$.votes']).to.equal(1)

        })

    })
}
