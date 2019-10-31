---
id: architecture
title: Architecture
---

## Overview

> TODO: update this diagram

![Architecture diagram](assets/architecture-diagram.jpg "Diagram of Minds architecture")
[Click to enlarge](assets/architecture-diagram.jpg)

## Sockets

Sockets are for live interactions, such as comments, group gathering pulsators, notifications, messenger, and the jury.

Note: if you are using Docker, make sure your **JWT secret** maps to the **JWT secret** in `settings.php`. You shouldn't have to do anything if you are using Kubernetes, which automatically maps it to the helm .yaml file.

```php
$CONFIG->set('sockets-jwt-secret', '{{my-jwt-secret}}');
```

See the [README.md](https://gitlab.com/minds/sockets/blob/master/README.md) of the [Minds Sockets Server](https://gitlab.com/minds/sockets) repository for build instructions.

## Production

### Dashboards

> We are working on creating public dashboards. For now the dashboard is only available to developers internally.

https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=SystemTriage;expand=true;start=P1D

![Architecture diagram](assets/cloudwatch.jpg "Diagram of Minds architecture")
[Click to enlarge](assets/cloudwatch.jpg)

### Incidents

System issues should be recorded via a ticket on the [gitlab.com/minds/minds](https://gitlab.com/minds/minds) repository. The issue should be tagged with the **Incident** label.

#### Status Page

Site wide issues should be reported via the [status.minds.com](https://status.minds.com/) site, hosted via [gitlab.com/minds/status](https://status.minds.com/).

##### Creating an incident

- `npm run new-incident`
- Create a new issue with the ~"Type::Incident" label

###### Resolving an issue

- `npm run update-incident`

```
::: update Resolved | 2019-08-16T01:24:45.752Z
Place some text here to say that the issue has been resolved.
:::
```

### Load Balancers

The main loadbalancer for minds.com is **arn:aws:elasticloadbalancing:us-east-1:324044571751:loadbalancer/app/minds-app/70773ee320ac7dd1**. The table below explains the target rules:

| Ports  | Condition      | Target                                                                                                    |
| ------ | -------------- | --------------------------------------------------------------------------------------------------------- |
| 80,443 | cookie=staging | arn:aws:elasticloadbalancing:us-east-1:324044571751:targetgroup/ecs-minds-staging/b0c24d90ee949627        |
| 80,443 | cookie=canary  | arn:aws:elasticloadbalancing:us-east-1:324044571751:targetgroup/ecs-minds-canary/bb715b72c7845c5b         |
| 80,443 | \*             | arn:aws:elasticloadbalancing:us-east-1:324044571751:targetgroup/ecs-minds-production-app/1656c5e24927ff4b |

The above targets are automatically linked to ECS containers and should **not** be manually modified.
