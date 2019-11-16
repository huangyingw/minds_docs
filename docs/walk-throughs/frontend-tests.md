---
id: frontend-tests
title: Frontend tests
---

This guide covers how to create and run tests for the frontend.

## Testing frameworks

Minds uses [Cypress](https://www.cypress.io/) for e2e testing and [Jasmine](https://jasmine.github.io) / [Karma](https://karma-runner.github.io/latest/index.html) for unit tests.

## Create a new test

> TODO: Brian

## Cypress best practices
Cypress allows you freedom to do things in many ways, but it is important to understand the best practices, or your tests will likely be brittle.
We strongly recommend reading [Cypress' Best Practices](https://docs.cypress.io/guides/references/best-practices.html), which is a fantastic resource.


### Select with data attributes, not classes
This is Cypress' **best practice** for **finding testable attributes in the DOM**, since using HTML selectors to find positions in the DOM is both brittle and flakey. So wherever you see `minds-data-name-of-component`, you'll know it's e2e related.

For example, to add data attributes to our `minds-activity` objects:

```html
[attr.data-minds-activity-guid]="activity.guid"
```

This can then be called like so:

```javascript
  const activity = '[data-minds-activity-guid]';
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

### Running Cypress

To run Cypress Tests, check out the cypress folder. In there is a script, e2e.sh, that can be used like so:

```console
// Assuming default user minds_cypress_tests exists and the stack is running on port 80.
cypress/e2e.sh -p [Password]

// Provide the host 
cypress/e2e.sh -h http://localhost:8080 -p [Password]

// Provide your own username and password.
cypress/e2e.sh -u [Username] -p [Password]

// For additional information and parameters.
cypress/e2e.sh --help
```

New tests & changes **must** be tested **against production and sandbox**; thankfully it is easy to specify different hosts like so:

```console
cypress/e2e.sh -h http://localhost:8080 -p [Password]
cypress/e2e.sh -h https://www.minds.com/ -p [Password]
cypress/e2e.sh -h http://my-sandbox.minds.io -p [Password]
```

From there, you can hit Run All, and watch Cypress run against your host.

# Running Jasmine/Karma Tests
To run Jasmine/Karma tests:

```console
ng test
```

If ChromeHeadless is installed on your system, you can run the tests quicker, by running:

```console
ng test --browsers ChromeHeadless
```
