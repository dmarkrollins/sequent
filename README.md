## Sequent Retrospectives V1.1

Taking your teamperature every week is a great way to measure know how things are going with the group of people you spend most of your time with.

Sequent lets you customize the questions you ask each week to make sure your team is having the right ongoing discussion. 

PRs are welcome.

## Check it Out

https://sequent.herokuapp.com/

## Development Info

You need to install Meteor - currently this project is on v1.7

## Installation

- Install [Meteor](https://www.meteor.com)
- Clone this repo
- cd sequent/src
- From the root folder run the project with the command `meteor`

## Testing

You need to update the coffescript package to get practicalmeteor:mocha to work with Meteor 1.6.

[Update Coffee Script Package Info](https://forums.meteor.com/t/mocha-tests-not-working-after-upgrade-to-1-6/40221)

## Core Features

### Login - Landing Page

<img src="/src/private/login.jpg" width="250">

### Create Team

<img src="/src/private/create-team.jpg" width="250">

### Tool bar area

Use the tool bar to navigate between Sequent core functions. Tap or click on one of the 3 icons to navigate. 

<img src="/src/private/toolbar.jpg" width="150">

### Retro Board

This is where your team shares ideas has discussions and creates action items.

Each member logs into the team account and anonymously puts in their team feedback in one of the 3 appropriate buckets.

Everyone sees everyone else's items without knowing who put them in. 

The team then takes a minute to vote on the items then discusses each in a team discussion bonding session.

<img src="/src/private/main_board.jpg" width="400">

### Actions

You can add, change delete actions here.

<img src="/src/private/actions.jpg" width="400">

#### Sending Actions Via Email

You can share action items with your team by tapping the share button from the Action Items List page. 

<img src="/src/private/share-button.jpg" width="400">

This presents the user with a dialog to enter the email address they'd like to send the outstanding action items to.

<img src="/src/private/share-actions-dialog.jpg" width="400">

You can send to multiple emails by seperating the addresses with a semi-colon.

For example: myaddress@email1.com;myaddress@email2.com;myaddress@email3.com

Or simply use a team group email.

Address values you enter will get "remembered" in local storage on the local device and will pre-populate next time that person decides to share action items.

By default action items are sent from _noreply@6thcents.com_ but you can customize this by setting the FROM_EMAIL_ADDRESS environment variable to whatever email address you'd like to send action items from.

### Tools

Sequent has a few tools to make sure your retros be the best they can be.

- Sort - sort the retro board by votes descending
- Freeze - toggle allowing new retro items to be created
- Show Completed - toggle showing completed items
- Archive Retro - archive an open retro so next time you start with a clean slate
- View Archives - view previously archived retros
- Preferences - Sequent customization options - see customizing sequent
- Share Sequent - send a link to your installation to someone via email

<img src="/src/private/tools.jpg" width="125">

### Customizing Sequent

Change the default retro board prompts manually or try the randomizer!

You can also set your teams preferred background pattern. 

<img src="/src/private/custom.jpg" width="250">
