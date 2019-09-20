---
id: backend-tests
title: Backend tests
---

This guide covers how to create and run [phpspec](https://www.phpspec.net/en/stable/) spec tests in the backend.

Specs are highly abstracted alter-egos of your _Manager_, _Repository_ and _Delegate_ files (see the [backend modules walk-through](./backend-modules) for more about those files) that allow you to focus on the bare-bones concepts of what those files will eventually do when they reach their final form (so you can plan effectively before tackling practical technicalities and specifics).

## Create a new test

To create a new test:

```console
bin/phpspec run Minds/Your/Namespace/ClassYouWantToSpec
```

This will create a folder in `minds/engine/` with a skeleton `ClassYouWantToSpecSpec.php` file and automatically import the default classes.

### Mock everything

_If you don't own the object, mock it._

There's a lot going on under the hood in the modules, and some of them have low level connectivity to the data stores.

Thankfully, phpspec Prophecy makes it really easy to mock - just be sure to import the class you want to mock inside your unit test.

#### Mock classes

Phpspec's `let()` function gets run before each test. If you provide a typed parameter, it will be mocked to the matching namespace.

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

#### Mock functions

Phpspec will provide mocks via function parameters in your test:

```php
use PhpSpec\ObjectBehavior;
use Minds\Entities\Entity;

class ManagerSpec extends ObjectBehavior {

    public function it_should_run_test(Entity $entity) {

    }
}
```

### Set expectations

These mockable objects can then configure to simulate what will happen with special functions available on the mock.

`ShouldBeCalled()` will set the expectation that mocked method should be called with a parameter:

```php
$entity->setGuid(123)->shouldBeCalled();
```

`willReturn()` simulates the response of a mocked method:

```php
$entity->setGuid(123)->willReturn($entity);
```

### Access the underlying object

Sometimes, php will choke on the reflection of these mocked objects (especially when constructing other objects).

To instantiate an object and still be mockable:

```php
$mockedObject->getList()->willReturn([]);
$service = new ServiceThatNeedsDependencies($mockedObject->getWrappedObject());
```

## Running tests

To execute all tests:

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
