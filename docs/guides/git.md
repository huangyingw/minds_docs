---
id: git
title: Git / GitLab
---

## Useful GitLab links

- [Minds Group](https://gitlab.com/groups/minds)

  - [What's happening in the current sprint](https://gitlab.com/groups/minds/-/boards) - dev team oversight
  - [Issues](https://gitlab.com/groups/minds/-/issues) - all of the bite-size tasks that we want to complete
  - [Merge requests](https://gitlab.com/groups/minds/-/merge_requests) - new code that hasn't been merged yet
  - [Sprints](https://gitlab.com/groups/minds/-/milestones) - ongoing two-week periods of continuous development
  - [Milestones](https://gitlab.com/groups/minds/-/milestones) - product/release-focused blocks of time that make up epics
  - [Epics](https://gitlab.com/groups/minds/-/epics) - longer-term projects containing milestones that share a theme
  - [Roadmap](https://gitlab.com/groups/minds/-/roadmap) - visualization of epic timelines

- [Minds Repository](https://gitlab.com/minds/minds)
  - [Engine](https://gitlab.com/Minds/engine) - backend code & APIs
  - [Front](https://gitlab.com/Minds/front) - client side Angular2 web app
  - [Sockets](https://gitlab.com/Minds/sockets) - web socket server for real-time communication
  - [Mobile](https://gitlab.com/Minds/mobile-native) - React Native mobile apps

## Branches vs. forks

For the Minds development team, **branches** are preferred over forks, as they integrate with the **review/sandbox** environments. Community contributors should use forks.

## Naming branches and commits

> When working on an epic that has branches in both front and engine, give both branches identical names so they are associated in your sandbox review app.

**Branch names** should be _no more that 20 characters long_ and include the related issue/epic number:

- e.g. `virtual-reality-chats-7049`

**Commit messages** should be prefixed with the issue type (e.g. feat, chore, fix, refactor...) in parentheses:

- e.g. `(feat): Virtual reality chats`

### Labels

Labels help the team and community by providing additional, filterable information about what's currently being worked on (and by who), what are the priorities, what's going on within each developer squad, activity related to a particular product, etc. Be sure to tag your issue/epic/MR with as many labels as is relevant.

Different activities have different label requirements. See specific labelling guidelines for [issues](####issue-labels) and [merge requests](####mr-labels) for more information.

See the complete [list of labels](https://gitlab.com/groups/minds/-/labels) in GitLab for comprehensive label descriptions.

## Issues workflow

Open an issue before creating a branch or merge request.

Tag issues with:

- Relevant labels (see [below](####issue-labels))
- Related epic (if applicable)
- Related milestone (if applicable)
- A weight (see [below](####issue-weights))
- Time tracking (include on the issue page, either in the description or as a comment). Each sprint should add up to 60h (30h per week - this allows for meetings/planning to not interfere with the estimates)
  - Time estimate, e.g. `/estimate 1d 2h 30m`
  - Time spent, e.g. `/spend 4h 15m`

### Issue weight

Weights are an indicator of complexity.

- 1 - Trivial
- 2 - Small
- 3 - Medium, will take some time and collaboration
- 4 - Something in between 3 and 5 :)
- 5 - Large, will take a major portion of the milestone to finish

### Issue labels

Labels should be applied to issues at various stages of the issues workflow:

**_When it's created_**

| Label                                     | Description                                                                                                            | Required                                 |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| <nobr>`Type::Feature`</nobr>              | A new feature or an improvement to an existing feature                                                                 | Always                                   |
| <nobr>`Type::Bug`</nobr>                  | A bug exists in a product or feature                                                                                   | Always (must have **Severity::** labels) |
| <nobr>`Type::Chore`</nobr>                | Small weighted tasks                                                                                                   | Always                                   |
| <nobr>`Type::Refactor`</nobr>             | An existing feature needs to be re-structured                                                                          | Always                                   |
| <nobr>`Type::Regression`</nobr>           | A previous working feature has broken.                                                                                 | Always                                   |
|                                           |                                                                                                                        |                                          |
| <nobr>`Product::*`</nobr>                 | A label for each product. [See all here](https://gitlab.com/groups/minds/-/labels?utf8=✓&subscribed=&search=product::) | Always                                   |
|                                           |                                                                                                                        |                                          |
| <nobr>`Priority::0 - Urgent`</nobr>       | Issue must be started immediately                                                                                      | Always                                   |
| <nobr>`Priority::1 - High`</nobr>         | Issue to be completed in 30 days                                                                                       | Always                                   |
| <nobr>`Priority::2 - Normal`</nobr>       | Issue to be completed in 90 days (quarter)                                                                             | Always                                   |
| <nobr>`Priority::3 - Nice to have`</nobr> | Issue to be completed in 180 days or more                                                                              | Always (never with a `Type::Bug`)        |
| <nobr>`Priority::4 - Trivial`</nobr>      | No time estimation associated                                                                                          | Always (never with a `Type::Bug`)        |
|                                           |                                                                                                                        |                                          |
| <nobr>`Severity::0 - Blocker`</nobr>      | Unusable feature with no workaround, user is blocked <br> Eg. Unable to make a comment                                 | With `Type::Bug` & `Type::Regression`    |
| <nobr>`Severity::1 - Critical`</nobr>     | Broken Feature, workaround too complex & unacceptable <br> Eg. Token balance chart is not rendering correctly          | With `Type::Bug` & `Type::Regression`    |
| <nobr>`Severity::2 - Major`</nobr>        | Broken feature with an acceptable workaround <br> Eg. Gathering pulsator not displaying                                | With `Type::Bug` & `Type::Regression`    |
| <nobr>`Severity::3 - Low`</nobr>          | Functionality inconvenience or cosmetic issue <br> Eg. Font colour is incorrect or a UI element is not aligned         | With `Type::Bug` & `Type::Regression`    |

**_Once it's assigned to a squad_**

- [Squad::](https://gitlab.com/groups/minds/-/labels?utf8=✓&subscribed=&search=squad::) ~Blue, ~Green, ~Yellow

**_Once its squad decides which sprint to assign it to_**

- [Sprint::](https://gitlab.com/groups/minds/-/labels?utf8=✓&subscribed=&search=sprint::) ~10/09 - Pink Panther, ~12/30 - Understood Unicorn, etc.

**_Once a developer starts working on it_**

- [Status::](https://gitlab.com/groups/minds/-/labels?utf8=✓&subscribed=&search=status::) ~InProgress, ~Review, ~Follow Up

**_If it's Type::Bug(Triage)_**

- [Triage::](https://gitlab.com/groups/minds/-/labels?utf8=%E2%9C%93&subscribed=&search=triage::) ~Questions, ~Review, ~Unable to replicate (see [bug lifecycle](###bug-lifecycle) for details)

**_If it's Type::Bug_**

- [Platform::](https://gitlab.com/groups/minds/-/labels?utf8=%E2%9C%93&subscribed=&search=platform::) ~Browser, ~Mobile, etc.

**_If it's Type::Regression_**

- [Regression::](https://gitlab.com/groups/minds/-/labels?utf8=%E2%9C%93&subscribed=&search=regression::) ~Canary, ~Production, ~Staging

## Merge request (MR) workflow

> If your merge request requires changes and isn't ready to be merged yet, add **WIP:** to the beginning of its title.

### MR labels

(See [issue labels](####issue-labels) for examples)

- [Type::](https://gitlab.com/groups/minds/-/labels?utf8=✓&subscribed=&search=type::)
- [Product::](https://gitlab.com/groups/minds/-/labels?utf8=✓&subscribed=&search=product::)
- [Squad::](https://gitlab.com/groups/minds/-/labels?utf8=✓&subscribed=&search=squad::)
- [Sprint::](https://gitlab.com/groups/minds/-/labels?utf8=✓&subscribed=&search=sprint::)
- [MR::](https://gitlab.com/groups/minds/-/labels?utf8=✓&subscribed=&search=mr::) ~Awaiting Review, ~Ready to Merge, ~Requires Changes

### MR description

Ensure that you:

1. Clearly explain its purpose
2. Reference the original issue # that the MR closes
3. Provide guidelines for QA testers

For example:

_"Allows users to chat in virtual reality. Users must select a checkbox in channel settings in order to opt-in. Users must be logged in and subscribed to one another in order to be eligible. Not enabled for group chats._

_To test, try to start a VR chat with/without a VR headset. Make sure you can't engage in a VR chat unless the settings checkbox is checked._

_Closes issue #7049."_

### Using the staging environment

Once the pipeline has passed for your MR, you can test it in the staging environment by clicking the "view app" button on the MR page. If there isn't already a "view app" button, click the 4th icon on the pipeline (the row of primarily green checkmarks - the 4th one should be titled "review:"). From the dropdown that appears, select "review:start". Wait for the app to build (it may take ~20-30 mins) before you can start using it.

### QA

When an MR is ready to be tested by someone else, add a "QA" approval rule and assign at least one approver to conduct testing. Include some testing guidelines in your MR description to point your tester in the right direction.

## Bug lifecycle

Bugs generally start off in the bug triage system (with a `Type::Bug (Triage)` label), which allows us to identify and properly document incoming bugs. A bug in triage can be in one of three states:

- `Triage::Questions` - the information provided in the issue's bug template was insufficient and a developer is in the process of gathering additional information from the submitting user

- `Triage::Review` - responsibility for the bug has been handed off from the developer in charge of incoming bug reports to a different developer
- `Triage::Unable to replicate` - we can't reproduce the bug and consequently are unable to resolve it

When the bug is replicable and the issue contains necessary information for a developer to fix it, the bug is taken out of triage by removing the `Type::Bug (Triage)` label and replacing it with either `Type::Bug` or `Type::Regression`. If it's a regression, apply a `Regression::` label so we can identify where things went wrong.

## Epics

Epics will span multiple milestones for a project (#mvp, #review, #release). Avoid using sub epics, as they mess up the roadmap.
