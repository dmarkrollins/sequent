/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Random } from 'meteor/random'
import { $ } from 'meteor/jquery';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import fs from 'fs'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import '../../server/method-componentImages.js'

    describe('Component Images Method', function () {
        let sandbox
        let subject
        let result

        beforeEach(function () {
            sandbox = sinon.createSandbox()
            subject = Meteor.server.method_handlers.componentImages;
        });

        afterEach(function () {
            sandbox.restore()
        })

        it('returns appropriately filtered images', function () {
            const context = {};
            let msg = '';

            const fakeFiles = [
                'file1.html',
                'file2.png',
                'file3.ico'
            ]

            sandbox.stub(fs, 'readdirSync').returns(fakeFiles)

            try {
                result = subject.apply(context, ['png'])
                expect(result.length, 'should only return 1 file').to.equal(1)
                expect(result[0].fileName).to.equal('/file2.png')
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should not throw error').to.be.equal('');
        })
    })
}
