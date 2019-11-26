---
id: postman
title: Postman collection
---

### Getting set up

Firstly, you need to download [Postman](https://www.getpostman.com/downloads/), and log in with your account.

### Enviroment preperation

We use a few enviromental variables to allow us to share endpoints. These can be specified by heading over to the settings cog in the right of postman, and then hitting add. The variables you need and instructions on how to obtain them can be found here:

![Postman environmental variables](assets/postman-variables.png "Postman environmental variables")

### Collection

Our directory structure is as follows:

API

```
/
└───api
│   └───v1
|   |   └───...
│   └───v2
|   |   └───...
└───fs
|   └───...
```

If we want to add a GET request to /api/v2/media/proxy, it belongs in the a corresponding media folder in the v2 directory, named 'api v2 media proxy'.

#### Standards
* Naming structure, take the forward slashes out of the endpoint name.
* Don't make your endpoints dependant on host, use {{ host }}.
* Try to document your endpoints.
