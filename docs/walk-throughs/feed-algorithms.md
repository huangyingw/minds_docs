---
id: feed-algorithms
title: Feed algorithms
---

Every 5 minutes, Minds will trigger a job that gathers all the entities (activities, images, videos and blogs) that received any kind of vote in that interval. Then, it will update the total amount of votes on the ElasticSearch documents, which are used to display all the feeds and search results, for these entities.

## Top Feed

When querying the Top Feed:
- Gather all the public activities that were created within the selected time period.

- Calculate the score using:
    ```
    magnitude = up + down

    score = ((up + 1.9208) / magnitude - 1.96 * SQRT((up * down) / magnitude + 0.9604) / magnitude) / (1 + 3.8416 / magnitude)
    ```
    where `up` is the total amount of up votes for that entity, `down` is  the total amount of down votes for that entity.

- Sort all results from the highest score to the lowest

### Channels and Groups

These special categories will still use the above algorithm but, once the list is built, it will transform the list by adding up the scores based on the activities' owner (Top Channels) or the container (Top Groups).

## Hot Feed

> Refer to the [old implementation](#old-implementation) section.

## Old Implementation

The, now deprecated, system was that every 5 minutes, Minds ran several jobs that gathered all the entities (activities, images, videos and blogs) that received any kind of vote in the last 12 hours, 24 hours, 7 days, 30 days and 1 year. Then it would store the amount of votes received in the time period for that entity.

Issues with this system:
- Computationally expensive on 30 days and 1 year periods.
- Old entities being wrongfully listed as Top/Hot on quieter moments in the site.

### Top Feed

When querying the Top Feed:
- Gather all the public activities that have at least 1 vote and their up votes were synchronized for the selected period in the last 3 days.

- Calculate the score using:
    ```
    magnitude = up + down

    if magnitude <= 0:
        score = -10

    else:
        score = ((up + 1.9208) / magnitude - 1.96 * SQRT((up * down) / magnitude + 0.9604) / magnitude) / (1 + 3.8416 / magnitude)
    ```
    where `up` is the amount of up votes in the selected time period, `down` is the amount of down votes in the selected time period.

- Sort all results from the highest score to the lowest.

### Hot Feed

When querying the Hot Feed:
- Gather all the public activities that have at least 1 vote and their up votes were synchronized for the selected period in the last 7 days.

- Calculate the score using:
    ```
    age = now - time_created - 1546300800;
    balance = up - down;
    order = LOG(MAX(ABS(balance), 1));

    if balance > 0:
        sign_of_balance = 1

    else if balance < 0:
        sign_of_balance = -1

    else:
        sign_of_balance = 0

    score = (sign_of_balance * order) - (age / 43200);
    ```
    where `now` is the current time, `time_created` is when the entity was posted onto Minds, `1546300800` is 1/1/2019 to calculate decay, `up` is the amount of up votes in the selected time period, `down` is the amount of down votes in the selected time period, and `43200` is 12 hours.

- Sort all results from the highest score to the lowest.
