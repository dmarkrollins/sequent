/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
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
    import '../../client/retros/retroBoard.js'
    import '../../client/retros/retroItem.js'
    import '../../client/main.js'

    describe('Retro Board', function () {
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

        it('displays default correctly - not frozen', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            sandbox.stub(Sequent, 'getSettings').returns({ backgroundImage: 'fakeBackground.png' })

            const retroItems = []

            retroItems.push(await TestData.fakeRetroItem({ itemType: Constants.RetroItemTypes.HAPPY }))
            retroItems.push(await TestData.fakeRetroItem({ itemType: Constants.RetroItemTypes.MEH }))
            retroItems.push(await TestData.fakeRetroItem({ itemType: Constants.RetroItemTypes.SAD }))

            Retros.insert(await TestData.fakeRetro({ status: Constants.RetroStatuses.ACTIVE, items: retroItems }))

            withRenderedTemplate('retroBoard', {}, (el) => {
                expect($(el).find('div#fullSizeCol div.row div.col-md-4'), 'column count').to.have.length(3)
                expect($(el).find('div#fullSizeCol div.row div.fullheight-green div.greenItem'), 'green input').to.have.length(1)
                expect($(el).find('div#fullSizeCol div.row div.fullheight-yellow div.yellowItem'), 'yellow input').to.have.length(1)
                expect($(el).find('div#fullSizeCol div.row div.fullheight-red div.redItem'), 'red input').to.have.length(1)

                expect($(el).find('div#fullSizeCol div.row div.fullheight-green div.retroItem'), 'green items').to.have.length(1)
                expect($(el).find('div#fullSizeCol div.row div.fullheight-yellow div.retroItem'), 'yellow items').to.have.length(1)
                expect($(el).find('div#fullSizeCol div.row div.fullheight-red div.retroItem'), 'red items').to.have.length(1)
            });
        })

        it('should not allow blank input - happy', function (done) {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            sandbox.stub(Sequent, 'getSettings').returns({ backgroundImage: 'fakeBackground.png' })
            sandbox.stub(Meteor, 'call').yields(null)

            withRenderedTemplate('retroBoard', {}, (el) => {
                expect($(el).find('textarea#happy-textarea'), 'should have happy textarea').to.have.length(1)
                $(el).find('textarea#happy-textarea').val('\n')

                const evt = new Event('keypress') //eslint-disable-line
                evt.which = 13
                $(el).find('textarea#happy-textarea')[0].dispatchEvent(evt) //eslint-disable-line
                Tracker.flush()

                setTimeout(() => {
                    expect(Meteor.call).to.not.have.been.called
                    expect($(el).find('textarea#happy-textarea').val(), 'should be blank').to.equal('')
                    done()
                }, 200)
            });
        })
        it('should not allow blank input - meh', function (done) {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            sandbox.stub(Sequent, 'getSettings').returns({ backgroundImage: 'fakeBackground.png' })
            sandbox.stub(Meteor, 'call').yields(null)

            withRenderedTemplate('retroBoard', {}, (el) => {
                expect($(el).find('textarea#meh-textarea'), 'should have meh textarea').to.have.length(1)
                $(el).find('textarea#meh-textarea').val('\n')

                const evt = new Event('keypress') //eslint-disable-line
                evt.which = 13
                $(el).find('textarea#meh-textarea')[0].dispatchEvent(evt) //eslint-disable-line
                Tracker.flush()

                setTimeout(() => {
                    expect(Meteor.call).to.not.have.been.called
                    expect($(el).find('textarea#meh-textarea').val(), 'should be blank').to.equal('')
                    done()
                }, 200)
            });
        })

        it('should not allow blank input - sad', function (done) {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            sandbox.stub(Sequent, 'getSettings').returns({ backgroundImage: 'fakeBackground.png' })
            sandbox.stub(Meteor, 'call').yields(null)

            withRenderedTemplate('retroBoard', {}, (el) => {
                expect($(el).find('textarea#sad-textarea'), 'should have sad textarea').to.have.length(1)
                $(el).find('textarea#sad-textarea').val('\n')

                const evt = new Event('keypress') //eslint-disable-line
                evt.which = 13
                $(el).find('textarea#sad-textarea')[0].dispatchEvent(evt) //eslint-disable-line
                Tracker.flush()

                setTimeout(() => {
                    expect(Meteor.call).to.not.have.been.called
                    expect($(el).find('textarea#sad-textarea').val(), 'should be blank').to.equal('')
                    done()
                }, 200)
            });
        })

        it('displays default correctly - frozen', async function () {
            sandbox.stub(Meteor, 'user').returns(fakeUser)
            sandbox.stub(Sequent, 'getSettings').returns(fakeSettings)

            const retroItems = []

            retroItems.push(await TestData.fakeRetroItem({ itemType: Constants.RetroItemTypes.HAPPY }))
            retroItems.push(await TestData.fakeRetroItem({ itemType: Constants.RetroItemTypes.MEH }))
            retroItems.push(await TestData.fakeRetroItem({ itemType: Constants.RetroItemTypes.SAD }))

            Retros.insert(await TestData.fakeRetro({ status: Constants.RetroStatuses.FROZEN, items: retroItems }))

            withRenderedTemplate('retroBoard', {}, (el) => {
                expect($(el).find('div#fullSizeCol div.row div.col-md-4'), 'column count').to.have.length(3)
                expect($(el).find('div#fullSizeCol div.row div.fullheight-green div.greenItem textarea'), 'green input').to.have.length(1)
                expect($(el).find('div#fullSizeCol div.row div.fullheight-yellow div.yellowItem textarea'), 'yellow input').to.have.length(1)
                expect($(el).find('div#fullSizeCol div.row div.fullheight-red div.redItem textarea'), 'red input').to.have.length(1)

                expect($(el).find('div#fullSizeCol div.row div.fullheight-green div.retroItem'), 'green items').to.have.length(1)
                expect($(el).find('div#fullSizeCol div.row div.fullheight-yellow div.retroItem'), 'yellow items').to.have.length(1)
                expect($(el).find('div#fullSizeCol div.row div.fullheight-red div.retroItem'), 'red items').to.have.length(1)
                expect($(el).find('div#boardWrapper')[0].style.backgroundImage).to.equal('url("fakebackground.png")')
            });
        })
    })
}
