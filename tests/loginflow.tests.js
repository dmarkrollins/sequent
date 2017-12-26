

describe( 'Sequent Login', function() {

    let url

    beforeEach(() => {
        url = process.env['chimp.ddp'] || process.env['chimp.ddp0']

    });

    it( 'should fail if user is unknown @watch', function() {
        browser.url(url)
        browser.setValue( 'input#teamName', 'test' )
        browser.setValue( 'input#password', 'fakepw' )
        browser.click('button#btnNext')

        browser.waitForText('span#errorMessage')

        expect(browser.getText('span#errorMessage')).to.equal('Invalid user name password combination!');
    })

    it( 'should navigate to new team when new button is clicked @watch', function() {
        // const url = process.env['chimp.ddp'] || process.env['chimp.ddp0']
        browser.url(url)
        browser.click('button#btnNewTeam')

        browser.waitForText('h3', 3000)

        expect(browser.getText('h3')).to.equal('Sequent')
        expect(browser.getText('strong')).to.equal('Create Your Team')

    })

    it( 'should validate both passwords are the same @watch', function() {
        // const url = process.env['chimp.ddp'] || process.env['chimp.ddp0']
        browser.url(url)
        browser.click('button#btnNewTeam')

        browser.waitForText('h3', 3000)

        browser.setValue('input#teamName', 'test')
        browser.setValue('input#password', 'Open1234')
        browser.setValue('input#confirmPassword', 'open1234')
        browser.click('button#btnCreateNewTeam')

        browser.waitForText('#errorMessage', 3000)

        expect(browser.getText('#errorMessage')).to.equal('Passwords do not match!')

    })

    it( 'should validate both passwords correct format @watch', function() {
        // const url = process.env['chimp.ddp'] || process.env['chimp.ddp0']
        browser.url(url)
        browser.click('button#btnNewTeam')

        browser.waitForText('h3', 3000)

        browser.setValue('input#teamName', 'test')
        browser.setValue('input#password', 'open1234')
        browser.setValue('input#confirmPassword', 'open1234')
        browser.click('button#btnCreateNewTeam')

        browser.waitForText('#errorMessage', 3000)

        expect(browser.getText('#errorMessage')).to.equal('Password must be 8 chars and at least 1 uppercase, 1 lowercase, and 1 number :)')

    })


  });