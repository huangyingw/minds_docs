---
id: notifications
title: Notifications
---

## Backend events and settings

Let's say we want to create a notification to send to video chat participants after a chat has completed.

In the relevant `NotificationDelegate.php`:

```php
$this->dispatcher->trigger('notification', 'all', [
  'to' => [$videochat->getParticipantGuid()],
  'entity' => $hostEntity,
  'from' => $videochat->getHostGuid(),
  'notification_view' => $videochat_complete,
  'params' => [],
  ]);
```

Add your `notification_view` to [PushSettings.php](https://gitlab.com/minds/engine/blob/master/Core/Notification/Settings/PushSettings.php):

```php
class PushSettings
{
protected $types = [
    ...
    'videochat_complete' => true,
];

```

Also add your `notification_view` to:

- [Notification/Manager.php](https://gitlab.com/minds/engine/blob/master/Core/Notification/Manager.php) to determine which notification category it belongs to (e.g boosts, subscriptions, votes, etc.)
- [Notification/Extensions/Push.php](https://gitlab.com/minds/engine/blob/master/Core/Notification/Extensions/Push.php)

> TODO: What is Push.php? and should referrals be in there?

## Frontend template

Set up the template in [notification.component.html](https://gitlab.com/minds/front/blob/master/src/app/modules/notifications/notification.component.html):

```html
<ng-template ngSwitchCase="videochat_complete">
  ...
</ng-template>
```

## Testing

Make sure the notification dispatcher runner is running:

```console
docker-compose exec php-fpm php /var/www/Minds/engine/cli.php QueueRunner run --runner=NotificationDispatcher
```
