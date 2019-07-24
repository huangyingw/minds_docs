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

## Getting connected to the staging environment

### Prerequisties
* Your AWS access keys setup in your environment
    * AWS_ACCESS_KEY={Your access key provided by Mark}
    * AWS_SECRET_ACCESS_KEY={Your secret access key provided by Mark}
    * AWS_DEFAULT_REGION=us-east-1
* Your AWS user must have access to AWS EKS
* Helm and Kubernetes installed

### Connecting

```console
aws eks update-kubeconfig --name=sandbox

export KUBECONFIG=$HOME/.kube/config
```
Then you should be able to see all available pods with:

```console
kubectl get pods
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

### Managing settings on the Review Apps

When a pod gets deployed, [Helm charts](https://gitlab.com/minds/helm-charts) writes in the values by parsing the [configMap.yaml](https://gitlab.com/minds/helm-charts/blob/master/minds/templates/configMap.yaml). 

To have your values persist across builds, you must extend the settings.php script in the (configMap.yml) (https://gitlab.com/minds/helm-charts/blob/master/minds/templates/configMap.yaml)

Do not hard code the values in the configMap, reference them via *.Values.key.subkey*:

```
 // Twillio configuration
        $CONFIG->set('twilio', [
            'account_sid' => '{{ .Values.twilio.sid }}',
            'auth_token' => '{{ .Values.twilio.token }}',
            'from' => '{{ .Values.twilio.from }}'
        ]);

```

And add the values to the correponding yaml files
[Staging environment defaults](https://gitlab.com/minds/helm-charts/blob/master/minds/values.yaml)
[Production values](https://gitlab.com/minds/helm-charts/blob/master/minds/values-production.yaml)




### Why so many values and templating?
Because it enables us to do something really cool, like dynamically override configuration values for your staging environment - useful for turning on your feature flags.

You can test your *local changes* and manipulate the staging environments by using the helm-charts repo. Create your branch, make your changes and then, inside your helm-charts repository branch, run:

```
  helm upgrade --reuse-values --recreate-pods --set new.key='new value' --wait 
  {your.staging.site.subdomain} ./minds
```

So changing an **existing** configuration value is as simple as:
```console
helm upgrade --install --recreate-pods --reuse-values --set max_video_length=12600 feat-max-video-size-1506 ./minds/
```

Adding a new value requires a bit more leg work. Create a new branch in helm charts and add your values to configMap.yaml and values.yaml. Then, you can:

```console
helm upgrade --install --recreate-pods --reuse-values feat-max-video-size-1506 ./minds/
```

We don't need to specify a set value here because the value doesn't exist. However, once you set it, it will continue to be inherited from the last release because of --reuse-values and you'll need to update it with set.

If you hose anything, you can always re-run the pipeline which will rebuild the pods with the latest configuration in master and start over.

## Interacting with the Staging environment

You can get access to the pods by using **kubectl**. Note, pods are read-only and ephemeral, so you can't go hacking things on the container.

Get a list of all pods
```console
kubectl get pods
```

Shell into a pod using the name from ```get pods``` (read only)
```console
kubectl exec -it {your.staging.site.subdomain}-{pod.type}-{kubernetes-suffix} sh 
```

## Production

The Minds production environment is deployed directly from the CI flow found [here](https://gitlab.com/minds/engine/blob/master/.gitlab-ci.yml#L97). Minds currently uses Docker/ECS, but plans to move to Kubernetes as soon as possible. 
