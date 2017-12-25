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

    import '../../client/retros/retroItem.js'
    import '../../client/main.js'

    describe('Retro Item', function (){

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

        it('displays default correctly ', function(){

            sandbox.stub(Meteor, 'user').returns(fakeUser)

            Retros.insert(TestData.fakeRetro())

            const item = {
                data: TestData.fakeRetroItem()
            }

            withRenderedTemplate('retroItem', item, el => {
                expect($(el).find('div.tappable-text')[0].innerText).to.equal(item.data.title)
                expect($(el).find('a#voteButton')).to.have.length(1)
                expect($(el).find('p#voteCount')[0].innerText).to.equal('0')
                expect($(el).find('a.completeButton.hidden')).to.have.length(1)
                expect($(el).find('a.completeButton img')[0].attributes.src.value).to.equal('/ok-gray.png')                
            });          

        })

        it('displays votes correctly ', function(){

            sandbox.stub(Meteor, 'user').returns(fakeUser)

            Retros.insert(TestData.fakeRetro())

            const item = {
                data: TestData.fakeRetroItem({ votes: 3 })
            }

            withRenderedTemplate('retroItem', item, el => {
                expect($(el).find('div.tappable-text')[0].innerText).to.equal(item.data.title)
                expect($(el).find('a#voteButton')).to.have.length(1)
                expect($(el).find('p#voteCount')[0].innerText).to.equal('3')
                expect($(el).find('a.completeButton.hidden')).to.have.length(1)
            });          

        })

        it('hides vote correctly ', function(){

            sandbox.stub(Meteor, 'user').returns(fakeUser)

            Retros.insert(TestData.fakeRetro({ status: Constants.RetroStatuses.ARCHIVED }))

            const item = {
                data: TestData.fakeRetroItem({ votes: 3 })
            }

            withRenderedTemplate('retroItem', item, el => {
                expect($(el).find('div.tappable-text')[0].innerText).to.equal(item.data.title)
                expect($(el).find('a#voteButton')).to.have.length(0)
                expect($(el).find('p#voteCount')[0].innerText).to.equal('3')
                expect($(el).find('a.completeButton.hidden')).to.have.length(1)
            });          

        })

        it('hides complete button correctly ', function(){

            sandbox.stub(Meteor, 'user').returns(fakeUser)

            Retros.insert(TestData.fakeRetro())

            const item = {
                data: TestData.fakeRetroItem({ votes: 3, status: Constants.RetroItemStatuses.COMPLETE })
            }

            withRenderedTemplate('retroItem', item, el => {
                expect($(el).find('div.tappable-text')[0].innerText).to.equal(item.data.title)
                expect($(el).find('a#voteButton')).to.have.length(0)
                expect($(el).find('p#voteCount')[0].innerText).to.equal('3')
                expect($(el).find('a.completeButton')).to.have.length(0)
            });          

        })

    })
}