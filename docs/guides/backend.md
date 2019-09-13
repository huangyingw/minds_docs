---
id: backend
title: Backend
---

_This guide assumes that you have already [installed your stack](getting-started/installation.md)_.

The source code can be found at the [Engine repository](https://gitlab.com/minds/engine).

## Structure

The backend is split into two main areas, **Core** and **Controllers**.

**Core** is where all the heavy lifting modules and internal apis exist.

**Controllers** support both _CLI_ and _REST_ api's. These are publicly exposed, as are the public interfaces for the **Core** modules and managers.

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

### Abstraction design

Minds follows an abstraction design pattern - by separating complex processes into standalone chunks with singular responsibilities, it's easier to conduct tests and update infrastructure.

## Modules

To illustrate how modules work, we're going to create a VideoChat module that makes use of dependency injection providers.

Our completed module will look something like this:
![Module diagram](assets/engine-module-diagram.png 'Diagram of an example VideoChat module')
[Click to enlarge](assets/engine-module-diagram.png)

### Module building blocks

#### The Model

`Core/VideoChat/VideoChat.php`

- The characteristics that define a single unit of whatever content your module is going to handle (e.g. a single video chat might include an array of _participantGuids, startTimestamp, endTimestamp_, etc.
- You'll want to `use Minds\Traits\MagicAttributes` so you can automatically use _get, set, and is_ methods on each of your model's properties
- If you'll be using an api endpoint to interact with the frontend, include a `public function export() {...}` here so it can be picked up by your controller's `Factory::exportable()` function, which transforms arrays into an exportable format
- May include functions for calculated fields (e.g. `getUrn()`)

#### The Manager

`Core/VideoChat/Manager.php`

- Interfaces with the repository
- Hydrate the entities returned in the response here (if needed)
- Functions might include `get()`, `getList()`, `add()`, `update()`, `delete()`
- A given function might query the repository, hydrate entity guids that are returned in the response, and call delegates

```php
<?php
namespace Minds\Core\VideoChat;

class Manager
{
    /** @var Repository $repository */
    private $repository;

    /** @var NotificationDelegate $notificationDelegate */
    private $notificationDelegate;

    public function __construct($repository = null, $notificationDelegate = null)
    {
        $this->repository = $repository ?: Di::_('Repository');
        $this->notificationDelegate = $notificationDelegate ?: new Delegates/NotificationDelegate;
    }

    /**
     * Add a model
     * @param Model $model
     * @return void
     */
    public function add(Model $model)
    {
        $this->repository->add($model);
        $this->notificationDelegate->onAdd($model);
    }
```

_Note how we are able to switch out repositories here without impacting the wider codebase by interacting with our Manager. During migrations, a double writing pattern could be added with a few lines._

#### The Repository

`Core/VideoChat/Repository.php`

- Interfaces with the database.
- Should **only ever** be referenced by its _Manager_. This single point of contact is essential because it makes it easy to replace legacy databases with new ones that are more suitable for our needs
- Should `use Minds\Common\Repository\Response`
- Functions might include `get()`, `getList()`, `add()`, `update()`, `delete()`

```php
<?php
class Repository
{
    /** @var Client $db */
    private $db

    public function __construct($db = null)
    {
        $this->db = $db ?: Di::_()->get('Database\Cassandra\Cql');
    }

    public function add(Model $model)
    {
        ...
    }
...
```

#### The Provider

`Core/VideoChat/Provider.php`

- Defines a function that registers your _Manager_ to make it available for dependency injection

```php
<?php
namespace Minds\Core\VideoChat;

use Minds\Core\Di\Provider as DiProvider;

class Provider extends DiProvider
{
    public function register()
    {
        $this->di->bind('VideoChat\Manager', function ($di) {
            return new Manager();
        }, ['useFactory' => true]);
    }
}
```

#### The Module

`Core/VideoChat/Module.php`

- Creates an instance of your _Provider_ and calls its `register()` function.

```php
<?php
namespace Minds\Core\VideoChat;

use Minds\Interfaces\ModuleInterface;

class Module implements ModuleInterface
{

    public function onInit()
    {
        $provider = new Provider();
        $provider->register();
    }

}
```

- Modules must be registered in [Core/Minds.php](https://gitlab.com/minds/engine/blob/master/Core/Minds.php):

```php
private $modules = [
   ...
    VideoChat\Module::class,
];
```

#### Delegates

`Core/VideoChat/Delegates/NotificationDelegate.php`

_You can give your delegate any name you wish, we are using NotificationDelegate as an example_

- Use delegates to keep the _Manager_ clean. Delegates should be used to execute small, stateless outbound functions that don't return values that need further processing. (If this doesn't happen in your module, you don't need to use delegates)

```php
<?php
class NotificationDelegate
{
    public function onAdd(Model $model)
    {
        ...
    }
...
```

#### Testing your module

Managers, Repositories and Delegates should have 100% [spec test](#spec-tests) coverage.

## Events

There are two types of events handling in the backend:

- **Internal events dispatcher** - when you want to do something inside the same thread
- **Event queue** - go to the background and do something at another time

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

Specs are highly abstracted alter-egos of your _Manager_, _Repository_ and _Delegate_ files that allow you to focus on the bare-bones concepts of what those files will eventually do when they reach their final form (so you can plan effectively before tackling practical technicalities and specifics).

Make sure you include `@package Minds\Core\<<VideoChat>>` in `<<VideoChat>>.php` so it can be picked up by phpspec in `<<VideoChatSpec>>.php`.

### Executing

To run all tests:

```console
bin/phpspec run
```

To run a specific spec file (or folder), add its name:

```console
bin/phpspec run Spec/Core/VideoChats/Repository.php
```

To run a specific test inside of that spec file, add its starting line number:

```console
  bin/phpspec run Spec/Core/VideoChats/Repository.php:42
```

### Verbose output

Running this command will give you deep output of the tests:

```console
bin\phpspec run -vvv
```

### Writing new tests

#### Creating a Spec.php file

Run this command to create a test skeleton in the appropriate place with the default classes imported:

```console
bin/phpspec run Minds/Your/Namespace/ClassYouWantToSpec
```

This will create a folder in `minds/engine/`.

#### Mock everything

There's a lot going on under the hood in the modules, some of them have low level connectivity to the data stores. If you don't own the object, mock it. Phpspec Prophecy makes it really easy.

Inside your unit test, be sure to import the class you want to mock.

#### Mocking at the test class level

Phpspec provides a `let()` function that gets run before each test. If you provide a typed parameter, it will be mocked to the matching namespace.

```php
use PhpSpec\ObjectBehavior;
use Minds\Entities\Entity;

class ManagerSpec extends ObjectBehavior {
    protected $entity;

    let(Entity $entity) {
        //Store a reference to the mock for reuse.
        $this->entity = $entity
    }
}
```

#### Mocking at the test function level

Phpspec will provide mocks via function parameters in your test:

```php
use PhpSpec\ObjectBehavior;
use Minds\Entities\Entity;

class ManagerSpec extends ObjectBehavior {

    public function it_should_run_test(Entity $entity) {

    }
}
```

#### Setting expectations

These mockable objects can then configure to simulate what will happen with special functions available on the mock.

`ShouldBeCalled()` will set the expectation that mocked method should be called with a parameter:

```php
$entity->setGuid(123)->shouldBeCalled();
```

`willReturn()` simulates the response of a mocked method:

```php
$entity->setGuid(123)->willReturn($entity);
```

#### Getting to the underlying object

Sometimes, php will choke on the reflection of these mocked objects (especially when constructing other objects).

```php
//This will instantiate an object and still be mockable.
$mockedObject->getList()->willReturn([]);
$service = new ServiceThatNeedsDependencies($mockedObject->getWrappedObject());
```

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

Or, for top feeds you could use:

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
- See the [infinite-scroll walk-through](../walk-throughs/infinite-scroll.md)

```php
use Minds\Core\Di\Di;

...

$this->client = $client ?: Di::_()->get('Database\Cassandra\Cql');
```

### Elasticsearch

Although we store almost all of our important data in Cassandra, we alse use Elasticsearch because it is better at querying/reading data than Casssandra. Besides metrics, everything in Elasticsearch - inlcuding the newsfeed and top feed = is ephemeral.

See [Feeds/Repository.php](https://gitlab.com/minds/engine/blob/master/Core/Feeds/Repository.php) for an example that includes dual writing to both Cassandra and Elasticsearch.

### Caching with Redis

Minds uses Redis to cache certain types of data (e.g. channel subscriber counts) so we can access them in a lightweight, straightforward way without repeatedly performing complicated database queries.

The cache should be cleared whenever the data changes (e.g. a channel gets a new subscriber).

See [Redis.php](https://gitlab.com/minds/engine/blob/master/Core/Data/cache/Redis.php) for the cacher, and [Comments.php](https://gitlab.com/minds/engine/blob/master/Core/Comments/Delegates/CountCache.php) for an example.

## Errors & Exceptions

> Currently being reworked

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

Uniform Resource Names (urns) include _type_ information, which adds additional data into GUIDs/UUIDs and helps for indexing. Urns can be packed with multiple parts, each separated by a ":". Because they aren't limited like a single GUID/UUID, they can be used to neatly convey various types of information, including nesting contexts (which is helpful for comment threads - see [Comment.php](https://gitlab.com/minds/engine/blob/master/Core/Comments/Comment.php) for more).

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
