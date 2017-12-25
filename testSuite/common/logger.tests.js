/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer){

    import { Logger } from '../../lib/logger.js'

    describe('Logger', function (){

        beforeEach(function (){
            sandbox = sinon.createSandbox()
        });

        afterEach(function (){
            sandbox.restore()
        })

        it('logs to console', function(){

            sandbox.stub(console, 'log')

            Logger.log('fake message')

            expect(console.log).to.have.been.called

            expect(console.log).to.have.been.calledWith('fake message')

        })
    })
}

if (Meteor.isClient){

    import { Logger } from '../../lib/logger.js'

    describe('Logger', function (){

        beforeEach(function (){
            sandbox = sinon.createSandbox()
        });

        afterEach(function (){
            sandbox.restore()
        })

        it('logs to console', function(){

            sandbox.stub(console, 'log')

            Logger.log('fake message')

            expect(console.log).to.have.been.called

            expect(console.log).to.have.been.calledWith('fake message')

        })
    })
}