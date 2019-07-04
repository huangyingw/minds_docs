---
id: installation
title: Installation
---

## Repositories

Minds is split into multiple repositories:

- [Engine](https://github.com/Minds/engine) - Backend code & APIs
- [Front](https://github.com/Minds/front) - Client side Angular2 web app
- [Sockets](https://github.com/Minds/sockets) - WebSocket server for real-time communication
- [Mobile](https://github.com/Minds/mobile-native) - React Native mobile apps


## Development System Requirements

- > 10GB RAM (be sure to set it in your docker settings)
- > 100GB Disk space
- [Docker Compose](https://docs.docker.com/compose/)

## Development Installation

### Setting up elasticsearch

> **Linux users:**
> To get ElasticSearch 6 to run, you must make a settings change on the host machine.
> - Run ```sudo sysctl -w vm.max_map_count=262144```
> - To make it permanent, modify the variable in `/etc/sysctl.conf`

#### Build the elasticsearch indexes

1. Make sure nothing is running: `docker-compose down`
2. Run the legacy provisioner: `docker-compose up elasticsearch-legacy-provisioner`
3. Run the legacy provisioner: `docker-compose up elasticsearch-provisioner`

### Running the stack the first time

1. Run `sh init.sh` in order to install the front and engine repositories
2. Run `docker-compose up -d nginx`
3. Run `docker-compose up installer` (one time only.. initial username: minds / password: Pa$$w0rd)
4. Run `docker-compose up front-build` 
5. Navigate to `http://localhost:8080`

## Troubleshooting

### Minds is already installed

- Ensure engine/settings.php does not exist and re-run `docker-compose up installer`

### Cassandra will not boot
  - Ensure thrift is enabled
  - Cassandra requires at least 4GB of memory to operate. You can start Cassandra manually by running `docker-compose up cassandra`

### Nuclear Option

With dockerized enviroments, it's sometimes best to start from scratch. If you want to delete your data, these steps will completely **delete** your data. You will be starting fresh.

```
  #Remove your settings file
  rm engine/settings.php 
  
  #Stop your stack
  docker-compose down

  #Delete your data cache
  rm -rf .data

  #Purge all volumes
  docker volume prune

  ```

  That will remove all of your locally cached data. You can either rebuild the containers manually by using ```docker-compose up --build``` or delete everything to start fresh.

```
  # Delete all containers
  docker rm $(docker ps -a -q)

```

## Production System Requirements

At this time it is not advisable to run Minds in production, however it is possible so long as you are aware of the risks.

- 3 Cassandra Nodes (Min 30gb RAM, 1TB SSD, 8 CPU)
- 1 ElasticSearch Node (Min 16GB RAM, 250GB SSD, 8 CPU) #2 nodes are recommended for failover
- 1 Docker Machine (Min 60gb RAM, 50GB SSD, 32 CPU)