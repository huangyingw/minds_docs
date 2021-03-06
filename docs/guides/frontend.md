---
id: frontend
title: Frontend
---

_This guide assumes that you have already [installed your stack](getting-started/installation.md)_.

Minds uses [Angular 8](https://angular.io) for the frontend, with support for Server Side Rendering.

The source code can be found in the [Front repository](https://gitlab.com/minds/front).

## Building

### Development

```console
NODE_OPTIONS=--max_old_space_size=4096 npm run serve:dev
```

Keep this running while you are working so your changes will automatically be reflected when you refresh your browser.

Note: this doesn't apply to stylesheet changes - so when you're working with .scss files, you'll need to run `npm run prebuild` before you'll be able to see those changes.

_Development mode will run without SSR enabled_

> You can run the frontend end without the backend bloat by running
>
> 1. `export NODE_OPTIONS=--max_old_space_size=4096 ENGINE_SECURE=1 ENGINE_HOST=www.minds.com ENGINE_PORT=443`
> 2. `npm run serve:dev`

### Production

_Production build can take up 30 minutes to complete_

The production environment uses Server Side Rendering. See the [SSR](#ssr) section below to see best practices.

`npm run build:ssr`

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

### Wildcard selectors

You may wish to use attribute wildcard selectors to select multiple elements that share an attribute value or a portion of a class name in your stylesheets.

```html
<div class="m-myClassname__foo">Foo!</div>
<span class="m-myClassname__bar">Bar!</span>
```

```scss
// this selects both of the elements above
[class*="m-myClassname"] {
  font-weight: bold;
}
```

When using wildcards for class names, make sure you only use the `*=` selector (which matches any part of the string) and do not use `^=` or `$=` (which select the beginning and end of strings, respectively), as this can cause problems when angular dynamically adds and removes classes.

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

### Z-index

We use two tiers of z-index systems:

#### 1) GLOBAL
_Used for components whose layers are adjacent to and/or interact with many other structural items that exist outside the component itself (**e.g. navigation, topbar, modals, tooltips**)_ 


  - Example usage: 
```scss
.m-announcement {
       @include z-index(announcement);
       position: absolute;
 }
```
  - Map items, values, definitions and detailed guidance for global z-index are located in the `z-index.scss` file. 
  - Most of the global structural layers are already be defined and only rarely should the z-index map be changed.


#### 2) **LOCAL** 
_Used for defining layers that interact within a component. (**e.g. the fade out overlay in the read-more component, a floating close button within an overlay modal**)_
  - Local z-index layers are defined within the given component's scss file. 
  - Start by creating a new stacking context on your component's host element or one of its children. A new stacking context means that all of the z-index values within your component will relate only to one another, not to the rest of the components that might be on the page at the same time. **Be aware that the local context will override global z-index values of child components**, so try to keep a narrow scope by creating the new stacking context on the most nested element possible. 
  - To create a new stacking context:
    - 1: Define a z-index. Keep it as low as possible (no higher than 10). For example, `z-index: 1`.
    - 2: Define an attribute that creates a stacking context. Technically, there are [several different attributes](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context) that can be used to create a new stacking context, but for clarity and sanity, we will use `position: relative` OR any other position value besides `static`.  If you _must_ use static positioning, you may use one of the alternative attributes (e.g. `transform: translateZ(0)` or `opacity: .99`), but be sure leave a comment nearby so other developers know what's going on. 


## SSR

### 101 Guide

#### Bypassing on the server side

```ts
import { Inject, PLATFORM_ID } from '@angular/core';}
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

...
constructor(
  @Inject(PLATFORM_ID) protected platformId: Object,
) {}

ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    // only executed on the browser side
  }
  if (isPlatformServer(this.platformId)) {
    // only executed on the server side
  }
}

```

```html
<ng-container *mIfBrowser>
  Load me only on the browser
</ng-container>
```

#### The browser will rehydrate when loaded

Even though the server renders the current page, everything is reloaded once the browser is initialized. This should be a mostly blind process and not noticable, however it should be noted that all functions that were called on the server side will be executed again on the browser side.

For example, `ngOnInit` will be run on the server side request and again on the browser side too. Multiple data requests can be avoided by making use of the transfer state tools, which are automatically handled via Angulars HTTP services.

#### Don't use timers on the server side

Timer functions such as `setTimeout`, `setInterval` and RXJS tools like `timer` should be avoided on the server side as they need to resolve before the server will fully render. These functions should be wrapped in `isPlatformBrowser` wrappers (see above).

#### Don't use the window or document variables

The server has no concept of the DOM, so only Angulars available interfaces should be used. `window.` is never acceptable. `window.Minds` has been removed and replaced with the `ConfigsService` service.

#### Getting a configuration variable

```ts
import { ConfigsService } from './common/services/configs.service';

...
readonly siteUrl: string;
constructor(configs: ConfigsService) {
  this.siteUrl = configs.get('site_url');
}
```

#### GET requests are transferred to the browser

`client.get()` calls will be transferred to the browser to prevent duplicate calls to endpoints.

#### Only load server side what we need

Just because we can render server side, doesn't mean everything needs to be. We should target to render the minimum amount of data possible and aim for the lowest possible page latency achievable.

For example, do not render comments for blogs server side, allow for the browser to do this asynchronously.

#### Local storage vs Cookies

The server is not able to read the local storage from the browser. If a shared state is required then the `CookieService` should be used. Sensitive data is prohibited.

## Embed Mode

Minds video player can be embedded into other websites using an `iframe`. The video player is the same player as the one that is used in the App. However, in the embed mode only what is strictly necessary will be included. Anything that needs to be rendered without the wider angular app, should be loaded in the embed mode.

### How it works

This is achieved by creating a new "entrypoint", or in angular terms, a new "project" in `angular.json`, which will enter from `src/app/modules/embed/main.ts` and add any library or module on its way in a bundle separate from the app's bundle stored in `dist/embed`. The app will then be served with `server.ts`, and the bundles and static files will be served with NGINX with the `/embed-static` alias.

### How to build/run/test

#### Production

On production, the embed module will be served and server-side-rendered with `server.ts`

1. `npm run build:embed`
2. `minds-ssr-build`
3. `minds-ssr-serve`

#### Developement

On developement, angular can serve the module like this:

`npm run serve:embed:dev`

Now you can see embedded videos in a url like `https://localhost:4200/embed/${VIDEO_GUID}`