---
id: emails
title: Sending emails
---

This guide covers how to dynamically send emails in the Minds backend.

## Process overview

1. An event occurs (e.g. a new user joins Minds) and dispatches a message to the queue
2. The queue then dispatches an internal event
3. The internal event compiles and dispatches the email
4. [Mailer.php](https://gitlab.com/minds/engine/blob/master/Core/Email/Mailer.php) does the actual sending

### Email templates

The email itself inherits from [Template.php](https://gitlab.com/minds/engine/blob/master/Core/Email/Template.php), which builds and outputs the email. We use .tpl files that get wrapped in a general [default.tpl](https://gitlab.com/minds/engine/blob/master/Components/Email/default.tpl) (which has the headers and footers).

You can also use/extend optional [EmailStyles.php](https://gitlab.com/minds/engine/blob/master/Core/Email/EmailStyles.php) and partials (reusable snippets that get built and injected into the email) for additional control over styles. See [SuggestedChannels.php](https://gitlab.com/minds/engine/blob/master/Core/Email/Partials/SuggestedChannels.php) and
[SuggestedChannels.tpl](https://gitlab.com/minds/engine/blob/master/Core/Email/Partials/Templates/SuggestedChannels.tpl) for partial usage examples.

### Testing

To actually send and test, add your own gmail SMTP server to `settings.php`:

```php
$CONFIG->set('email', [
  'smtp' => [
    'host' => 'smtp.gmail.com',
    'username' => 'mygmailaddress@gmail.com',
    'password' => 'my gmail password',
    'port' => 465
  ]
]);
```
Ensure your gmail account is configured to allow emails to send. 2-step verification must be turned OFF. In 'connected apps and sites', turn ON 'allow less secure apps'. Additional info [here](https://www.formget.com/send-email-via-gmail-smtp-server-in-php/).

Make sure runners are running so the queue can be parsed:

```console
docker-compose up runners
```

See [Email CLI controllers](https://gitlab.com/minds/engine/blob/master/Controllers/Cli/Email.php) for tools related to testing and building.
For example, to test the WelcomeComplete email, run this in the php-fpm shell:
```
php cli.php Email testWelcomeComplete --guid=1095036819759697938 --output=/var/www/Minds/engine/welcome_complete.html --send
```
Run this to get additional information about the parameters involved in the test:
```
php cli.php Email testWelcomeComplete --help
```

