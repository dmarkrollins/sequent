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
    import '../../client/retros/archive.js'
    import '../../client/retros/archiveItem.js'
    import '../../client/main.js'

    describe('Archive List', function () {
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

            Retros.insert(TestData.fakeRetro({ archivedAt: new Date() }))
            Retros.insert(TestData.fakeRetro({ archivedAt: new Date() }))
            Retros.insert(TestData.fakeRetro({ archivedAt: new Date() }))

            withRenderedTemplate('archive', {}, (el) => {
                expect($(el).find('div.panel img')).to.have.length(1)
                expect($(el).find('div.panel h3')).to.have.length(1)
                expect($(el).find('div.panel h3')[0].innerText).to.equal('Faketeamname Archive')
                expect($(el).find('tbody tr')).to.have.length(3)
            });
        })
    })
}
