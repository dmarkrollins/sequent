/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Random } from 'meteor/random'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment'
import StubCollections from 'meteor/hwillson:stub-collections';
import { withRenderedTemplate } from '../client-test-helpers';
import { RetroActions, Retros, Backgrounds, Settings } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import { TestData } from '../testData'

const should = chai.should();

if (Meteor.isClient){

    import '../../client/actions/actionItem.js'

    describe('Action Item', function (){

        let userId
        let sandbox

        const fakeUser = {
            username: 'faketeamname'
        }

        beforeEach(function (){
            sandbox = sinon.createSandbox()
            userId = Random.id()
            Template.registerHelper('_', key => key);
            StubCollections.stub([ Retros, RetroActions, Settings ]);
            sandbox.stub(Meteor, 'subscribe').callsFake(() => ({
                subscriptionId: 0,
                ready: () => true,
            }));
        });

        afterEach(function (){
            Template.deregisterHelper('_')
            StubCollections.restore()
            sandbox.restore()
        })

        it('displays correctly pending', function(){

            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const data = TestData.fakeRetroAction()

            withRenderedTemplate('actionItem', data, el => {
                expect($(el).find('div.tappable-text')[0].innerText).to.equal(data.title)
                const source = $(el).find('a.okButton img')[0].attributes.src.value
                expect(source).to.equal('/ok-gray.png')
                expect($(el).find('a.hidden.deleteButton')).to.have.length(1)
            });          

        })

        it('displays correctly complete', function(){

            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const data = TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.COMPLETE })

            withRenderedTemplate('actionItem', data, el => {
                expect($(el).find('div.tappable-text')[0].innerText).to.equal(data.title)
                const source = $(el).find('a.okButton img')[0].attributes.src.value
                expect(source).to.equal('/ok-green.png')
                expect($(el).find('a.hidden.deleteButton')).to.have.length(1)
            });          

        })

    })
}