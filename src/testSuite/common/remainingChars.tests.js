/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isClient) {
    import { UXUtils } from '../../client/common/uxUtils'

    let sandbox

    describe('Remaining Chars', function () {
        beforeEach(function () {
            sandbox = sinon.createSandbox()
        });

        afterEach(function () {
            sandbox.restore()
        })

        it('calculates remaining chars correct > 0', function () {
            const result = UXUtils.remainingChars('fake message')

            expect(result).to.equal('243/255')
        })

        it('calculates remaining chars correct = 0', function () {
            const result = UXUtils.remainingChars('X'.repeat(255))

            expect(result).to.equal('0/255')
        })

        it('calculates remaining chars correct < 0', function () {
            const result = UXUtils.remainingChars('X'.repeat(300))

            expect(result).to.equal('0/255')
        })
    })
}
