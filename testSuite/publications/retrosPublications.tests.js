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
import { RetroActions, Retros } from '../../lib/sequent'

const should = chai.should();

if (Meteor.isServer){

    import '../../server/publications-retros.js'

    describe('Retro Publications', function (){

        let sandbox;
        let userId
        let archivedId

        beforeEach(function (){
            userId = Random.id()
            sandbox = sinon.sandbox.create();
            sandbox.stub(Meteor, 'userId').returns(userId);
            Retros.insert(TestData.fakeRetro({ createdBy: userId }))
            Retros.insert(TestData.fakeRetro({ createdBy: userId, status: Constants.RetroStatuses.FROZEN}))
            archivedId = Retros.insert(TestData.fakeRetro({ createdBy: userId, status: Constants.RetroStatuses.ARCHIVED}))
        });

        afterEach(function (){
            sandbox.restore();
            Retros.remove({})
        });

        it('active retros published correctly', function (done){

            const collector = new PublicationCollector({ userId: userId });

            collector.collect('active-retros', null, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const retros = collections.retros;
                expect(retros).to.have.length(2);
                done();
            });

        })
        it('archived retros published correctly', function (done){

            const collector = new PublicationCollector({ userId: userId });

            collector.collect('archived-retros', null, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const retros = collections.retros;
                expect(retros).to.have.length(1);
                done();
            });

        })

        it('single archived retro published correctly', function (done){

            const collector = new PublicationCollector({ userId: userId });

            collector.collect('single-archived-retro', archivedId, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const retros = collections.retros;
                expect(retros).to.have.length(1);
                done();
            });

        })

    })
}