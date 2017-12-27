import fixtures from './fixtures'

describe( 'Sequent Login', function() {

    let url

    beforeEach(function() {
        url = process.env['chimp.ddp'] || process.env['chimp.ddp0']
    })

    it( 'should fail if user is unknown', function() {
        browser.url(url)
        browser.setValue( 'input#teamName', 'test' )
        browser.setValue( 'input#password', 'fakepw' )
        browser.click('button#btnNext')

        browser.waitForText('span#errorMessage')

        expect(browser.getText('span#errorMessage')).to.equal('Invalid user name password combination!');
    })

    it( 'should navigate to new team when new button is clicked', function() {
        browser.url(url)
        browser.click('button#btnNewTeam')

        browser.waitForText('h3', 3000)

        expect(browser.getText('h3')).to.equal('Sequent')
        expect(browser.getText('strong')).to.equal('Create Your Team')

    })

    it( 'should validate both passwords are the same', function() {
        browser.url(url)
        browser.click('button#btnNewTeam')

        browser.waitForText('h3', 3000)

        browser.setValue('input#teamName', 'test')
        browser.setValue('input#password', 'Fake1234')
        browser.setValue('input#confirmPassword', 'fake1234')
        browser.click('button#btnCreateNewTeam')

        browser.waitForText('#errorMessage', 3000)

        expect(browser.getText('#errorMessage')).to.equal('Passwords do not match!')

    })

    it( 'should validate both passwords are correct format', function() {
        browser.url(url)
        browser.click('button#btnNewTeam')

        browser.waitForText('h3', 3000)

        browser.setValue('input#teamName', 'test')
        browser.setValue('input#password', 'fake1234')
        browser.setValue('input#confirmPassword', 'fake1234')
        browser.click('button#btnCreateNewTeam')

        browser.waitForText('#errorMessage', 3000)

        expect(browser.getText('#errorMessage')).to.equal('Password must be 8 chars and at least 1 uppercase, 1 lowercase, and 1 number :)')
    })


    it( 'cancel on new team dialog should bring you back to login', function() {
        browser.url(url)
        browser.click('button#btnNewTeam')

        browser.waitForText('h3', 3000)

        browser.click('button#btnCancel')

        browser.waitForText('p#tagline', 3000)

        expect(browser.getText('p#tagline')).to.equal('Because your team is only as good as it\'s last retro...')
    })

    it('creating team successfully presents retro board @watch', function (){ 

        fixtures.resetAll() 
        
        browser.pause(1000)

        browser.url(url)
        browser.click('button#btnNewTeam')

        browser.waitForText('h3', 3000)

        browser.setValue('input#teamName', 'chimp')
        browser.setValue('input#password', 'ChimpPW1')
        browser.setValue('input#confirmPassword', 'ChimpPW1')
        browser.click('button#btnCreateNewTeam')

        browser.waitForExist('#boardWrapper', 3000)

    })

});