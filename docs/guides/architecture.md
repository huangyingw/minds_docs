---
id: architecture
title: Architecture
---

## Overview

> TODO: update this diagram

![Architecture diagram](assets/architecture-diagram.jpg 'Diagram of Minds architecture')
[Click to enlarge](assets/architecture-diagram.jpg)

## Sockets

Sockets are for live interactions, such as comments, group gathering pulsators, notifications, messenger, and the jury.

Note: if you are using Docker, make sure your **JWT secret** maps to the **JWT secret** in `settings.php`. You shouldn't have to do anything if you are using Kubernetes, which automatically maps it to the helm .yaml file.

```php
$CONFIG->set('sockets-jwt-secret', '{{my-jwt-secret}}');
```

See the [README.md](https://gitlab.com/minds/sockets/blob/master/README.md) of the [Minds Sockets Server](https://gitlab.com/minds/sockets) repository for build instructions.
