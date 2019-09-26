---
id: frontend
title: Frontend
---

_This guide assumes that you have already [installed your stack](getting-started/installation.md)_.

Minds uses [Angular 8](https://angular.io) for the frontend. Work is currently underway to introduce server side rendering with Angular Universal.

The source code can be found in the [Front repository](https://gitlab.com/minds/front).

## Building

### Development

```console
npm run build-dev
```

Keep this running while you are working so your changes will automatically be reflected when you refresh your browser.

Note: this doesn't apply to stylesheet changes - so when you're working with .scss files, you'll need to run `gulp build.sass` before you'll be able to see those changes.

### Production

_Production build can take up 30 minutes to complete_

`gulp build.sass && sh build/base-locale.sh dist`

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

### Common

In most cases, new code will be stored inside subject-specific module folders. However, if you are making something that will be used throughout the site, put it in the `common/` folder so it can be easily accessed from other modules. Some examples of the kind of things that belong in `common/`:

- **Directives**: user profile hovercard, tooltips, things related to Material design lite (slider, switch, date time picker), etc.
- **Pipes**: TODO
- **Services**: TODO

## Naming conventions

### Component files

Components should have `.ts`, `.html` and `.scss` files with the same names.

Eg:

```
my-cool-module
└───list.component.ts
└───list.component.html
└───list.component.scss
```

### Elements and classes

Minds follows the [BEM](http://getbem.com/naming/) naming conventions for elements and class names, with the `m-` prefix. For example:

```html
<m-juryDutySession__content>
  ...
</m-juryDutySession__content>
```

```html
<div class="m-comment__ownerBlock m-comment__ownerBlock--disabled">
  <div class="m-commentOwnerBlock__name"></div>
</div>
```

If you need to add a new class to an older file that has not yet been updated to use BEM conventions, add the new class twice: once with BEM, and again with whatever legacy convention the file is currently using.

## Linting

Minds uses [Prettier](https://prettier.io/) to enforce consistent formatting in frontend code.

Before you push your MR, run:

```console
prettier --write "src/**/*.{scss,ts,html}"
```

(or, if possible, download a Prettier plug-in for your code editor and tell it to automatically format the code on save). Defaults are configured in `.prettierrc`.

## Spec tests

We test our code to prevent software defects and verify that it behaves as we expect it to.

> See the [frontend tests walk-through](../walk-throughs/frontend-tests) for information on writing and running tests

## Styles

### Themes

A preset color palette and theme maps are defined in [themes.scss](https://gitlab.com/minds/front/blob/master/src/stylesheets/themes.scss). The palette contains a range of greys, blue-greys, accent colors, black, white, etc.

When styling a new component, select colors that are for light theme only. Dark theme inversions will be automatically applied according to the theme map.

#### Usage

_All_ colors should be defined using the `m-theme` mixin:

```scss
.m-comment__container {
  @include m-theme() {
    border: 1px solid themed($m-grey-50);
    background-color: rgba(themed($m-blue-grey-200), 0.5);
    box-shadow: 1px 1px 4px rgba(themed($m-black-always), 0.2);
  }
  &.m-comment__container--active {
    font-weight: bold;
    @include m-theme() {
      color: themed($m-green);
    }
  }
}
```

If something is black or white and you want it to _not_ change when the theme is changed (e.g. you want an overlay modal background to always be black, regardless of theme), use `$m-black-always` or `$m-white-always`.
