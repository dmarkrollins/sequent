/* global Tournaments TIU Divisions */
/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment'
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { TestData } from '../testData'
import { Constants } from '../../lib/constants'
import { RetroActions } from '../../lib/sequent'

const should = chai.should();

if (Meteor.isServer) {
    import '../../server/publications-actions.js'

    describe('Action Publication', function () {
        let sandbox;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function () {
            sandbox.restore();
            RetroActions.remove({})
        });

        it('actions published correctly', async function (done) {
            sandbox.stub(Meteor, 'userId').returns(Random.id());

            RetroActions.insert(await TestData.fakeRetroAction())
            const expired = moment().subtract(2, 'days');
            RetroActions.insert(await TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.COMPLETE, completedAt: new Date() }))
            RetroActions.insert(await TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.COMPLETE, completedAt: expired.toDate() }))

            const collector = new PublicationCollector();

            collector.collect('open-actions', null, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const actions = collections['retro-actions'];
                expect(actions).to.have.length(2);
                done();
            });
        })
    })
}
