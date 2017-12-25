/* global Tournaments TIU Divisions */
/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import fs from 'fs'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { $ } from 'meteor/jquery';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import TestData from '../testData.js';

const should = chai.should();

if (Meteor.isServer){

    import '../../server/publication-backgrounds'

    describe('Background Publication', function (){

        let sandbox;

        beforeEach(function (){
            sandbox = sinon.sandbox.create();
        });

        afterEach(function (){
            sandbox.restore();
        });

        it('background images from disk are published', function (done){

            sandbox.stub(Meteor, 'userId').returns(Random.id());

            const collector = new PublicationCollector();

            sandbox.stub(fs, 'readdirSync').returns(['/fakefile1.png', '/fakefile2.png', 'fakeFile3.png'])

            collector.collect('backgrounds', null, (collections) => {
                // console.log('The collections', JSON.stringify(collections, null, 4));
                const backgrounds = collections.backgrounds;
                expect(collections.backgrounds.length, 3);
                expect(backgrounds).to.have.length(3);
                // expect(volunteers[0].volunteerId).to.equal(v.volunteerId);
                // expect(volunteers[0].tournamentId).to.equal(insertedTIDs[0]);
                // expect(volunteers[0].volunteerName).to.have.equal(volunteer.volunteerName);
                // expect(volunteers[0].volunteerPassword).to.equal(volunteerPW);
                done();
            });

        })
    })
}