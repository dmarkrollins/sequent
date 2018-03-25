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

if (Meteor.isClient) {
    import '../../client/retros/archiveBoard.js'
    import '../../client/retros/retroItem.js'
    import '../../client/main.js'

    describe('Archive Board', function () {
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
            sandbox.stub(Sequent, 'getSettings').returns(fakeSettings)

            const retroItems = []

            retroItems.push(TestData.fakeRetroItem({ itemType: Constants.RetroItemTypes.HAPPY }))
            retroItems.push(TestData.fakeRetroItem({ itemType: Constants.RetroItemTypes.MEH }))
            retroItems.push(TestData.fakeRetroItem({ itemType: Constants.RetroItemTypes.SAD }))

            Retros.insert(TestData.fakeRetro({ archivedAt: new Date(), status: Constants.RetroStatuses.ARCHIVED, items: retroItems }))

            withRenderedTemplate('archiveBoard', {}, (el) => {
                expect($(el).find('div#fullSizeCol div.row div.col-md-4')).to.have.length(3)
                expect($(el).find('div#fullSizeCol div.row div.fullheight-green-archive div.retroItem')).to.have.length(1)
                expect($(el).find('div#fullSizeCol div.row div.fullheight-yellow-archive div.retroItem')).to.have.length(1)
                expect($(el).find('div#fullSizeCol div.row div.fullheight-red-archive div.retroItem')).to.have.length(1)
                expect($(el).find('div#boardWrapper')[0].style.backgroundImage).to.equal('url("fakebackground.png")')
            });
        })
    })
}
