---
id: backend
title: Backend
---

> This guide assumes that you have already installed your stack as described [here](getting-started/installation.md)

The source code can be found [here](https://gitlab.com/minds/engine).

## Structure
The backend is split into two main areas, **Core** and **Controllers**.

**Core** is where all the heavy lifting modules and internal apis exist. 

**Controllers** support both *CLI* and *REST* api's. These are publically exposed as are the pulbic interfaces for the **Core** modules/managers.

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
└───Traits  
```

## Modules

Modules reside under the `Core` folder and must be registered in `Core\Minds.php`. 

### Creating your modules

For this example, we will create a module call VideoChat that makes use of Dependency Injection Proviers. 

#### Core/VideoChat/Modules.php
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
#### Core/VideoChat/Provider.php
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
#### Core/VideoChat/Manager.php
```php
<?php
namespace Minds\Core\VideoChat;

class Manager
{

}
```

### Registering your module
```php
private $modules = [
   ...
    VideoChat\Module::class,
];
```


## Manager / Repository / Delegates

Minds follows an abstraction design pattern. Managers should be interface with Repositories. Repositories should **only ever** be referenced by their respective managers. 

Delegates are small, stateless functions that are executed by Managers. 

Managers, Repositories and Delegates should have 100% test coverage.

### Manager.php
```php
<?php
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
Note how we are able to switch out repositories here without impacting the wider codebase to could be interacting with our Manager. During migrations, a double writing pattern could be added with a few lines.


### Repository.php
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
### Delegates/NotificationDelegate.php
(You can give your delegate any name you wish, we are using NotificationDelegate as an example).

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

## Spec tests

### Executing

`bin/phpspec run`