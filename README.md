# NC-News API

The Northcoders News API. All the data you need setup your very own news app server/database.

## Getting Started

**Clone this repository**

In your terminal type the following commands:

```bash
git clone YOUR-CLONED-REPO-URL

cd be-nc-news
```

## Prerequisites

**You will need some form of packet manager to install the necessary tools to use the API, in this README we will be using node packet manager (npm)**

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

**You will also need to create your own knexfile.js with all your configurations in it to run the project**

```
// in knexfile.js

const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  production: {
    connection: `${DB_URL}?ssl=true`
  },
  development: {
    connection: {
      database: "nc_news",
      username: "YOUR_PSQL_USERNAME",
      password: "YOUR_PSQL_PASSWORD"
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      username: "YOUR_PSQL_USERNAME",
      password: "YOUR_PSQL_PASSWORD"
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```

## Running the tests

To test the app run the following command:

```bash
npm test
```

To test the utility functions, run the following command:

```bash
npm run test-utils
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

## Links to APP/API

**Frontend APP github repo: https://github.com/nickbadlose/nc-news .**

**Hosted backend API: https://not-quite-reddit.herokuapp.com/api .**

**Deployed APP: https://trusting-mclean-e3947d.netlify.com/ .**

## Acknowledgments

Northcoders Manchester
