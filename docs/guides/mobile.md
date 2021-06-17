---
id: mobile
title: Mobile
---

Minds app uses [React Native](https://reactnative.com) to power both the Android and iOS applications. You can check out the code [here](https://gitlab.com/minds/mobile-native)

## Setup dev environment

Please refer to `React Native CLI Quickstart` in the [React Native Docs](https://reactnative.dev/docs/environment-setup) to setup your local dev environment.
> We use react-native-cli, not expo, because we rely on many packages with native code.

## Install

Clone the [repository](https://gitlab.com/minds/mobile-native).
```console
git clone git@gitlab.com:minds/mobile-native.git
```


Install the dependencies

```console
yarn
```

Install pods (iOS only)

```console
cd ios
pod install
```

## Run the application

```console
yarn ios
```

or

```console
yarn android
```

## Technologies

The app uses many open source packages, but there are a few technologies that would be good to know for anyone who wants to contribute or check the code.

- App state: **[mobx](https://mobx.js.org)** & **[mobx-react](https://github.com/mobxjs/mobx-react)**\
  We are migrating the app to react hooks and planning to move to mobx-react-lite when it is finished. So any new code should be following that guideline.

- Navigation: **[@react-navigation](https://reactnavigation.org)**

## Structure

```
mobile
└───android
└───ios
└───locales
│
└───src
│   └───assets
│   └───config
│   └───common
│   │   └───components
│   │   └───services
│   │   └───stores
│   │   └───helpers
│   │   └───...
│   └───module
│   │   └───complexchild
│   │   │   └───Header.tsx
│   │   │   └───Body.tsx
│   │   │   └───ComplexChild.tsx
│   │   │   └───...
│   │   │
│   │   └───ModuleScreen.tsx
│   │   └───SomeInnerComponent.ts
│   │   └───SomeModel.ts
│   │   └───createModuleStore.ts
│   │   └───ModuleStore.ts
│   │   └───ModuleService.ts
│
└─ App.tsx
```

### ios & android

These are the project folders for each platform, usually you will not need to touch anything there.

### locales

The locales are stored in json format, the main locale files is `en.json` and all the others are downloaded from Poeditor. Check [Mobile Internationalization](../walk-throughs/mobile-locales)

### src/assets

All the assets go here, images, videos, and fonts.

### src/config

**Config.ts** stores all the configuration constants for the application (like the api uri)

### src/common

All the reusable code should be inside common:

- Generic components
- Reusable stores
- Services used across many modules or the whole application
- Helpers or utility functions.

### src/module

Every module has his own folder inside `src/{modulename}`, there we have the screens or components of the module along with stores, services, and models.

## Naming conventions

### Components

Components should use Camel Case names and the `.tsx` extension\
Eg: `FeedList.tsx`

### Screens

Screens are components too, but we add the `Screen` suffix to be able to easily identify them\
Eg: `NewsfeedScreen.tsx`

### Stores

Stores should use Camel Case names, the `Store` suffix, and the `.ts` extension\
Eg: `NewsfeedStore.ts`

### Module Services

Services should use Camel Case names, the `Service` suffix, and the `.ts` extension\
Eg: `NewsfeedService.ts`

### Global Services

Services should use Kebab Case names, the `.service` suffix, and the `.ts` extension\
Eg: `api.service.ts`

### Models

Models should use Camel Case names, the `Model` suffix, and the `.ts` extension\
Eg: `ActivityModel.ts`

## Stores

The stores are implemented using MobX to keep the app state, currently we are using the store injection mechanism but it should be considered legacy.

The targeted architecture is to have globals stores provided using a react-context and local stores for the components.

### Local and Global stores

Always prefer local stores for the components using the useLocalStore hook. This in most cases simplifies the logic of the stores, because it creates a new instance for each component's instance, avoiding the need of clean up data on each run.\
Global stores are available for the whole app, they are instantiated when the app starts and they live until it is closed. A store should be global only if it needs to be accessed from many components of the app tree Eg: `UserStore` which stores the current user.

### Creating local stores

For simple stores it is better to just have it inline, it improves the readability of the code\

```js
export default observer(function (props) {
    const store = useLocalStore(() => {
      votes: 0;
      voteUp() {
        store.votes++;
      },
      voteDown() {
        store.votes--;
      }
    });

    return (
      <View>
        <Text>{store.votes}</Text>
        <Text onPress={store.voteUp}>Vote Up</Text>
        <Text onPress={store.voteDown}>Vote Down</Text>
      </View>
    );
});
```

But, if your store is complex or generic, you should move the creation outside the component

```js
// createVotesStore.ts
export default () => {
  votes: 0;
  voteUp() {
    this.votes++;
  },
  voteDown() {
    this.votes--;
  }
  ...
}

// VotesCounter.tsx
import createVotesStore from './createVotesStore';
export default observer(function (props) {
  const store = useLocalStore(createVotesStore);

  return (
    <View>
      <Text>{store.votes}</Text>
      <Text onPress={store.voteUp}>Vote Up</Text>
      <Text onPress={store.voteDown}>Vote Down</Text>
    </View>
  );
});
```

### Passing local stores to child components

There are two ways of passing the store to the child components the most simple is just passing the store as a property

```js
...
return (
  <View>
    <Header store={store}/>
    ...
  </View>
);

//Header.tsx
...
<Text onPress={props.store.voteUp}>Vote up</Text>

```

The second is to create a context and a hook to access the store, this should be used only if you need to access the store in a deep child in a very complex tree.\
Eg:

```js
Parent (Store)
└───Body
│   └───Modal
│   └───Header
│   └───List
│   │   └───Item
│   │   │   └───Header
│   │   │   │   └───Title (Store)
│   │   │   └───Detail
│   │   └───Item
│   │       └───Header
│   │       │   └───Title (Store)
│   │       └───Detail
│   └───Footer
...
```

### Using global stores

To use a global store you should use the **useStores** hook.

```js
import { useStores } from "../common/hooks/use-stores";
export default observer(function (props) {
  const { user } = useStores();
  return (
    <View>
      <Text>{user.me.name}</Text>
    </View>
  );
});
```

## Models

Models are similar to stores, they have normal and observable properties, and actions that modify those properties. The difference is that a model represents an Entity into the application.\
Eg: `ActivityModel` `BlogModel`

### Creating a model

All the models in the application must extend from `BaseModel`

```js
class ContactModel extends BaseModel {
  @observable name = '';
  @observable phone = '';
  count = 1; // no observable

  @action
  setName(name) {
    this.name = name;
  }

  ...
}
```

### Instantiating a model

The base model provides you handy static methods to create instances

#### Create
```js
// create an instance of contact model and initializes the properties
const contact: ContactModel = ContactModel.create({
  name: 'martin', phone: '555-12344321'
});
```

#### Create Many
```js
// create many instances of the contact model
const rawContacts = [
  { name: 'martin', phone: '555-12344321' },
  { name: 'emma', phone: '555-43211234' },
  ...
]
const contacts: Array<ContactModel> = ContactModel.createMany(rawContacts);
```

### Model composition
You can easily add composition to your models by implementing the `childModels` method and return an object with the properties and the models they represents

```js

class LocationModel extends BaseModel {
  address = '';
}

class ContactModel extends BaseModel {
  @observable name = '';
  @observable phone = '';
  count = 1; // no observable

  /**
   * Child models
   */
  childModels() {
    return {
      location: LocationModel,
      referrer: ContactModel,
    };
  }

  @action
  setName(name) {
    this.name = name;
  }

  ...
}
```

Now, you can instantiate a model with all its composed model in a single call to `create`
```js
const contact: ContactModel = ContactModel.create({
  name: 'martin',
  phone: '555-12344321'
  location: {
    address: 'Somewhere 123'
  },
  referrer: {
    name: 'emma',
    phone: '555-43211234'
    location: {
      address: 'Planet earth 123'
    },
  }
});
```
This will instantiate the main contact and all his children models\
* `contact.location` will be a `LocationModel`
* `contact.referrer` will be a `ContactModel`
* `contact.referrer.location` will be a `LocationModel`
* You can call `contact.referrer.setName('newname')`

The same works for createMany.

### Check or create
Check if the passed parameter is an instance of the model\
if this is the case, it will return the same instance or it will create a new one otherwise

```js
function(contact: ContactModel | object) {
  const contactModel = ContactModel.checkOrCreate(contact);
  contactModel.setName('new name');
  ...
}
```

## Styling and themes

Please read the [walk through of styling and themes](../walk-throughs/mobile-styling.md)


## Feature flags
To *hide* something behind a feature flag you can do it using the features service

```js
import featuresService from '../common/services/features.service.ts'

function (props) {

  return (
    <View>
      {featuresService.has('voteUp') && (
        <Text onPress={props.store.voteUp}>Vote Up</Text>
      )}
      <Text onPress={props.store.voteDown}>Vote Down</Text>
    </View>
  );
}
```
Keep in mind that this service first loads the cached feature flags, and then it updates them from the server. This is an async function and it takes some time to be ready. Because of this, a feature flag is not a good idea for a core app initialization functionality or to change the initial screen structure.

