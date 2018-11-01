/* global Tournaments TIU Divisions */
/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import fs from 'fs'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment'
import { $ } from 'meteor/jquery';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { TestData } from '../testData'
import { Constants } from '../../lib/constants'
import { Settings } from '../../lib/sequent'

const should = chai.should();

if (Meteor.isServer) {
    import '../../server/publications-settings.js'

    describe('Settings Publications', function () {
        let sandbox;
        let userId

        beforeEach(function () {
            userId = Random.id()
            sandbox = sinon.sandbox.create();
            sandbox.stub(Meteor, 'userId').returns(userId);
            Settings.insert(TestData.fakeSettings())
        });

        afterEach(function () {
            sandbox.restore();
            Settings.remove({})
        });

        it('settings published correctly', function (done) {
            const collector = new PublicationCollector({ userId: userId });

            collector.collect('settings', null, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const settings = collections.settings;
                expect(settings).to.have.length(1);
                done();
            });
        })
    })
}
