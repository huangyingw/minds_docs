---
id: deployment
title: Deployment
---

Minds deploys with **[Gitlab](https://gitlab.com/minds)**, making use of Docker & Kubernetes.

## Docker Containers

### FPM
```
docker build -t minds/fpm:latest -f containers/php-fpm/Dockerfile .
```

### Runners
```
docker build -t minds/runners:latest -f containers/php-runners/Dockerfile .
```

## Review Apps

The review apps make use of [Helm](https://helm.sh) and [Kubernetes](https://kubernetes.io/). Our helm charts can be found [here](https://gitlab.com/minds/helm-charts) and you can inspect the review app auto deployment in our [.gitlab-ci.yml file](https://gitlab.com/minds/engine/blob/master/.gitlab-ci.yml#L52).

A kubernetes environment can be created by running:

```
helm upgrade \
    --install \
    --reuse-values \
    --set cassandra.deploy=true \
    --set elasticsearch.deploy=true \
    --set redis.deploy=true \
    --wait \
    my-minds-stack \
    ./helm-charts/minds
```

If you wish to use shared databases, due to resource constaints, first deploy your services and then set `deploy=false` like so:

```
helm upgrade \
    --install \
    --reuse-values \
    --set cassandra.deploy=false \
    --set elasticsearch.deploy=false \
    --set redis.deploy=false \
    --wait \
    my-mini-minds-stack \
    ./helm-charts/minds
```

## Production

The Minds production environment is deployed directly from the CI flow found [here](https://gitlab.com/minds/engine/blob/master/.gitlab-ci.yml#L97). Minds currently uses Docker/ECS, but plans to move to Kubernetes as soon as possible. 