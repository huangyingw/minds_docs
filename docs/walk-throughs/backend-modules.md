---
id: backend-modules
title: Backend modules
---

To illustrate how modules work, we're going to create a VideoChat module that makes use of dependency injection providers.

Our completed module will look something like this:
![Module diagram](assets/engine-module-diagram.png 'Diagram of an example VideoChat module')
[Click to enlarge](assets/engine-module-diagram.png)

## Module building blocks

### The Model

`Core/VideoChat/VideoChat.php`

- The characteristics that define a single unit of whatever content your module is going to handle (e.g. a single video chat might include an array of _participantGuids, startTimestamp, endTimestamp_, etc.
- You'll want to `use Minds\Traits\MagicAttributes` so you can automatically use `get`, `set`, and `is` methods on each of your model's properties
- If you'll be using an api endpoint to interact with the frontend, include a `public function export() {...}` here so it can be picked up by your controller's `Factory::exportable()` function, which transforms arrays into an exportable format
- May include functions for calculated fields, e.g. `getUrn()`

### The Manager

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

### The Repository

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

### The Provider

`Core/VideoChat/Provider.php`

Defines a function that registers your _Manager_ to make it available for dependency injection.

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

### The Module

`Core/VideoChat/Module.php`

Creates an instance of your _Provider_ and calls its `register()` function.

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

Modules must be registered in [Core/Minds.php](https://gitlab.com/minds/engine/blob/master/Core/Minds.php):

```php
private $modules = [
   ...
    VideoChat\Module::class,
];
```

### Delegates

`Core/VideoChat/Delegates/NotificationDelegate.php`

- Used to keep the _Manager_ clean
- Should be used to execute small, stateless outbound functions that don't return values that need further processing. (If this doesn't happen in your module, you don't need to use delegates)
- You can use any name you wish, we are using _NotificationDelegate_ as an example

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

### Tests

_Managers_, _Repositories_ and _Delegates_ should have 100% [spec test](./backend-tests) coverage.

Make sure you include `@package Minds\Core\VideoChat` in `VideoChat.php` so it can be picked up by [phpspec](https://www.phpspec.net/en/stable/) in `VideoChatSpec.php`.
