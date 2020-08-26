---
id: backend
title: Backend
---

_This guide assumes that you have already [installed your stack](getting-started/installation.md)_.

The source code can be found at the [Engine repository](https://gitlab.com/minds/engine).

## Structure

Minds follows an abstraction design pattern - by separating complex processes into standalone chunks with singular responsibilities, it's easier to conduct tests and update infrastructure.

The backend is split into two main areas, **Core** and **Controllers**:

- **Core** is where all the heavy lifting [modules](../walk-throughs/backend-modules) and internal apis exist.
- **Controllers** support both _CLI_ and _REST_ api's. These are publicly exposed, as are the public interfaces for the **Core** modules and managers.

```
engine
└───Core
│   │
│
└───Controllers
│   └───Cli
│   │   └───
│   └───api
│   │   └───v1
│   │   └───v2
│
└───Common
│
└───...
```

> See the [backend modules walk-through](../walk-throughs/backend-modules) for detailed information about how to build a core module

## Events

> TODO: Add examples of how each type is used

There are two types of events handling in the backend:

- **Internal events dispatcher** - when you want to do something inside the same thread
- **Event queue** - when it's ok for the process to go to the background and do something at another time

## Runners

The [Core/Queue/Runners/](https://gitlab.com/minds/engine/blob/master/Core/Queue/Runners) folder contains the things that use runners, such as notifications, emails, and feeds. See [NotificationDispatcher.php](https://gitlab.com/minds/engine/blob/master/Queue/Runners/NotificationDispatcher.php) for an example of how the notification runner works.

To start all runners:

```console
docker-compose up runners
```

Runners are resource intensive, so you may wish to run just one, depending on what you're working on. For example, if you're testing a new notification, run:

```console
docker-compose exec php-fpm php /var/www/Minds/engine/cli.php QueueRunner run --runner=NotificationDispatcher
```

## Spec tests

Minds uses [phpspec](https://www.phpspec.net/en/stable/) and encourages test-first development.

> See the [backend tests walk-through](../../walk-throughs/backend-tests) for detailed info on writing and running tests

## Controllers

### CLI

Available commands are stored in the [Controllers/Cli/](https://gitlab.com/minds/engine/blob/master/Controllers/Cli) folder.

To execute, use this syntax:

```console
run php cli {CliClassName} {functionName}
```

So, for [Controllers/Cli/QueueRunner.php](https://gitlab.com/minds/engine/blob/master/Controllers/Cli/QueueRunner.php), you would use:

```console
run php cli QueueRunner run --runner=NotificationDispatcher
```

Or, for top feeds at [Controllers/Cli/Top.php](https://gitlab.com/minds/engine/blob/master/Controllers/Cli/Top.php) you could use:

```console
run php cli Top sync_activity
```

- file called CLI (in engine) php-CLI
- how to set them up and run them - then the name of the cli class name (under controller/cli) then you can just execute them as functions
  - e.g cli.php.top sync_activity // rewards_issue(username)

### api

- Newer apis are in [Controllers/api/v2](https://gitlab.com/minds/engine/blob/master/Controllers/api/v2), and older ones are in (you guessed it)
  [Controllers/api/v1](https://gitlab.com/minds/engine/blob/master/Controllers/api/v1)
- `pages[0]` refers to the parameters that are sometimes added to the end of an api call

## Interacting with databases

### Cassandra

- Most of our data is stored in Cassandra - but we also dual write some things to Elasticsearch because querying/reading in Cassandra can be restrictive and cumbersome.
- All communication with Cassandra should go through a _Repository_ as described in the [module diagram](##Modules).

```php
use Minds\Core\Di\Di;

...

$this->client = $client ?: Di::_()->get('Database\Cassandra\Cql');
```

> See the [infinite-scroll walk-through](../walk-throughs/infinite-scroll.md) for a sample Cassandra interaction

### Elasticsearch

Although we store almost all of our important data in Cassandra, we alse use Elasticsearch because it is better at querying/reading data than Casssandra. Besides metrics, everything in Elasticsearch - including the newsfeed and top feed - is ephemeral.

See [Feeds/Repository.php](https://gitlab.com/minds/engine/blob/master/Core/Feeds/Repository.php) for an example that includes dual writing to both Cassandra and Elasticsearch.

### Caching with Redis

Minds uses Redis to cache certain types of data (e.g. channel subscriber counts) so we can access them in a lightweight, straightforward way without repeatedly performing complicated database queries.

The cache should be cleared whenever the data changes (e.g. a channel gets a new subscriber).

See [Redis.php](https://gitlab.com/minds/engine/blob/master/Core/Data/cache/Redis.php) for the cacher, and [Comments.php](https://gitlab.com/minds/engine/blob/master/Core/Comments/Delegates/CountCache.php) for an example.

## Errors & Exceptions

> TODO: Currently being reworked

## Utilities

### BigNumber

The Ethereum blockchain (upon which the Minds Token is based) uses 18-digit numbers that are too large to handle in the same way we handle smaller numbers. As a workaround, we use the `BigNumber` utility in [BigNumber.php](https://gitlab.com/minds/engine/blob/master/Core/Util/BigNumber.php), which allows us to specify an especially large number as a string but still use it as a number.

```php
use Minds\Core\Util\BigNumber;

...

$offChainBalanceVal = BigNumber::_($offChainBalance->get());
// or
$amount = (int) BigNumber::_($purchase->getAmount())->div(10 ** 18)->toString();`

```

### Unique identifiers

#### GUIDS

Globally Unique Identifiers (GUIDS) are being phased out. GUIDs are numerical and time-based and were originally used because Cassandra didn't have an autoincrementing ID system.

#### UUIDs

We are moving toward Universally Unique Identifiers (UUIDs) as we move away from GUIDs.

Use UUIDs with Cassandra's UUID library and the [UUIDGenerator](https://gitlab.com/minds/engine/blob/master/Core/Util/UUIDGenerator.php).

```php
use Cassandra\Uuid;
use Minds\Core\Util\UUIDGenerator;

...

$uuid = $entity->getUuid() ?: Core\Util\UUIDGenerator::generate();
$values = [
  new Uuid($uuid),
  ...
];
```

See [Notification/CassandraRepository.php](https://gitlab.com/minds/engine/blob/master/Core/Notification/CassandraRepository.php) for an example.

UUIDs can be version-2 (time-based) or version-4 (random). We generally use version-2 but have the option to use version-4 in scenarios where we are handling sensitive information that shouldn't be associated with creation time.

#### URNs

Uniform Resource Names (urns) include _type_ information, which adds additional data into GUIDs/UUIDs and helps for indexing. Urns can be packed with multiple parts, each separated by a colon. Because they aren't limited like a single GUID/UUID, they can be used to neatly convey various types of information, including nesting contexts (which is helpful for comment threads - see [Comment.php](https://gitlab.com/minds/engine/blob/master/Core/Comments/Comment.php) for more).

To create a new urn:

```php
use Minds\Common\Urn;

...

$this->urn = $urn ?: new Urn;
```

To get an urn:

```php
// Simple example: group
public function getUrn()
{
    return "urn:group:{$this->guid}";
}
```

```php
// Multi-part example: jury report
public function getUrn()
{
    $parts = [
        "({$this->getEntityUrn()})",
        $this->getReasonCode(),
        $this->getSubReasonCode(),
        $this->getTimestamp(),
    ];
    return "urn:report:" . implode('-', $parts);
}
```

### Cookies

To generate a cookie, `use Minds\Common\Cookie`. See [Cookie.php](https://gitlab.com/minds/engine/blob/master/Common/Cookie.php) for details.

See [pageview.php](engine/Controllers/api/v2/analytics/pageview.php) for an example that sets the Minds mwa cookie.
Also see [Controllers/api/v2/cookies.php](https://gitlab.com/minds/engine/blob/master/Controllers/api/v2/cookies.php).

## Authentication

Two types of authentication:

1. Session cookies
2. OAuth (used on mobile)

To protect our apis from being used in Cross-Site Request Forgery (CSRF/XSRF) attacks, we leverage the [Same-Origin Policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy), which states that browsers may only perform certain sensitive operations (such as reading cookies and setting headers) by code running on _our_ website, not another website.

So we store a unique `XSRF-TOKEN` cookie for every logged-in user session. When the application wants to make a request, it has to send a custom HTTP header along with the token. Because Minds is the only domain that can set the header or access the cookie, we know that the request is coming from Minds.com.

### Access the current active user

In the backend, use [Session.php](https://gitlab.com/minds/engine/blob/master/Core/Session.php) to get the current active user:

```php
Core\Session::getLoggedinUser();
```

In the frontend, import the `Session` service and:

```ts
const user = this.session.getLoggedInUser();
```

## System logs

```console
docker-compose logs -f php-fpm
```

## Working with the newsfeed

We load in 150 items in a feed then hydrate them on the client side. Why? Because we can't maintain the pagination indexes for dynamic feeds (such as top feeds, which change depending on user votes) on the server side. It also allows caching on the client side, which means faster load times.
