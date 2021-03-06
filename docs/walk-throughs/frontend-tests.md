---
id: frontend-tests
title: Frontend tests
---

This guide covers how to create and run tests for the frontend. Minds uses [Cypress](https://www.cypress.io/) for E2E testing and [Jasmine](https://jasmine.github.io) / [Karma](https://karma-runner.github.io/latest/index.html) for unit tests.

# Cypress
## Installation
To install Cypress for E2E testing, clone [our cypress tests repository](https://gitlab.com/minds/cypress-tests).

```
// ssh
git clone git@gitlab.com:minds/cypress-tests.git

// or http
git clone https://gitlab.com/minds/cypress-tests.git
```

From there, install the dependencies with npm.

```js
npm install
```
## Create a new test
If you are making a single new test file, make a file `new-feature.spec.js` in the `integration` directory. If you are making multiple related tests, put them in an appropriately named sub-directory.
To scaffold your test, you can copy an existing files body and strip out the innards, or copy the below boilerplate and change the context identifier.

```js
context('New Feature', () => {
  beforeEach(() => {
    // logic to run before each test.
  });

  before(() => {
    // logic to run before all tests.
  });

  afterEach(() => {
    // logic to run after each test - usually reseting state.
  });

  after(() => {
    // logic to run after all tests - usually cleanup.
  });

  it('should have a descriptive test name', () => {
    // individual test.
  });
});
```


## Running Cypress

To run Cypress Tests, you can either manually fill out the cypress command with the environmental variables, or use our e2e.sh script, that can be used like so:

```console
// Assuming default user minds_cypress_tests exists and the stack is running on port 80.
cypress/e2e.sh -p [Password]

// Provide the host 
cypress/e2e.sh -h http://localhost:8080 -p [Password]

// Provide your own username and password.
// Make sure to escape any special characters in the password.
cypress/e2e.sh -u [Username] -p [Password]

// For additional information and parameters.
cypress/e2e.sh --help
```

To run tests that require captcha completion, you must also pass in the shared_key parameter - this key must match the one found in your settings.php

```php
// settings.php
$CONFIG->set('captcha', [
    'jwt_secret' => 'xyz',
    'bypass_key' => 'xyz',
]);
```

```console
cypress/e2e.sh -u [Username] -p [Password] -sk xyz
```

New tests & changes **must** be tested **against production and sandbox**; thankfully it is easy to specify different hosts like so:

```console
cypress/e2e.sh -h http://localhost:8080 -p [Password]
cypress/e2e.sh -h https://www.minds.com/ -p [Password]
cypress/e2e.sh -h http://my-sandbox.minds.io -p [Password]
```

From there, you can hit Run All, and watch Cypress run against your host.


## Pushing new tests to sandbox domains
As our cypress tests are in a separate repository to front-end, you will need to make a separate merge request for any changes to tests. The **branch name** for this merge request **MUST MATCH** the branch name for your front-end. This is because when running our front-end CI jobs, we check whether our E2E repo has a matching branch - if it does, we run those tests instead of the tests on master.

## Cypress best practices
Cypress allows you freedom to do things in many ways, but it is important to understand the best practices, or your tests will likely be brittle.
We strongly recommend reading [Cypress' Best Practices](https://docs.cypress.io/guides/references/best-practices.html), which is a fantastic resource.


### Select with data attributes, not classes
This is Cypress' **best practice** for **finding testable attributes in the DOM**, since using HTML selectors to find positions in the DOM is both brittle and flakey. So wherever you see `data-minds`, you'll know it's e2e related.

For example, to add data attributes to our `minds-activity` objects:

```html
[attr.data-minds]="'activityGuid--' + activity.guid"
```

This can then be called like so:

```javascript
  const activity = '[data-minds=activityGuid--998750271110176768]';
  cy.get(activity);
```

### Don't use timeouts for time intervals
Setting a `cy.wait(1000)` may seem like the quickest way to make a test pass, but if the server has a hiccup, your test will flake. Best practice is to await requests like below.
Using intervals should be reserved for special circumstances, such as waiting for an animation to complete.

```javascript
  cy.server();
  cy.route('POST', '**/api/v1/blog/new').as('postBlog');
  cy.get('.m-button--submit')
    .click()
    .wait('@postBlog').then(xhr => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.equal('success');
    });
```

### Try to avoid 'nth-child' selections
It can be tempting to reach for the nth-child selectors when something is not easily identifiable by its CSS class.
This however should be avoided where possible, as it results in brittle tests.

Most of the time, the best option is going to be to use a data-attribute. If its possible, it's likely going to be the best and most robust way.

Other times the element you want is in a dynamic list, for example, you may want to grab a specific post from the Newsfeed. To get it, we can instead use:

```javascript
  const postText = 'Post text!';
  cy.contains(postText);
```

To grab the posts text. If we need to traverse the DOM from the element you have grabbed (such as if we want to hit the like button), we can chain using [parentsUntil()](https://docs.cypress.io/api/commands/parentsuntil.html) and [children()]([parentsUntil()](https://docs.cypress.io/api/commands/children.html)).

```javascript
  const postText = 'Post text!';
  cy.contains(postText)
    .parentsUntil('m-newsfeed__entity')
    .children()
    .contains('Like Button')
```

### Test Stretching & Flake Prevention

Before commiting tests, ideally you should stretch your tests to make sure that they are durable enough to withstand the pipelines.
To save you from having to manually re-run a test 100 times to do this, you can simply use:

```javascript
Cypress._.times(100, (i) => {
    it('should do foo', () => {
    
    });

    it('should do bar', () => {
    
    });
});
```

# Running Jasmine/Karma Tests
To run Jasmine/Karma tests:

```console
ng test
```

If ChromeHeadless is installed on your system, you can run the tests quicker, by running:

```console
ng test --browsers ChromeHeadless
```
