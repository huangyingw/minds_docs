---
id: frontend
title: Frontend
---

> This guide assumes that you have already installed your stack as described [here](getting-started/installation.md)

Minds uses [Angular 8](https://angular.io) for the frontend. Work is currently underway to introduce server side rendering with Angular Universal. 

The source code can be found [here](https://gitlab.com/minds/front). 

## Building

### Development
`npm run build-dev`

### Production

> Production build can take up 30 minutes to complete

```gulp build.sass && sh build/base-locale.sh dist```

## Structure

```
front
└───dist
│   │   (build outputs here)
│
└───src
    └───common
    │   └───
    └───modules
```

## Component names

Minds follows the [BEM](http://getbem.com/naming/) naming conventions for elements and class names, with the `m-` prefix.

eg:
```html
<m-comments__tree>
...
</m-comments__tree>
```
```html
<div class="m-comment__ownerBlock m-comment__ownerBlock--disabled">
    <div class="m-commentOwnerBlock__name">
    </div>
</div>
```

## Components

Components should have `.ts`, `.html` and `.scss` files with the same names.

Eg:
```
my-cool-module
└───list.component.ts
└───list.component.html
└───list.component.scss
```

## Spec tests

### Executing

`ng test`