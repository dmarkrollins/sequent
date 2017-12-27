import fixtures from './fixtures'

describe( 'Retro Board', function() {

    let url
    let baseUrl

    before(function(){
        fixtures.resetAll()
        browser
            .timeoutAsyncScript(1500)
            .executeAsync(function(done) {
                Accounts.createUser({ username: 'chimp', password: 'ChimpPW1' }); 
                Meteor.loginWithPassword('chimp', 'ChimpPW1', function(err) {
                    if (err) {
                        console.error('Could not login', err);
                    } else {
                        done();
                    }
                })
            })
    })

    beforeEach(function() {
        baseUr= process.env['chimp.ddp'] || process.env['chimp.ddp0']
        url = `${baseUrl}/retro`
    })

    it('navigates to retro board correctly', function() {

    })


})