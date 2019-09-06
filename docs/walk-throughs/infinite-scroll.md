---
id: infinite-scroll
title: Infinite scroll
---

The following walk-through covers how to limit the amount of list items returned in a repository response, set paging tokens on Cassandra responses, and connect the requests and responses with the frontend with the help of the infinite-scroll component.

Let's say a user with a very popular channel wants to see a list of their subscribers. They have thousands of subscribers, and we only want to return 12 subscribers at a time because it would take a long time to return the entire list in one go (and their screen is only big enough to show <12 at one time subscribers anyway). As the user scrolls down their list of subscribers, we will continue populate the list by continually making requests for 12 more subscribers until they reach the end of the list.

> TODO: proofread and annotate below

### subscribers.component.ts

```ts
export class SubscribersComponent implements OnInit{
  subscribers: Array<any> = [];
  offset: string = '';
  limit = 12;
  moreData = true;
  inProgress = false;
  noInitResults = false;
  fewerResultsThanLimit = false;

  constructor(public client: Client) {}

  ngOnInit() {
    this.load(true);
  }

  load(initialLoad: boolean = false) {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    if (initialLoad) {
      this.subscribers = [];
      this.moreData = true;
    }

    this.client
      .get(`api/v2/subscribers`, { limit: this.limit, offset: this.offset })
      .then((response: any) => {

        // Hide infinite scroll's 'nothing more to load' notice
        // if length of initial load is less than response limit
        if (initialLoad && response.subscribers.length < this.limit) {
          this.fewerResultsThanLimit = true;
          this.moreData = false;
        }

        if (!response.subscribers.length) {
          this.inProgress = false;
          this.moreData = false;

          // If no results on initial load, show notice instead of empty list
          if (initialLoad) {
            this.noInitResults = true;
          }
          return;
        }

        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
        }

        this.subscribers.push(...response.subscribers);
        this.inProgress = false;
      })
      .catch(e => {
        this.moreData = false;
        this.inProgress = false;
      });
  }
```

### subscribers.component.html

```html
<ng-container *ngFor="let subscriber of subscribers">
  <div class="m-subscribers__subscriberContainer">
    <div>{{subscriber.username}}</div>
  </div>
</ng-container>
<div *ngIf="!fewerResultsThanLimit">
  <infinite-scroll
    distance="25%"
    (load)="load()"
    [moreData]="moreData"
    [inProgress]="inProgress"
  >
  </infinite-scroll>
</div>
<div *ngIf="noInitResults">
  <div>
    You don't have any subscribers yet.
  </div>
</div>
```

### api/v2/subscribers.php

```php
public function get($pages)
{
    $response = [];

    $limit = isset($_GET['limit']) ? $_GET['limit'] : 12;
    $offset = isset($_GET['offset']) ? $_GET['offset'] : "";
    $user_guid = isset($pages[0]) ? $pages[0] : Core\Session::getLoggedInUser()->guid;

    $manager = Di::_()->get('Subscribers\Manager');

    $opts = [
        'limit'=>$limit,
        'offset'=>$offset,
        'referrer_guid'=>$referrer_guid
    ];

    $subscribers = $manager->getList($opts);

    $response['subscribers'] = Factory::exportable(array_values($subscribers->toArray()));
    $response['load-next'] = (string) $subscribers->getPagingToken();

    return Factory::response($response);
}
```

### Subscribers/Manager.php

```php
public function getList($opts = [])
{
    $opts = array_merge([
        'limit' => 12,
        'offset' => '',
        'user_guid' => null,
    ], $opts);

    $response = $this->repository->getList($opts);

    if ($opts['hydrate']) {
        foreach ($response as $subscription) {
            $subscriber = $this->entitiesBuilder->single($subscription->getSubscriberGuid());
            $subscription->setProspect($subscriber);
        }
    }
    return $response;
}
```

### Subscribers/Repository.php

```php
use Minds\Common\Repository\Response;
use Minds\Core\Data\Cassandra\Prepared;
use Cassandra;
class Repository
{
    public function getList($opts = [])
    {
        $opts = array_merge([
            'limit' => 12,
            'offset' => '',
            'user_guid' => null,
        ], $opts);

        $response = new Response;

        $cqlOpts = [];
        if ($opts['limit']) {
            $cqlOpts['page_size'] = (int) $opts['limit'];
        }

        if ($opts['offset']) {
            $cqlOpts['paging_state_token'] = base64_decode($opts['offset']);
        }

        $query = new Prepared\Custom();
        $query->query($statement, $values);
        $query->setOpts($cqlOpts);

    }
}
```
