[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=hirle_mail-in-memory&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=hirle_mail-in-memory)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=hirle_mail-in-memory&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=hirle_mail-in-memory)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=hirle_mail-in-memory&metric=security_rating)](https://sonarcloud.io/dashboard?id=hirle_mail-in-memory)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=hirle_mail-in-memory&metric=alert_status)](https://sonarcloud.io/dashboard?id=hirle_mail-in-memory)


# Mail In Memory

Mail In Memory listen as an STMP server, it records the emails it receives in a database you can query. You may use it:
- for testing: give our application Mail In Memory host and port, run you your test and query Mail In Memory's API the emails you expect are here.
- for development: use Mail In Memory as your SMTP relay, and vizualize emails in its UI as soon as your software under development emits them.

## Prerequisites

NodeJS 12 is required, at the time of writing LTS is 12.20.0. You may want to adapt the version number.

`curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -`
`sudo apt-get install -y nodejs`

## Start!

### One line

`npx mail-in-memory`

### For a permanent use

A ansible playbook is available, see the directory `ansible`. This is will download the latest release from GitHub and make it run as a service. To proceed:
- adapt the `inventory/hosts` file
- adapt the `installs/fils/config.json` file
- run `ansible-playbook installs/mail-in-memory.yml`

## More options, use a config file

Copy the file `config.template.json` as `config.json` and make it yours. This looks like:
```javascript
{
  "http-port" : 3300,
  "smtp-port" : 3325,
  "db" : {
      "filename": "sqlite.db"
  }
}
```

Run: 
`npx mail-in-memory --config ./path/to/config.json`

## API

### Get latest mails

Request:

`GET /api/mails/latest`

Response:
```javascript
[
  {
    "fromAddress": "iam@emitter.org",
    "toAddress": "iam@destinator.org",
    "subject": "What a subject",
    "body": "Guess what, this is the body",
    "mailTimestamp": "2020-12-25T00:00:00Z"
  }
]
```

### Get mails since

Request:

`GET /api/mails/since/:isodate`

See [ISO_8601](https://en.wikipedia.org/wiki/ISO_8601) for date format, example: `2021-02-28T17:48:29Z`.

Response:
(similar to previous)

### Get mails for

Request:

`GET /api/mails/for/:isoduration`

See [ISO_8601](https://en.wikipedia.org/wiki/ISO_8601#Durations) for duration format, example: `P1M`.

Response:
(similar to previous)


### Delete mails older than

Request:

`DELETE /api/mails/older/:isoduration`

See [ISO_8601](https://en.wikipedia.org/wiki/ISO_8601#Durations) for duration format, example: `P1M`.

Response:
Status code 201 or 204 depending some rows were deleted. 