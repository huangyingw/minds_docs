---
id: troubleshooting
title: Troubleshooting
---

## Nuclear Option

When things aren't running smoothly in your Dockerized environment, sometimes it's best to start from scratch. Follow these steps to **completely delete your data** and start fresh:

```
# Remove your settings file
rm engine/settings.php

# Stop your stack
docker-compose down

# Delete your data cache
rm -rf .data

# Purge all volumes
docker volume prune
```

After you've deleted your data, you can either rebuild the containers manually by using `docker-compose up --build` or delete them:

```
# Delete all containers
docker rm $(docker ps -a -q)
```

## Minds is already installed

- Ensure **engine/settings.php** does not exist and re-run `docker-compose up installer`

## Cassandra will not boot

- Ensure thrift is enabled
- Cassandra requires at least 4GB of memory to operate. You can start Cassandra manually by running `docker-compose up cassandra`

## Docker is frozen

- You might need to increase the resources allotted to Docker. To do this, go to _Docker > Preferences > Advanced_. From there, move the CPU/Memory sliders up and see if that fixes the problem

## ElasticSearch is missing indexes (Linux)

Sometimes on Linux there can be still be problems after building the Elasticsearch indexes, due to permission issues. This can manifest in a few ways, but is usually indicated simply by an error complaining about missing indexes in ElasticSearch.

First, run this command, or add it to your .bashrc or .zshrc to have it permanently available:
```
alias dm-disk='docker run --rm -it -v /:/docker alpine:edge $@'
```

Next, run `docker volume ls` and find the name of the Elasticsearch data container.
Copy it to your clipboard, and run the second command, replacing the end with the copied name:
```
docker volume ls
docker volume inspect xxxxx_elasticsearch_etc
```

This will output JSON to your terminal. In that JSON, look for the Mountpoint key, and copy over the path value (we will call it $MOUNTPOINT).

It should look something like this:
/var/lib/docker/volumes/minds_elasticsearch-data/_data

Next up, you need to run:
```
dm-disk
chmod -R 0777 /docker/$MOUNTPOINT
```
