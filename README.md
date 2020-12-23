[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

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

### Get latest emails

Request:

`GET /api/emails/latest`

Response:
```javascript
[
  {
    "fromAddress": "iam@emitter.org",
    "toAddress": "iam@destinator.org",
    "subject": "What a subject",
    "body": "Guess what, this is the body",
    "mailTimestamp": "20201225T00:00:00Z"
  }
]
```

