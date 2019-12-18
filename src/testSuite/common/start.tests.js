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

if (Meteor.isClient) {
    import '../../client/common/start.js'

    describe('Start Dialog', function () {
        let userId;
        let sandbox

        const fakeSettings = {
            backgroundImage: 'fakebackground.png',
            happyPlaceholder: 'happy',
            mehPlaceholder: 'meh',
            sadPlaceholder: 'sad'
        }

        beforeEach(function () {
            Template.registerHelper('_', key => key);
            sandbox = sinon.createSandbox()
        });

        afterEach(function () {
            Template.deregisterHelper('_');
            sandbox.restore()
        });

        it('displays correctly', function () {
            sandbox.stub(Sequent, 'getSettings').returns(fakeSettings)

            withRenderedTemplate('start', null, (el) => {
                expect($(el).find('#logoimage'), 'logo image').to.have.length(1)
                expect($(el).find('div#product-name')[0].innerText, 'title').to.equal('Sequent Retrospectives')
                expect($(el).find('#teamName'), 'team name').to.have.length(1)
                expect($(el).find('#password'), 'password').to.have.length(1)
                expect($(el).find('#btnNext'), 'btn next').to.have.length(1)
                expect($(el).find('#btnNewTeam'), 'btn new team').to.have.length(1)
                expect($(el).find('div.error-message'), 'error msg').to.have.length(1)
                expect($(el).find('div.fullscreen')[0].style.backgroundImage, 'background').to.contains('fakebackground.png')
            });
        })
    })
}
