## Sequent Retrospectives V1.1

Taking your teamperature every week is a great way to measure know how things are going with the group of people you spend most of your time with.

Sequent lets you customize the questions you ask each week to make sure your team is having the right ongoing discussion.

PRs are welcome.

## Check it Out

https://sequent.herokuapp.com/

## Development Info

You need to install Meteor - currently this project is on v1.7x

## Installation

- Install [Meteor](https://www.meteor.com)
- Clone this repo
- cd sequent/src
- From the root folder run the project with the command `meteor`

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

The team then takes a minute to up-vote on the items then discusses each in a team discussion bonding session.

There are no rules around how you vote. You can up vote stuff 1000 times. There is no down vote though. Your team should decide how you want to use voting in a way that helps your team have better discussions.

Once you're done voting you can use the _sort feature_ - see __Tools__ below for more information.  

<img src="/src/private/main_board.jpg" width="400">

### Actions View

Add, change delete actions.

<img src="/src/private/actions.jpg" width="400">

#### Sending Actions Via Email

Post-retro you can share action items with your team by tapping the share button from the Action Items List page.

<img src="/src/private/share-button.jpg" width="400">

This presents the user with a dialog to enter the email address they'd like to send the outstanding action items to.

<img src="/src/private/share-actions-dialog.jpg" width="400">

You can send to multiple emails by seperating the addresses with a semi-colon.

For example: myaddress@email1.com;myaddress@email2.com;myaddress@email3.com

Or simply use a team group email. Note the group email needs to be public. Some companies do not make team group distribution lists public.

Email address values you enter will get "remembered" in local storage on _the local device_ and will pre-populate next time that person decides to share action items.

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

### Archiving Retros

Best practice is to archive your retro as soon as you're done. Archiving saves the retro in the retro archive and clears the retro board setting you up for your next retro meeting.  

During the archive process the current happy, meh and sad prompts are saved along with the retro items entered by your team.

Later, when you visit the archived retro (see __Tools__ above), you'll be able to see both the items that were captured and the column prompt values that were active when you held that retro.

<img src="/src/private/archived.jpg" width="400">

### Customizing Sequent

<img src="/src/private/custom.jpg" width="250">

#### Change Prompts

Change the default retro board prompts manually or try the randomizer! 

By default they are :), :| and :(

You can change these to any text string you want that helps your achieve greatness during retro.

#### Choose Background Pattern

Set your team's preferred background pattern. This feature was created "just for fun" but lets your team make Sequent your own by choosing onve of 15 or so unique patterns.

Check it out let us know what you think.