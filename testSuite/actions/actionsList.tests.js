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
import { RetroActions, Retros, Backgrounds, Settings, Sequent } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import { TestData } from '../testData'

const should = chai.should();

if (Meteor.isClient){

    import '../../client/actions/actionsList.js'
    import '../../client/actions/actionItem.js'

    describe('Actions List', function (){

        let userId
        let sandbox

        const fakeSettings = {
            backgroundImage: 'fakebackground.png',
            happyPlaceholder: 'happy',
            mehPlaceholder: 'meh',
            sadPlaceholder: 'sad'
        }

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

        it('displays list correctly', function(){

            sandbox.stub(Meteor, 'user').returns(fakeUser)
            sandbox.stub(Sequent, 'getSettings').returns(fakeSettings)
            RetroActions.insert(TestData.fakeRetroAction())
            RetroActions.insert(TestData.fakeRetroAction())

            withRenderedTemplate('actionsList', {}, el => {
                expect($(el).find('input#actionInput')).to.have.length(1)
                expect($(el).find('div.retroItem')).to.have.length(2)
                expect($(el).find('div#listWrapper')[0].style.backgroundImage).to.equal('url("fakebackground.png")')
            });          

        })

    })
}
