# NC-News API

The Northcoders News API. All the data you need setup your very own news app server/database.

## Getting Started

**Fork this repository and then clone it**

In your terminal type the following commands:

```bash
git clone YOUR-CLONED-REPO-URL

cd be-nc-news
```

## Prerequisites

**You will need sosme form of packet manager to install the necessary tools to use the API, in this README we will be using node packet manager (npm)**

If you don't have npm see this link on how to install it: https://www.npmjs.com/get-npm

**You will need Node version v13.0.1 or later to use this API**

## Installing

**Check you're in the be-nc-news directory before running the following commands**

if not cd into it:

```bash
cd be-nc-news
```

Run the following command:

```bash
npm install
```

## Running the tests

**Should you wish to run the tests you will need to install some of the dev-dependencies for this project**

Run the following command:

```bash
npm install chai chai-sorted mocha sams-chai-sorted supertest -D
```

then run:

```bash
npm test
```

## Run locally

You should now be ready to run this project locally. To do so, run the following command:

```bash
npm start
```

Then in your browser go to http://localhost:9090 to access your API.

go to http://localhost:9090/api/ to see a list of all the possible endpoints with example responses.

try going to http://localhost:9090/api/articles and see what comes back.

## Hosting

To host your API follow the instructions in the hosting.md file in this repo. This README uses heroku to host the app.

**Here is a link to my hosted version: https://not-quite-reddit.herokuapp.com/api**

## Acknowledgments

Northcoders Manchester
