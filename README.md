## Sequent Retrospectives V1.19

Taking your teamperature every week is a great way to measure how well things are going with the group of people you spend most of your time with.

PRs are welcome.

## Check it Out

https://sequent.herokuapp.com/

## Development Info

You need to install Meteor - currently this product is on v2.0

## Installation

- Install [Meteor](https://www.meteor.com)
- Clone this repo
- cd sequent/src
- create an local.sh file and add it to the src folder
- From the root folder run the project with the command `npm run start`

The local.sh file (or local.cmd file on Windows) should contain something like this:

```
export MAIL_URL=your smtp server url
meteor run 
```

You can also skip the local.sh file and simply run the project with the command `meteor run` from the _src_ folder. If you go this route any action item report you send will simply be printed to console.

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

The idea behind sorting items by vote count is if you run out of meeting time you'll at least end up discussing the most important (items with highest votes) items.

<img src="/src/private/main_board.jpg" width="400">

### Actions View

When discussing retro items entered by team members you'll more than likely end up wanting to take action on something.

This is where action items come in. They stick around from retro to retro until you _complete_ them. In this way action items are like a team to do list.

You'll notice you can enter them from both the top of the retro board and the action items view.

When you create an action item the best practice is to assign the thing to a specific team member by adding their name to the action item title.

So for example - assigning a networking task to _Jim_ might look something like this:

```
Contact networking to research intermittent packet drops (Jim) 
```

To get started managing action items tap the red action item badge to navigate to the action items view.

<img src="/src/private/actions.jpg" width="400">

On the action item view page you manage action items by adding, changing, deleting and completing them. 

Action Items are listed as a continuous scrolling list of actions in blocks of 25 items. 

When there are no more action items to show you'll see _"There are no more action items to display."_ at the bottom of the list.

#### Toggle the Showing of Completed Actions

On the Action Items List page you can toggle showing __all__ action items (ie. both active and completed items). You might want to do this because an action item you recently completed needs to be re-activated or you just want to see the completed actions for some other reason.

By default completed items are __not__ shown. 

To see them tap the _Completed_ button:

<img src="/src/private/show-completed-actions.jpg" width="400">

You will then be able to see both active and completed items in the Action Items list view.

<img src="/src/private/showing-completed-actions.jpg" width="400">

>Note: the slider icon on the Completed button indicates when you're viewing completed items.

#### Sending Action items Via Email

Post-retro you can share active and recently completed action items with your team by tapping the share button from the Action Items List page.

<img src="/src/private/share-button.jpg" width="400">

This presents the user with a dialog to enter the email address they'd like to send the outstanding action items to.

<img src="/src/private/share-actions-dialog.jpg" width="400">

You can send to multiple emails by seperating the addresses with a semi-colon.

For example: myaddress@email1.com;myaddress@email2.com;myaddress@email3.com

Or simply use a team group email. 

>Note: The group email needs to be public! Some companies do not make team group distribution lists public.

The email address values you enter will get "remembered" in local storage on _the local device_ and will pre-populate next time you decide to share action items. 

By default action items are sent from _sequent@6thcents.com_ but you can customize this by setting the FROM_EMAIL_ADDRESS environment variable to whatever email address you'd like to send action items from.

The action items report looks something like this:

<img src="/src/private/actionReport.jpg" width="400">

### Tools

Sequent has a few tools to make sure your retros are the best they can be.

You access these from the Sequent system menu (gear icon in upper right hand corner)

<img src="/src/private/tools.jpg" width="125">

- Sort - sort the retro board by votes descending - so the most important ones (highest votes) are on top
- Freeze - toggle allowing new retro items to be created - you might want to stop new entries after some arbitrary number of minutes to have the team switch focus to voting and discussion.
- Show Completed - toggle whether completed retro items show on the retro board.
- Export Retro - exports the current retro board as a CSV and downloads this file to your computer.
- Clear Retro - permanently removes both completed and non completed items from the retro board. 
- Archive Retro - archive an open retro so next time you start with a clean slate.
- View Archives - view previously archived retros.
- Preferences - Sequent customization options - see _Customizing Sequent_ below.
- Share Sequent - share Sequent goodness with someone you know via email.
- Sequent Help - navigate to this read me file on GitHub.
- Version X.X.X - displays the Sequent version history.
- Usage History - if this option is turned on it will display a Sequent Usage History chart.
- Logout - logs you out of the current retro board.

### Archiving Retros

#### Best Practice

Best practice is to archive your retro as soon as you're session is done. The act of _archiving_ saves the retro in the retro archive and clears the retro board for your next retro meeting.  

To archive a retro you tap the archive tool from the Sequent system menu.

<img src="/src/private/archiveRetroMenuItem.jpg" width="300">

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

### Clearing the Retro Board

When you tap the "Clear Retro" drop down menu option you will be prompted if you would like to clear the retro board with the following prompt:

<img src="/src/private/clearBoard.jpg" width="400">

If you tap OK ALL current retro items entered, both completed and not completed, will be removed from the retro board PERMANENTLY.

### Viewing Sequent Usage

You can add a view of how many retros folks are running.

You can check this out by tapping the Usage History menu item.

<img src="/src/private/usageHistory.jpg" width="250">

You can activate this feature by exporting the environment variable USAGE_URL which should point to whatever usage history chart you'd like Sequent to point to within an IFrame.

The public Sequent install points this variable to a Mongo DB Charts chart URL.


### Customizing Sequent

<img src="/src/private/custom.jpg" width="250">

#### Change Prompts

You can change the default retro board prompts.

By default the happy, meh and sad prompts are ```:), :| and :(```

Change these to whatever helps your team achieve retro greatness.

For example you might want to ask specific questions to illicit a particular discussion.

If you're needing discussion prompt inspiration tap the __random__ button and see what happens :) Then tap it again.

#### Choose Background Pattern

Make Sequent your own by setting your team's preferred background pattern. This feature was created "just for fun" with 20 or so unique background patterns.

Check it out and let us know what you think.

Enjoy!