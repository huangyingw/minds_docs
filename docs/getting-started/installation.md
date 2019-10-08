---
id: installation
title: Installation
---

Get started by creating a branch (dev team) or fork (community members) of the [Minds repository](https://gitlab.com/Minds/minds).

## Development system requirements

- [Docker Compose](https://docs.docker.com/compose/)
- 10GB RAM (also set this in _Docker > Settings > Advanced_ tab)
- 100GB Disk space

## Development installation

### Build the Elasticsearch indexes

```
# Make sure nothing is running
docker-compose down

# Run the legacy provisioner
docker-compose up elasticsearch-legacy-provisioner

# Run the provisioner
docker-compose up elasticsearch-provisioner
```

_**Linux users:** To get Elasticsearch 6 to run, you must make a settings change on the host machine:_

- _Run `sudo sysctl -w vm.max_map_count=262144`_
- _To make it permanent, modify the variable in `/etc/sysctl.conf`_

### Running the stack for the first time

1. Run `sh init.sh` in order to install the front and engine repositories
2. Run `docker-compose up -d nginx`
3. Run `docker-compose up installer` (one time only... initial username: minds / password: Pa\$\$w0rd)
4. Run `docker-compose up front-build`
5. Navigate to [http://localhost:8080](http://localhost:8080)

## Production system requirements

At this time it is not advisable to run Minds in production, however it is possible so long as you are aware of the risks.

- 3 Cassandra Nodes (Min 30gb RAM, 1TB SSD, 8 CPU)
- 1 ElasticSearch Node (Min 16GB RAM, 250GB SSD, 8 CPU) #2 nodes are recommended for failover
- 1 Docker Machine (Min 60gb RAM, 50GB SSD, 32 CPU)

## Working in the development environment

Configure your settings in `settings.php`.

### Make your test user an admin

Sometimes you need to do things as an admin user. To do this, make sure you are in development mode in `settings.php`:

```php
$CONFIG->set('development_mode', true);
```

And set your test user entity's `isAdmin` flag to true.
