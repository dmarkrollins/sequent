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
        let userId

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            userId = Random.id()
        });

        afterEach(function () {
            sandbox.restore();
            RetroActions.remove({})
        });

        it('open actions published correctly', function (done) {
            const collector = new PublicationCollector({ userId: userId });
            sandbox.stub(Meteor, 'userId').returns(userId);
            const expired = moment().subtract(2, 'days');
            RetroActions.insert(TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.PENDING, createdBy: userId }))
            RetroActions.insert(TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.PENDING, createdBy: userId }))
            RetroActions.insert(TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.COMPLETE, completedAt: expired.toDate(), createdBy: userId }))

            collector.collect('open-actions', null, (collections) => {
                // console.log('The open items', JSON.stringify(collections, null, 4));
                const actions = collections['retro-actions'];
                try {
                    expect(actions).to.have.length(2);
                    done();
                } catch (error) {
                    done(error)
                }
            });
        })

        it('all actions published correctly', function (done) {
            const collector = new PublicationCollector({ userId: userId });
            sandbox.stub(Meteor, 'userId').returns(userId);
            const expired = moment().subtract(2, 'days');
            RetroActions.insert(TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.PENDING, createdBy: userId }))
            RetroActions.insert(TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.PENDING, createdBy: userId }))
            RetroActions.insert(TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.COMPLETE, completedAt: expired.toDate(), createdBy: userId }))
            const search = {
                limit: 25,
                showAll: true
            }

            collector.collect('all-actions', search, (collections) => {
                // console.log('All Items', JSON.stringify(collections, null, 4));
                const actions = collections['retro-actions'];
                try {
                    expect(actions).to.have.length(3);
                    done();
                } catch (error) {
                    done(error)
                }
            });
        })

        it('all actions published just pending', function (done) {
            const collector = new PublicationCollector({ userId: userId });
            sandbox.stub(Meteor, 'userId').returns(userId);
            const expired = moment().subtract(2, 'days');
            RetroActions.insert(TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.PENDING, createdBy: userId }))
            RetroActions.insert(TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.PENDING, createdBy: userId }))
            RetroActions.insert(TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.COMPLETE, completedAt: expired.toDate(), createdBy: userId }))
            const search = {
                limit: 25,
                showAll: false
            }

            collector.collect('all-actions', search, (collections) => {
                // console.log('All Items', JSON.stringify(collections, null, 4));
                const actions = collections['retro-actions'];
                try {
                    expect(actions).to.have.length(2);
                    done();
                } catch (error) {
                    done(error)
                }
            });
        })

        it('all actions published over limit', function (done) {
            const collector = new PublicationCollector({ userId: userId });
            sandbox.stub(Meteor, 'userId').returns(userId);
            const expired = moment().subtract(2, 'days');
            for (let i = 0; i < 30; i += 1) {
                RetroActions.insert(TestData.fakeRetroAction({ status: Constants.RetroItemStatuses.PENDING, createdBy: userId }))
            }
            const search = {
                limit: 25,
                showAll: true
            }

            collector.collect('all-actions', search, (collections) => {
                // console.log('All Items', JSON.stringify(collections, null, 4));
                const actions = collections['retro-actions'];
                try {
                    expect(actions).to.have.length(25);
                    done();
                } catch (error) {
                    done(error)
                }
            });
        })
    })
}
