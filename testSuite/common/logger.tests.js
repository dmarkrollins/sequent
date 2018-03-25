/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { Logger } from '../../lib/logger'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    let sandbox

    describe('Logger', function () {
        beforeEach(function () {
            sandbox = sinon.createSandbox()
        });

        afterEach(function () {
            sandbox.restore()
        })

        it('logs to console', function () {
            sandbox.stub(console, 'log')

            Logger.log('fake message')

            expect(console.log).to.have.been.called

            expect(console.log).to.have.been.calledWith('fake message')
        })
    })
}

if (Meteor.isClient) {
    let sandbox
    describe('Logger', function () {
        beforeEach(function () {
            sandbox = sinon.createSandbox()
        });

        afterEach(function () {
            sandbox.restore()
        })

        it('logs to console', function () {
            sandbox.spy(console, 'log')

            Logger.log('fake message')

            expect(console.log).to.have.been.called

            expect(console.log).to.have.been.calledWith('fake message')
        })
    })
}
