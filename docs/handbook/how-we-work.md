---
id: how-we-work
title: How we work
---

Minds is a distributed team located on both sides of the Atlantic. We communicate via [Zulip](https://zulip.com), [Gitlab](https://gitlab.com) and Minds Gatherings (video chat).

Our workflow aims to provide a continuous and iterative development model that continuously deploys code, drives momentum to reliably ships products, enables developers to be creative and gives product level responsibilities to small teams.

## Workflow

The workflow defines milestones (sprints) as follows:

### Exploration

**<= 1 Week**

The Exploration phase follows the proposal for a new feature or improvement. A kickoff vision call should be arranged which should consist of vested parties such as product owners and product consultants. (see below).

**A deliverable of the Exploration phase** should be high level wireframes.

---

### Development

**1 - 4 Weeks**

During the Development phase, we should aim to checkin into master at the earliest available opportunity with a target of no more than 2 days. Feature flags should be used and tests should be written.

**A deliverable of the Development phase** should be shipping a basically usable product or feature. The Development phase may be split into multiple milestones. For example, an MVP may be required before more in depth development is appropriate.

---

### Canary

**1 - 2 Weeks**

Our pipelines and feature flags allow us to release to segments of users. Following the development sprint, we can toggle on the feature flag and begin receiving feedback from our users.

A deliverable to Canary phase is to continuously release iterations based on discovered bugs and feedback.

---

### Release

**<= 2 days**

Following a release to the entire user base, a buffer of a couple of days should be allocated to cleanup documentation, plan future maintenance capacity, resolves any urgent issues and gather usage metrics.

---

### Maintain

To account for the continued maintenance of the product/feature, teams should be allocated a variable number of hours per week to work on maintenance. (See below)

---

## Maintenance

As briefly explained above, the introduction of new products and features increases our **Tech debt** and requires future capacity to be planned in order to keep products well maintained.

In order to keep on top of the system-wide bug backlog, the list of issues should be treated as a FIFO (First in, first out) queue in order of priority and severity and weights.

- The [Bugs by Severity board](https://gitlab.com/groups/minds/-/boards/1704352?&label_name[]=Type%3A%3ABug) should be used to find issues
- Superhero issues should be resolved immediately
- Urgent bugs should be resolved in no more than 48 hours
- High priority should be first allocated to their respective product labels and validated by their Product Owner
- Take the lowest weighted, oldest created, highest severity bugs first

10-15% of the week should be dedicated to such issues.

---

### Continuous Delivery

#### Checkin to master

All branches should be derived from **master** and should be open for as short a time as possible.
When working on an issue, always try to achieve the **lowest possible scope for regression**. If this isn't possible then try and use a **Feature Flag** to isolate your change.

### Feature flags

**Feature Flags** allow use to check code into production without it being visible to users. See the [Feature Flags](https://gitlab.com/minds/infrastructure/feature-flags) repository for more information.

### E2E Tests

We use both **Cypress** (web) and **Detox** (mobile) for our E2E tests. We should aim for as full of a coverage as possible. If the tests are too fragile, consider stubbing them.

---

## Communication

### Shape of the week

| Day                                                | Description                                                                                                     | Personnel                               |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Daily <br> _(Monday, Wednesday, Friday are ASYNC)_ | Scrum calls. <br> 3 question quick fire. Anything longer should have follow up calls scheduled. <br>            | Team                                    |
| Weekly                                             | Product check-in. <br> A short 15-30 minute call to preview work done.                                          | Product owner <br> Team                 |
| As required                                        | Milestone retrospectives. <br>Analysis on how the sprint went, viability of the next phases, tech debt analysis | Product owner <br> Team                 |
| Bi-Weekly                                          | Product planning. <br> Product / feature proposals <br> Roadmap planning                                        | Product owners <br> Product consultants |

### Video Scrums

[Click here](https://www.minds.com/groups/profile/569521254306951168/feed) to join the calls.

Each team has a video call twice per week. The team answers the following questions:

1. What did you yesterday
2. What are you going to do today
3. Are there any issues

### Asynchronous Scrums

On days where the team does not have a video call scheduled, the scrum will be performed offline and still follow the same 3 question patterns as noted above.

### Devshop

Optional daily 30 minute meetings where team members can hop in and out, discuss issues or share knowledge. Monday, Wednesday, Friday 11am EST.

### Todo Feature

- [Gitlab's Todo feature](https://gitlab.com/dashboard/todos) is ideal for keeping in the loop
- Mention a team member in a comment if you need a response
- Try to keep your Todo list as low as possible

---

## Terminology

| Role               | Scope                                                                                                                                                | Personnel                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Product Owner      | Co-ordinates the exploration phase <br> Regular calls with product teams <br> Maintains the vision of the product <br> Controls the maintenance debt | Bill, Mark, Jack                                 |
| Product Consultant | This is a technical role. <br> Invited by product owners for advice, reviews, estimations, etc                                                       | Mark (tech + code) <br> Michael (ux&design) <br> |
| Developer Bench    | Developers are able to be selected by Product Owners to work on their milestones                                                                     | Developers                                       |
| Tech debt          | Bugs / issues from a product                                                                                                                         | N/A                                              |
| Epic               | The product implementation plan, proposal and scope resides                                                                                          | N/A                                              |
| Sprint             | A milestone grouped into the above workflow types. <br> Exploration, Development, Canary, Release                                                    | N/A                                              |

---

## Weights

Weights should be used as an indication of complexity and not as a metric of time. (See [Gitlabs handbook](https://about.gitlab.com/handbook/engineering/development/dev/create-source-code-be/#capacity-planning) for more information)

| Weight     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1: Trivial | The problem is very well understood, no extra investigation is required, the exact solution is already known and just needs to be implemented, no surprises are expected, and no coordination with other teams or people is required.<br><br>Examples are documentation updates, simple regressions, and other bugs that have already been investigated and discussed and can be fixed with a few lines of code, or technical debt that we know exactly how to address, but just haven't found time for yet.                                                                                                                                                                                                                   |
| 2: Small   | The problem is well understood and a solution is outlined, but a little bit of extra investigation will probably still be required to realize the solution. Few surprises are expected, if any, and no coordination with other teams or people is required.<br><br>Examples are simple features, like a new API endpoint to expose existing data or functionality, or regular bugs or performance issues where some investigation has already taken place.                                                                                                                                                                                                                                                                     |
| 3: Medium  | Features that are well understood and relatively straightforward. A solution will be outlined, and most edge cases will be considered, but some extra investigation will be required to realize the solution. Some surprises are expected, and coordination with other teams or people may be required.<br><br>Bugs that are relatively poorly understood and may not yet have a suggested solution. Significant investigation will definitely be required, but the expectation is that once the problem is found, a solution should be relatively straightforward.<br><br>Examples are regular features, potentially with a backend and frontend component, or most bugs or performance issues.                               |
| 5: Large   | Features that are well understood, but known to be hard. A solution will be outlined, and major edge cases will be considered, but extra investigation will definitely be required to realize the solution. Many surprises are expected, and coordination with other teams or people is likely required.<br><br>Bugs that are very poorly understood, and will not have a suggested solution. Significant investigation will be required, and once the problem is found, a solution may not be straightforward.<br><br>Examples are large features with a backend and frontend component, or bugs or performance issues that have seen some initial investigation but have not yet been reproduced or otherwise "figured out". |

---

## Estimates

Gitlab's `/estimate` `/spend` should be used to quantify how long a task will take and has been spent on.

---

## Teamwork

Working as part of a development team does not have to default to traditional backend, frontend and mobile focuses.
A full stack approach brings both knowledge and collaboration to the entire team and also eliminates roadblocks of a backend api not being ready yet for a frontend developer.
Teams should have a shared focus and not shared dependencies.

---

## Examples

### Messenger Epic

_This epic is being used as an illustration only and is not the scope of the actual Messenger Epic_

| Phase       | Time                     | Description                                                                                                                                                                                                                                                                                                                                                  |
| ----------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Exploration | <nobr>1 Week</nobr>      | UX&Design to present wire frames <br> Epic is established with agreed scope                                                                                                                                                                                                                                                                                  |
| Development | <nobr>3 Weeks</nobr>     | <ul><li>Run a matrix server</li><li>Minds SDK to communicate with Matrix</li><li>Schema for conversations and teams</li><li>Implement Minds internal API with stubs</li></ul> Progress will be visible throughout the process and continuously checked into to master under feature flags.<br></br> The messenger should be usable at the end of the sprint. |
| Development | <nobr>2 Weeks</nobr>     | Following working demo, cleanup key issues and aim for canary preview as a delivery.                                                                                                                                                                                                                                                                         |
| Canary      | <nobr>2 Weeks</nobr>     | Work in parallel with the feedback and issues                                                                                                                                                                                                                                                                                                                |
| Release     |                          | Analyze future scope and tech debt                                                                                                                                                                                                                                                                                                                           |
| **Total**   | <nobr>**8 Weeks**</nobr> |                                                                                                                                                                                                                                                                                                                                                              |

### Error messages

_This epic is being used as an illustration only and is not the scope of the actual Error Messages Epic_

| Phase       | Time                    | Description                                                                                                                                                                                                             |
| ----------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Exploration | <nobr>1 - 2 days</nobr> | UX&Design to present mockups that Platform Team approve                                                                                                                                                                 |
| Development | 1 Weeks                 | <ul><li>Build out reusable toaster component</li><li>Scale out to other features such as composer, login, etc.</li><li>Document how to use</li></ul>Deliver to production as soon as possible (daily is possible here). |
| Release     |                         | Analyze future scope and tech debt                                                                                                                                                                                      |
| **Total**   | <nobr>**1 Week**</nobr> |

---

## QA

Please visit the [REAMDE.md](https://gitlab.com/minds/qa) on [https://gitlab.com/minds/qa](https://gitlab.com/minds/qa) for more information about our QA process.

## Issues and Epics

The full project management workflow board can be found [here](https://gitlab.com/groups/minds/-/boards/1264761).

[![Architecture diagram](assets/work-flow.png "Diagram of Minds Workflow")
Click to enlarge](assets/work-flow.png)

## Work in progress

This document is a work in progress. Let's discuss how to improve our processes!
