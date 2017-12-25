/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { withRenderedTemplate } from '../client-test-helpers';
import { Sequent } from '../../lib/sequent'

import TestData from '../testData.js'

const should = chai.should();

if (Meteor.isClient){

    import '../../client/common/newTeam.js'

    describe('New Team Dialog', function (){

        let userId;
        let sandbox

        const fakeSettings = {
            backgroundImage: 'fakebackground.png',
            happyPlaceholder: 'happy',
            mehPlaceholder: 'meh',
            sadPlaceholder: 'sad'
        }

        beforeEach(function (){
            sandbox = sinon.createSandbox()
            Template.registerHelper('_', key => key);
            FlowRouter
        });

        afterEach(function (){
            Template.deregisterHelper('_');
            sandbox.restore()
        });

        it('displays correctly', function () {

            sandbox.stub(Sequent, 'getSettings').returns(fakeSettings)

            withRenderedTemplate('newTeam', null, el => {
                expect($(el).find('#logoimage')).to.have.length(1)
                expect($(el).find('h3')[0].innerText).to.equal('Sequent')
                expect($(el).find('p strong')[0].innerText).to.equal('Create Your Team')
                expect($(el).find('#teamName')).to.have.length(1)
                expect($(el).find('#description')).to.have.length(1)
                expect($(el).find('#password')).to.have.length(1)
                expect($(el).find('#confirmPassword')).to.have.length(1)
                expect($(el).find('#btnCancel')).to.have.length(1)
                expect($(el).find('#btnCreateNewTeam')).to.have.length(1)
                expect($(el).find('span.error-message')).to.have.length(1)
                expect($(el).find('div.fullscreen')[0].style.backgroundImage).to.equal('url("fakebackground.png")')
            });          

        })
    })
}