---
id: superhero
title: Superhero
---

> We are currently building out this section

## What is a Superhero

A Superhero is a critical site outage that requires immediate attention. We use [PagerDuty](https://pagerduty.com) to handle our on-call schedules and notification routing. 

## How to declare a Superhero

Follow the diagram below to determine if a Superhero should be called:

[![Superhero diagram](assets/superhero.png "Diagram of Minds Superhero")
Click to enlarge](assets/superhero.png)

1. Always open a new browser window, clear all cookies and session data.
2. Ensure you are not in Canary mode or have any canary cookies set
3. Create an new issue at [gitlab.com/minds/minds](gitlab.com/minds/minds) with the **Superhero** template.
4. The template will automatically apply the **Type::Superhero** and **Superhero::Triggered** labels.
5. Pagerduty will automatically be triggered via Gitlab. The Gitlab issue should be treated as the central communication hub with the **#superhero** room on Zulip used for additional offline support.

## Runbooks

> We are currently in the process of creating runbooks for on-call issues. We will update this section when they are ready.

