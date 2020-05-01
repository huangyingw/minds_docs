---
id: feature-flags
title: Feature flags
---

Feature flags allow new features to be introduced to a subset of users (i.e. those in Canary mode) before they are available to all users.

Start by setting up a feature flag and then wrap a "gate" around code that you want to be executed only for applicable users.

## Setting up

### Declare a new feature

First, declare the flag in `Features\Keys` array binding at `engine/Core/Features/Provider.php`. This will automatically make the feature available with a default value of `false`.

```php
$this->di->bind('Features\Keys', function () {
  return [
      // ...
      'my-cool-feature',
      // ...
  ];
});
```

> This is an **IMPORTANT** step because, no matter which service is used later, only the features listed here are going to be available for use.

### Configure

There are 3 available services to configure the flags:
- $CONFIG (settings.php)
- Unleash server (GitLab Feature Flags)
- Environment variables

They will override each other in the order shown above. Per example, a feature flag in GitLab will override the $CONFIG value. A feature flag in an environment variable will override both $CONFIG and GitLab values.


#### $CONFIG

Useful when developing locally a new feature. Values are applied immediately and there's no need to run the sync CLI script.

Just define and enable the flag in `settings.php`:

```php
$CONFIG->set('features', [
    // ...
    'my-cool-feature' => true,
    // ...
]);
```

You can also target a feature to a *single* user group by declaring the value as a string containing the group name.

```php
$CONFIG->set('features', [
    // ...
    'my-cool-feature' => 'canary',
    // ...
]);
```

#### Unleash server

This is used to switch features on production-like environments. Values are applied after the sync CLI script fetches them from the server. Server URL, Instance ID and Application Name can be set on `$CONFIG->set('unleash', ...)` entry in `settings.php`.

Flags can be switched on and off per-environment at https://gitlab.com/minds/infrastructure/feature-flags/-/feature_flags/.

If you're creating a new flag and the functionality is dependant on another feature flag, be sure to mention it in the description.

All GitLab strategies are available. Groups can be referenced using the percent character on the User ID strategy and there can be multiple targets (example: `100000000123, 1000000000999, %canary, %pro`).

*Environment Spec* is matched with the provided `applicationName` value in `settings.php`, fallbacking to `*`.

> Important: If the **BIG** Status switch on GitLab's Feature Flags main page is set to OFF, the feature flag becomes invisible and it's NOT returned by the Unleash server when synchronizing. This makes the fallback to be: `False → $CONFIG → EnvVar`.

#### Environment variables

This will be useful on environments that will run multiple app containers using a single shared database (e.g. review sites), or when there's no access to Unleash. Values are applied immediately and there's no need to run the sync CLI script.

Please note that you normally would need to restart your services in order to PHP read the variables. Usually, the best place to set these variables are on an initialization script or a Helm chart spec.

Since environment variables values are strings, feature flags will have `1` for `true`, and `0` for `false`. As $CONFIG, you can also target a feature to a *single* user group by declaring the value containing the group name.

> Important: Variable names should be *uppercase*, have *only alphanumeric characters with underscores* (`A-Z0-9_`) and *prefixed* with `MINDS_FEATURE_`. **All non-alphanumeric characters will be replaced with underscores**.

| Feature | Value | EnvVar declaration |
|---|---|---|
| my-feature | true | `MINDS_FEATURE_MY_FEATURE=1` |
| my-cool-feature | 'canary' | `MINDS_FEATURE_MY_COOL_FEATURE=canary` |
| other_22-feature | true | `MINDS_FEATURE_OTHER_22_FEATURE=1` |
| weird_ñ+-feature | false | `MINDS_FEATURE_WEIRD____FEATURE=0` |

## Usage

### Backend

> Important: Attempting to check a feature that was not declared will result in an **Exception being thrown** in the backend.

```php
use Minds\Core\Features\Manager as FeaturesManager;

// ...

$this->features = new FeaturesManager;

// ...

if ($this->features->has('my-cool-feature')) {
  // Cool backend feature for Canary users only
}
```

### Sync CLI

#### Development

On PHP-FPM container, run:
```sh
php cli.php features sync --environment=development,sandbox --ttl=120 --forever
```

The above command would synchronize `development` and `sandbox` environment specs every 2 minutes.

### Frontend

#### Component code

```ts
import { FeaturesService } from '/path/to/services/features.service';

// ...

if (this.featuresService.has('my-cool-feature')) {
  // Cool frontend feature for Canary users only
}
```

#### HTML Templates

Ensure `common/common.module.ts` is imported by your module, and:
```html
<div *mIfFeature="'my-cool-feature'; else noCoolFeature">
  <my-cool-feature></my-cool-feature>
</div>
<ng-template #noCoolFeature>
  <p>No cool feature, sorry</p>
</ng-template>
```

### Mobile

#### Component logic

```js
import featuresService from '/path/to/common/services/features.service';

// ...

if (featuresService.has('my-cool-feature')) {
  // Cool frontend feature for Canary users only
}
```

#### JSX Templates

```jsx
import featuresService from '/path/to/common/services/features.service';

// ...

<View>
  <ComponentA />
  <ComponentB />
  {
    featuresService.has('my-cool-feature') &&
    <MyCoolFeatureComponent />
  }
</View>
```

## Debugging

### Values

To debug the values and their origin, you can log in with an admin user and go to ≡ Menu > Admin > Features.

### Unleash

To debug Unleash client operations, you can set the Logger verbosity to DEBUG in `settings.php` (noisy!):

```php
$CONFIG->set('min_log_level', 100);
```

## Appendix

### Available groups

- `anonymous`: Logged out users
- `authenticated`: Logged in users
- `canary`: Users with experiments turned on
- `plus`: Users with an active Plus (or Pro) subscription
- `pro`: Users with an active Pro subscription
- `admin`: Site admins

### Potential issues

#### Help! My GitLab flags are not being sync-ed.

Ensure the sync CLI is running and synchronizing.
