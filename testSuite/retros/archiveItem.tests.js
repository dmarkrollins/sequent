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

if (Meteor.isClient) {
    import '../../client/retros/archiveItem.js'
    import '../../client/main.js'

    describe('Archive Item', function () {
        let userId
        let sandbox

        const fakeUser = {
            username: 'faketeamname'
        }

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
            Template.registerHelper('_', key => key);
            StubCollections.stub([Retros, RetroActions, Settings]);
            sandbox.stub(Meteor, 'subscribe').callsFake(() => ({
                subscriptionId: 0,
                ready: () => true,
            }));
        });

        afterEach(function () {
            Template.deregisterHelper('_')
            StubCollections.restore()
            sandbox.restore()
        })

        it('displays correctly', function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)

            const dateValue = new Date()

            const formattedDate = moment(dateValue).format('MM-DD-YYYY - LT')

            const data = TestData.fakeRetro({ archivedAt: dateValue })

            withRenderedTemplate('archiveItem', data, (el) => {
                expect($(el).find('td')[0].firstChild.attributes.href.value).to.contain(data._id)
                expect($(el).find('td')[1].innerText).to.equal(formattedDate)
                expect($(el).find('td')[2].innerText).to.equal('3')
            });
        })
    })
}
