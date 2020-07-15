---
id: developers
title: Developers
---

> Are you sure you want to be here? This page is intended for developers and not end user.

## Proxying

You can proxy your local angular app to any Pro site by exporting the `ENGINE_HOST` env variable like:

1. ```
   # mark.minds.io is the PRO site here
   export ENGINE_HOST=mark.minds.io
   ENGINE_SECURE=1
   ENGINE_PORT=443
   ```
2. `npm run serve:dev`
3. Go to http://localhost:4200
