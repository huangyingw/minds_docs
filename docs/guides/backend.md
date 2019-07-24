---
id: backend
title: Backend
---

> This guide assumes that you have already installed your stack as described [here](getting-started/installation.md)

The source code can be found [here](https://gitlab.com/minds/engine).

# Structure
The backend is split into two main areas, **Core** and **Controllers**.

**Core** is where all the heavy lifting modules and internal apis exist.

**Controllers** support both *CLI* and *REST* api's. These are publically exposed as are the public interfaces for the **Core** modules/managers.

>TODO Other areas include: 
* Common, TODO
* Traits, TODO

```
engine
└───[Core](#core)
│   │   
│
└───[Controllers](#controllers)
│   └───[Cli](#cli)
│   │   └───
│   └───[api](#api)
│   │   └───v1
│   │   └───v2
│
└───Common
│
└───Traits  
```

# Core

## Abstraction design

Minds follows an abstraction design pattern - by separating complex processes into standalone chunks with singular responsibilities, it's easier to conduct tests and update infrastructure.

## Modules

Modules reside under the `Core` folder and must be registered in `Core\Minds.php`

> TODO explain: we're going to use video chat as an example, define video chat [#creating-a-module]

> TODO add diagram here
![Module diagram](/assets/engine-module-diagram.png "Diagram of an example VideoChat module")


### Module building blocks

#### Essential building blocks:
__**The Model**__ (e.g. `VideoChat.php`)
  * the characteristics that define a single unit of whatever content your module is going to handle (e.g. a single video chat)
  * you'll want to `use Minds\Traits\MagicAttributes` so you can automatically use get/set/is methods on each of your model's properties 
  * if you'll be using an api endpoint to interact with the front end, include a `public function export() {...}` here so it can be picked up by your controller's `Factory::exportable()` function, (which transforms arrays into an exportable format)
  * might include methods for calculating fields based on the repository response
    >TO DO: example calculated field

  
__**The Manager**__ (`Manager.php`)
  * interfaces with the repository
  * hydrate the entities returned in the response here (if needed)
    * >TODO include example?


__**The Repository**__ (`Repository.php`)
  * interfaces with the database. Should **only ever** be referenced by its Manager
  * `use Minds\Common\Repository\Response`


__**The Provider**__ (`Provider.php`)
  * defines a function that registers your Manager to make it available for dependency 
  injection


__**The Module**__ (`Module.php`)
  * creates an instance of your Provider and calls its `register()` function. Register your module in `Core\Minds.php`.


#### Optional building blocks: 
__**Delegates**__
* small, stateless functions that are executed by Managers when something happens that has repurcussions elsewhere in the engine. e.g.:
  - `NotificationsDelegate.php` 
  - `EventsDelegate.php`


#### Test first:
Managers, Repositories and Delegates should have 100% [spec test](#spec-tests) coverage. 


### Creating a module

For this example, we will create a module called VideoChat that makes use of Dependency Injection Providers. 

#### Core/VideoChat/Module.php
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
Note how we are able to switch out repositories here without impacting the wider codebase by interacting with our Manager. During migrations, a double writing pattern could be added with a few lines.


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
(You can give your delegate any name you wish, we are using NotificationDelegate as an example). (TODO Describe other common types of responsibilities that are delegated)

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
## Internal apis

### Events

### Entities

### Runners
To start all runners: 
  * `docker-compose up runners`

Runners are resource intensive, so you may wish to run just one, depending on what you're working on. For example:
  * `docker-compose exec php-fpm php /var/www/Minds/engine/cli.php QueueRunner run --runner=NotificationDispatcher`.

## Spec tests
Minds uses [phpspec](https://www.phpspec.net/en/stable/) and encourages test-first development. 

Specs are highly abstracted alter-egos of your Manager, Repository and Delegate files that allow you to focus on the bare-bones concepts of what those files will eventually do when they reach their final form (so you can plan effectively before tackling practical technicalities and specifics).

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
  bin/phpspec run Spec/Core/VideoChats/Repository.php:42`
```

### Verbose output
Runing this command will give you deep output of the testes

```console
bin\phpspec run -vvv 
```

## Writing new tests

### Creating a Spec.php file

Run this command to create a test skeleton in the appropriate place with the default classes imported.

```console
bin/phpspec run Minds/Your/Namespace/ClassYouWantToSpec
```

This will create a folder in *minds/engine/

### Mock everything

There's a lot going on under the hood in the modules, some of them have low level connectivity to the data stores. If you don't own the object, mock it. Prophesy makes it really easy

Phpspec provides easy ways to create mocks.

Inside your unit test, be sure to import the class you want to mock.

### Mocking at the test class level

Phpspec provides a *let* function that gets run before each test. If you provide a typed parameter, it will be mocked to the matching namespace.



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

### Mocking at the test function level

Phpspec will provide mocks via function parameters in your test

```php
use PhpSpec\ObjectBehavior;
use Minds\Entities\Entity;

class ManagerSpec extends ObjectBehavior {

    public function it_should_run_test(Entity $entity) {
        
    }
}
```

### Setting Expectations

These mockable objects can then configured to simulate what will happen with special functions available on the mock.

ShouldBeCalled will set the expectation that mocked method should be called with a parameter.
```php
    $entity->setGuid(123)->shouldBeCalled();
```

willReturn simulates the response of a mocked method
```php
    $entity->setGuid(123)->willReturn($entity);
```

### Getting to the underlying object

Sometimes, php will choke on the reflection of these mocked objects (especially when constructing other objects). 

```php
    //This will instantiate an object and still be mockable.
    $mockedObject->getList()->willReturn([]);
    $service = new ServiceThatNeedsDependencies($mockedObject->getWrappedObject());
```


# Controllers
> TODO

## Cli 
> TODO

## api
> TODO

* `pages[0]` refers to the parameters that are sometimes added to the end of an api call 
