## Sequent Retrospectives V1.1

Taking your teamperature every week is a great way to measure how well things are going with the group of people you spend most of your time with.

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
- Sequent is currently on Meteor v1.7x

## Core Features

### Login - Landing Page

<img src="/src/private/login.jpg" width="250">

### Create Team

<img src="/src/private/create-team.jpg" width="250">

### Tool bar area

Use the tool bar to navigate between Sequent core functions. Tap or click on one of the 3 icons to navigate.

<img src="/src/private/toolbar.jpg" width="150">

### Retro Board

This is where your team shares ideas, has discussions, and creates action items.

Each member logs into the team account and anonymously puts in their team feedback in one of the 3 appropriate buckets.

Everyone sees everyone else's items without knowing who put them in.

The team can then take a minute to up-vote items then discuss what was entered by team members in retospective session.

There are no rules around how you vote. You can up vote stuff 1000 times. There is currently no down vote though. Your team should decide how you want to use voting in a way that helps your team have better discussions.

Once you're done voting you can use the _sort feature_ (see __Tools__ below) to change how the items in each category are displayed. Sort will display items in # votes decending order with items with the most votes on top. 

The idea is that in a case you run out of meeting time you'll at least end up discussing the most important (items with highest votes) items.

<img src="/src/private/main_board.jpg" width="400">

### Actions View

Add, change delete actions. Tap on the red action item badge to manage action items.

<img src="/src/private/actions.jpg" width="400">

#### Sending Action items Via Email

Post-retro you can share action items with your team by tapping the share button from the Action Items List page.

<img src="/src/private/share-button.jpg" width="400">

This presents the user with a dialog to enter the email address they'd like to send the outstanding action items to.

<img src="/src/private/share-actions-dialog.jpg" width="400">

You can send to multiple emails by seperating the addresses with a semi-colon.

For example: myaddress@email1.com;myaddress@email2.com;myaddress@email3.com

Or simply use a team group email. Note the group email needs to be public. Some companies do not make team group distribution lists public.

The email iaddress values you enter will get "remembered" in local storage on _the local device_ and will pre-populate next time you decide to share action items.

By default action items are sent from _noreply@6thcents.com_ but you can customize this by setting the FROM_EMAIL_ADDRESS environment variable to whatever email address you'd like to send action items from.

### Tools

Sequent has a few tools to make sure your retros are the best they can be.

You access these from the Sequent system menu (gear icon in upper right hand corner)

<img src="/src/private/tools.jpg" width="125">

- Sort - sort the retro board by votes descending
- Freeze - toggle allowing new retro items to be created
- Show Completed - toggle showing completed items
- Archive Retro - archive an open retro so next time you start with a clean slate
- View Archives - view previously archived retros
- Preferences - Sequent customization options - see customizing sequent
- Share Sequent - send a link to your installation to someone via email

### Archiving Retros

#### Best Practice

Best practice is to archive your retro as soon as you're session is done. The act of _archiving_ saves the retro in the retro archive and clears the retro board for your next retro meeting.  

To archive a retro you tap the archive tool from the Sequent system menu.

<img src="/src/private/archiveRetroMenuItem.jpg" width="200">

When you choose to archive a retro you can assign it a name. This is sorta handy if you've captured something special during the retro and want to make it easy to find later.

Naming retros is pretty easy. When you click the menu item to archive your retro you are presented with the following dialog:

<img src="/src/private/archiveName.jpg" width="400">

You can specify a name for your retro if you want. The retro name is optional - if you do NOT specify a name for your retro, Sequent will simply use the _current date and time_ for the retro name.

During the archive process the _currently active_ happy, meh and sad prompts get saved along with the retro items entered by your team. This makes it easy to understand what was discussed if you go back and pull up the archived retro at some later point in time.

> Note: if you change your prompts after you hold a retro but before you archive it, the prompts saved will not match the prompts active when the retro was actually held. You might need to read that again.

#### Viewing Archived Retros

To view an archived retro you need to tap on the _View Archives_ Sequent system menu item. See __Tools__ above.

You'll then be presented with a list of archived retros to choose from.

If you had specified a name when you created the retro that name will show up in the retro archive list to make it easy to locate.

<img src="/src/private/archiveList.jpg" width="400">

Tap the eye icon next to the archive you're interested in to view that archive.

### Customizing Sequent

<img src="/src/private/custom.jpg" width="250">

#### Change Prompts

Change the default retro board prompts manually or try the randomizer! 

By default they are ```:), :| and :(```

You can change these to any text string that helps your team achieve retro greatness.

For example you might want to ask specific questions to illicit a particular discussion.

If you want discussion prompt inspiration tap the __random__ button and see what happens :)

#### Choose Background Pattern

Set your team's preferred background pattern. This feature was created "just for fun" but lets your team make Sequent your own by choosing one of 15 or so unique background patterns.

Check it out let us know what you think.