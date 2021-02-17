/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import { _ } from 'meteor/underscore'
import moment from 'moment'
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { Sequent, Retros, Settings } from '../../lib/sequent'
import { Constants } from '../../lib/constants'

import { TestData } from '../testData'

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    import { ConvertRetro } from '../../server/convertRetro'

    describe('Convert Retro Function', function () {
        let sandbox

        beforeEach(function () {
            sandbox = sinon.createSandbox()
        });

        afterEach(function () {
            sandbox.restore()
        })

        it('converts retro correctly', function () {
            const fakeRetro = TestData.fakeRetro2({ itemType: 'Meh' })

            const fakeSettings = {
                happyPlaceholder: 'Happy',
                mehPlaceholder: 'Meh',
                sadPlaceholder: 'Sad'
            }

            const result = ConvertRetro(fakeSettings, fakeRetro)

            const expected = '"Happy","Meh","Sad"\n"","fake title",""\n"","fake title",""\n"","fake title",""\n'

            expect(result).to.equal(expected)
        })
    })
}
