/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Random } from 'meteor/random'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import StubCollections from 'meteor/hwillson:stub-collections';
import { withRenderedTemplate } from '../client-test-helpers';
import { RetroActions, Retros, Backgrounds, Settings, Sequent } from '../../lib/sequent'

import { TestData } from '../testData'

const should = chai.should();

if (Meteor.isClient){

    import '../../client/common/settings.js'

    describe('Settings Dialog', function (){

        let userId
        let sandbox

        const fakeSettings = {
            backgroundImage: 'fakebackground.png',
            happyPlaceholder: 'happy',
            mehPlaceholder: 'meh',
            sadPlaceholder: 'sad'
        }

        beforeEach(function (){
            sandbox = sinon.createSandbox()
            userId = Random.id()
            Template.registerHelper('_', key => key);
            StubCollections.stub([Backgrounds, Settings]);
            sandbox.stub(Meteor, 'subscribe').callsFake(() => ({
                subscriptionId: 0,
                ready: () => true,
            }));
        });

        afterEach(function (){
            Template.deregisterHelper('_')
            StubCollections.restore()
            sandbox.restore()
        });

        it('items show up on dialog', function () {

            sandbox.stub(Sequent, 'getSettings').returns(fakeSettings)

            withRenderedTemplate('settings', null, el => {
                expect($(el).find('#happyPlaceholder')).to.have.length(1)
                expect($(el).find('#mehPlaceholder')).to.have.length(1)
                expect($(el).find('#sadPlaceholder')).to.have.length(1)
                expect($(el).find('#btnRandom')).to.have.length(1)
                expect($(el).find('#selectedBackground')).to.have.length(1)
                expect($(el).find('span.error-message')).to.have.length(1)
                expect($(el).find('#btnCancel')).to.have.length(1)
                expect($(el).find('div.fullscreen')[0].style.backgroundImage).to.equal('url("fakebackground.png")')
            });          

        })

        it('items display with correct data', function () {

            Settings.insert(TestData.fakeSettings())

            TestData.fakeBackgroundsArray().forEach(function(item) {
                Backgrounds.insert(item)
            }) 

            withRenderedTemplate('settings', {}, el => {
                expect($(el).find('#happyPlaceholder')[0].value).to.equal('Fake happy placeholder')
                expect($(el).find('#mehPlaceholder')[0].value).to.equal('Fake meh placeholder')
                expect($(el).find('#sadPlaceholder')[0].value).to.equal('Fake sad placeholder')
                expect($(el).find('#selectedBackground')[0]).to.have.length(6)
                expect($(el).find('#selectedBackground')[0][1].selected).to.equal(true)
            });          

        })
    })
}