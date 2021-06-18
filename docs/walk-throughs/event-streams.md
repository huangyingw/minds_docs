---
id: event-streams
title: Event Streams
---

## Introduction

Event Streams enable event to be produced and consumed by mutliple different services. For example, `ActionEvents` are created on various user actions such as votes, comment, reminds etc and can be consumer by multiple services such as notifications, analytics and the recommendations engine. 

We use [Apache Pulsar](https://pulsar.apache.org) for our streams.

## EventStreams Topic

A topic is a channel which can produce and consume events. A topic can have multiple subscriptions. The [ActionEventsTopic](https://gitlab.com/minds/engine/-/blob/feat/pulsar-streams/Core/EventStreams/Topics/ActionEventsTopic.php) for example is responsible for validating the schema, sending the event and also allowing services to subscribe and consume these events.

## Sending events

### An example (comment event)

```php
...

$actionEvent = new ActionEvent();
$actionEvent
    ->setAction(ActionEvent::ACTION_COMMENT)
    ->setActionData([
        'comment_urn' => $comment->getUrn(), // The urn of the comment we just created
    ])
    ->setEntity($entity) // The entity we are commenting on
    ->setUser($comment->getOwnerEntity()); // Who made the comment

$actionEventTopic = new ActionEventsTopic(); // The topic
$actionEventTopic->send($actionEvent); // Simple, right?

...
```

## Subscribing to events

### An example (notification)

First, we need to create a subscription class that implements the `SubscriptionInterface` interface.

```php
...

class EventStreamsSubscription implements SubscriptionInterface
{
    public function getSubscriptionId(): string
    {
        return 'notifications'; // A custom ID
    }

    public function getTopic(): TopicInterface
    {
        return new ActionEventsTopic(); // The topic we are subscribing to
    }

    public function consume(EventInterface $event): bool
    {
        // Our logic here for what to do with the event

        return true; // True awknowledges the event, so it doesn't get retried
    }

...
```

We then need to register this in `Controllers/Cli/EventStreams.php` so that it can be executed via `php cli.php EventStreams --subscription=Core\\Notification\\EventStreamsSubscription`

### What is a subscription id?

A subscription id can be any string value. Subscription are idempotent, so they will be created on the fly when declared. Subscription cursors (message positions) are managed via Pulsar.