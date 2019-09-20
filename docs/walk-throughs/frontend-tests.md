---
id: frontend-tests
title: Frontend tests
---

This guide covers how to create and run spec tests in the frontend.

## Testing frameworks

Minds uses [Cypress](https://www.cypress.io/) for e2e testing.

We also have legacy tests that use [Jasmine](https://jasmine.github.io) and [Karma](https://karma-runner.github.io/latest/index.html).

## Create a new test

> TODO: Brian

### Select with data attributes, not classes

This is Cypress' best practice for finding testable attributes in the DOM, since using HTML selectors to find positions in the DOM is both brittle and flakey. So wherever you see `data-name-of-component`, you'll know it's e2e related.

For example, to add data attributes to our `minds-activity` objects:

```html
[attr.data-minds-activity-guid]="activity.guid"
```

### Running tests

To run Cypress tests:

> TODO

To run Jasmine/Karma tests:

```console
ng test
```
