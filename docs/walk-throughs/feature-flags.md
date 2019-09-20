---
id: feature-flags
title: Feature flags
---

Feature flags allow new features to be introduced to a subset of users (i.e. those in Canary mode) before they are available to all users.

## Usage

Start by configuring a feature flag and then wrap a "gate" around code that you want to be executed only for applicable users.

### Configure settings

First, define and enable the flag in `settings.php`:

```php
$CONFIG->set('features', [
    ...
    'my-cool-feature' => true
    ...
])
```

### Backend

```php
use Minds\Core\Features\Manager as FeaturesManager;

...

$this->features = new FeaturesManager;

...


if ($this->features->has('my-cool-feature')) {
  // Cool backend feature for Canary users only
}
```

### Frontend

Import `FeaturesService`, add it to the constructor, and:

```ts
if (this.featuresService.has('my-cool-feature')) {
  // Cool frontend feature for Canary users only
}
```
