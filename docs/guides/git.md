---
id: git
title: Git / GitLab
---

## GitLab resources

- [Minds Group](https://gitlab.com/groups/minds)

  - [What's happening in the current sprint](https://gitlab.com/groups/minds/-/boards) - dev team oversight
  - [Issues](https://gitlab.com/groups/minds/-/issues) - all of the bite-size tasks that we want to complete
  - [Merge requests](https://gitlab.com/groups/minds/-/merge_requests) - new code that hasn't been merged yet
  - [Sprints](https://gitlab.com/groups/minds/-/milestones) - ongoing two-week periods of continuous development
  - [Epics](https://gitlab.com/groups/minds/-/epics) - longer-term projects containing issues that share a theme
  - [Roadmap](https://gitlab.com/groups/minds/-/roadmap) - visualization of epic timelines

- [Minds Repository](https://gitlab.com/minds/minds)
  - [Engine](https://gitlab.com/Minds/engine) - backend code & APIs
  - [Front](https://gitlab.com/Minds/front) - client side Angular2 web app
  - [Sockets](https://gitlab.com/Minds/sockets) - web socket server for real-time communication
  - [Mobile](https://gitlab.com/Minds/mobile-native) - React Native mobile apps

## Branches vs. forks

For the Minds development team, **branches** are preferred over forks, as they integrate with the **review/sandbox** environments. Community contributors should use forks.

### Branch names

Branch names should be no more that **20 characters** long and include the related issue/epic number. For example, **virtual-reality-chats-7049**.

If you are working on an epic with branches in both front and engine, give both branches identical names to associate them in the sandbox.

## Issues

Open an issue before creating a branch or merge request. Tag it with relevant [labels](##Labelling) such as `Type`, `Priority`, `Status`, `Squad`, `Product` and `Platform`.

If the issue is part of an epic, associate them by going to the epic page and adding the issue to its issue list.

## Merge requests

> If your merge request requires changes and isn't ready to be merged yet, add **WIP:** to the beginning of its title. Make sure it does not have the **MR::Awaiting Merge** label applied.

In the description of your MR, ensure that you:

1. Clearly explain its purpose
2. Reference the original issue # that the MR closes
3. Provide guidelines for QA testers

**For example**:

_Allows users to chat in virtual reality. Users must select a checkbox in channel settings in order to opt-in. Users must be logged in and subscribed to one another in order to be eligible. Not enabled for group chats._

_To test, try to start a VR chat with/without a VR headset. Make sure you can't engage in a VR chat unless the settings checkbox is checked._

_Closes issue #7049._

### Using the staging environment

Once the pipeline has passed for your MR, you can test it in the staging environment by clicking the "view app" button on the MR page. If there isn't already a "view app" button, click the 4th icon on the pipeline (the row of primarily green checkmarks - the 4th one should be titled "review:"). From the dropdown that appears, select "review:start".

### QA

When an MR is ready to be tested, add a "QA" approval rule and assign at least one approver to conduct testing. Include some testing guidelines in your MR description to point your tester in the right direction.

## Labels

Labels help the community by providing additional, filterable information about what's currently being worked on (and by who), what are the priorities, what's going on within each developer squad, activity related to a particular product, etc.

Be sure to tag your issue/epic/MR with as many labels as is relevant.

See the [list of labels](https://gitlab.com/groups/minds/-/labels) for comprehensive label descriptions.

### Examples

The table below illustrates how different naming conventions and labels apply to different issues and activities. It is not comprehensive and team members and contributors should visit the [list of labels](https://gitlab.com/groups/minds/-/labels) and get familiar with all of the available possibilities.

|                 | _Example_                       | Type              | Product | Squad | Status | Triage | Platform | MR  |
| --------------- | ------------------------------- | ----------------- | ------- | ----- | ------ | ------ | -------- | --- |
| Issue (not bug) | _Virtual reality chats_         | feat, chore, etc. | x       | x     | x      |        |          |     |
| Issue (bug)     | _Glitch in the matrix_          | bug               | x       | x     | x      | x      | x        |     |
| MR              | _Virtual reality chats_         | any               | x       | x     |        |        | x        | x   |
| Branch name     | _virtual-reality-chats-7049_    |                   |         |       |        |        |          |     |
| Commit message  | _(feat): Virtual reality chats_ |                   |         |       |        |        |          |     |

_Note: commit messages should be prefixed with "(type):" (e.g. feat, chore, bug, refactor etc.)_

## Bug lifecycle

Bugs generally start off in the bug triage system (with a `Type::Bug (Triage)` label), which allows us to identify and properly document incoming bugs. A bug in triage can be in one of three states:

- `Triage::Questions`: the information provided in the issue's bug template was insufficient and a developer is in the process of gathering additional information from the submitting user

- `Triage::Review`: responsibility for the bug has been handed off from the developer in charge of incoming bug reports to a different developer
- `Triage::Unable to replicate`: we can't reproduce the bug and consequently are unable to resolve it

When the bug is replicable and the issue contains necessary information for a developer to fix it, the bug is taken out of triage by removing the `Type::Bug (Triage)` label and replacing it with `Type::Bug`.
