---
id: block
title: Block
---

This guide covers how the Block system works.

## Module

The Block modules exists as a submodule of the Security module and located in [Core/Security/Block](https://gitlab.com/minds/engine/-/tree/master/Core/Security/Block).

## ACL

The Block Module taps into the `acl:read:blacklist` event. This event hook will mark an entity as unreadable if the event returns a `true` response.

The module also taps into the `acl:interact` event and prevents interactions from happening if either a user is blocked by, or has blocked the other party.

## BlockEntry

The Block Module makes use of a [BlockEntry](https://gitlab.com/minds/engine/-/blob/master/Core/Security/Block/BlockEntry.php) model that holds an Actor (usually the logged in user making an action) and a Subject (the user being interacted with, or owning an entity/post).

```php
$blockEntry = (new BlockEntry)
    ->setActorGuid(123)
    ->setSubjectGuid(456);
//
// OR
//
$blockEntry = (new BlockEntry)
    ->setActor($loggedInUser)
    ->setSubject($entityOwner);
```

## hasBlocked(BlockEntry \$blockEntry)

The [hasBlocked](https://gitlab.com/minds/engine/-/blob/master/Core/Security/Block/Manager.php#L128) function is the most lightweight method of determining if an user exists on a logged in sessions block list. Caching is automagically handled.

The **actorGuid** should be the logged in user and the **subjectGuid** should be the entity owner.

## isBlocked(BlockEntry \$blockEntry)

The [isBlocked](https://gitlab.com/minds/engine/-/blob/master/Core/Security/Block/Manager.php#L105) function is mainly intended to be used when interacting with channels. Inversions of the block lists have to be collected in order to determine if a logged in session user has been blocked by an entity owner.

As above, the **actorGuid** should be the logged in user and the **subjectGuid** should be the entity owner.

## Data storage

Each channel maintains a list of channels that they have blocked. This list exists in the `entities_by_time` table with a `key` value prefixed as `acl:blocked:` and apended with the channels guid (eg. `acl:blocked:100000000000000063` will return @mark's list of blocked channels).

The `column1` value is the **guid** of the subject (the user who has been blocked) and the `value` column holds the timestamp (in unix seconds) of the time the entry was added.

### Repository

The [Core\Security\Block\Repository](https://gitlab.com/minds/engine/-/blob/master/Core/Security/Block/Repository.php) class handles the communication with the data store. This interface should only be consumed via the Manager.

### Caching

The entire list of blocked channels is fetched and cached both locally and in Redis. As we cache this locally, only one requests is ever made to Redis. Redis will hold the list for 24 hours.
