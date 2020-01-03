---
id: mobile-gitflow
title: Mobile git workflow and CI
---

This guide covers our branching model and the CI flow integrated with it.

## Git Workflow

### Branching model

| Branch       |                                                                                                                                    |
|--------------|------------------------------------------------------------------------------------------------------------------------------------|
|master        | Production ready and released code.                                                                                                |
|release/x.y.z | WIP for a new release, cut from master.                                                                                            |
|test/x.y.z    | Release candidate builds, cut from release/*.                                                                                      |
|stable/x.y.z  | Stable builds, cut from release/*. Merge request should be opened pointing to master after the release.                            |
|feat/*        | New feature branch. Merge requests should be opened pointing towards the respective release/* branch                               |
|fix/*         | Bugfix branch. Merge requests should be opened pointing towards the respective release/* branch                                   |

![Module diagram](assets/gitflow-mobile.jpg 'Workflow')
[Click to enlarge](assets/gitflow-mobile.jpg)

## Continuous integration

Android (Gitlab CI):

| Branch       | Flow                                                                                                                               |
|--------------|------------------------------------------------------------------------------------------------------------------------------------|
|master        | Spec test -> Clean the deleted terms from Poeditor                                                                                 |
|release/x.y.z | Spec test -> Build App -> Apk artifact stored 7 days -> Submit new terms to Poeditor                                               |
|test/x.y.z    | Spec test -> Build Full and Play store versions -> Deploy both to s3 and browserstack                                              |
|stable/x.y.z  | Spec test -> Build Full and Play store versions -> Deploy to s3, browserstack, and the play store                                  |
|feat/*        | Spec test -> Build App -> Apk artifact stored 7 days                                                                               |
|fix/*         | Spec test -> Build App -> Apk artifact stored 7 days                                                                               |

iOS (Circle CI):

| Branch       | Flow                                                                                                                               |
|--------------|------------------------------------------------------------------------------------------------------------------------------------|
|master        | Spec test                                                                                                                          |
|release/x.y.z | Spec test                                                                                                                          |
|test/x.y.z    | Spec test -> Build -> Deploy to test flight                                                                                        |
|stable/x.y.z  | Spec test -> Build -> Deploy to test flight                                                                                        |
|feat/*        | Spec test                                                                                                                          |
|fix/*         | Spec test