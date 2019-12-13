---
id: mobile-locales
title: Mobile Internationalization
---

The mobile app supports i18n, this guide covers how to work with it.

## Basic concepts

* We use Poeditor for the translations.
* All the language files are located on the *locales/* folder of the app.
* The en.json is the *base* language to generate new *terms*, all the others are downloaded from Poeditor.
* English is the fallback language in case a term is not found in the selected language.

## Language files format and rules

* Languages are stored in JSON format.
* We support 2 types of tags to replace: **{{amount}}** for texts and **&{amount}&** for react Text components.
* Newline characters are forbidden in the translations (Split the text in many terms and add the newlines on the code).

en.json
```json
{
 "wallet": {
     "title": "Wallet",
     "amount": "{{amount}} tokens",
     "withdraw": "&{amount}& withdraw {{text}}"
 },
 "date":{
   "formats":{
       "small":"%b %-d, %Y",
       "medium":"%a, %b %-d, %Y"
   }
 }
}
```
> There is a pre commit hook in place to prevent the newline characters on the en.json file

## Use

Inside the app the i18n service is in charge of the translations.

```js
import i18n from 'common/services/i18n.service';

// simple string
i18n.t('wallet.title');

// with a parameter
i18n.t('wallet.amount', {amount: ‘20’});

// embedded component
i18n.to('wallet.withdraw',
    {text: 'from your account ###'},
    {amount: <Text style={s.bold}>20</Text>});

// dates
i18n.l('date.formats.small', this.props.from)}
```

> IMPORTANT: Keep the method and the term in the same line ir order to be detected by the unused terms search script

## Workflow

The syncronization of terms to Poeditor is included in our CI flow.

* All the new terms merged to release/vX.X.X are pushed to Poeditor.
* To prevent the removal of terms in use by other concurrent builds, only after the production build is cut the deleted terms of the en.json files are removed from Poeditor.

![Module diagram](assets/i18n-mobile-workflow.png 'Workflow')
[Click to enlarge](assets/i18n-mobile-workflow.png)

## Unused terms check

We have a script to detect unused terms of the en.json file:
```
yarn unused-locales
```

## Download languages files from Poeditor

### One language

To download a translation from Poeditor just run:

`yarn locale download **[language]** --poeditor-key=[poeditorAuthKey]`

**language**: The language code (es, it)

```
yarn locale download es --poeditor-key="abcd1234...”
```

### All the languages

To download a translation from Poeditor just run:

`yarn locale downloadAll --poeditor-key=[poeditorAuthKey]`

```
yarn locale downloadAll --poeditor-key="abcd1234...”
```
> Keep in mind that this will download even the partially translated languages.

## Manually uploading terms to Poeditor

In case you need to manually upload new terms to Poeditor you can use:

`yarn locale upload --poeditor-key=[poeditorAuthKey] [--overwrite=1] [--sync_terms=1]`

**--overwrite=1**: Will overwrite the english translations with the json values\
**--sync_terms=1**: Will delete from Poeditor the terms removed from the en.json file (The terms will be removed from all the languages)

```
yarn locale upload --poeditor-key="234sdfsdf...” --overwrite=1 --sync_terms=1
```