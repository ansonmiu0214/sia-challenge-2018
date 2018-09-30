# Dashboard Prototype
This aims to simulate the serverless dashboard visualisation solution using a full-stack JavaScript web application that renders based on data fetched from our custom-defined APIs, which in turn uses the SIA /meal/upliftplan API to fetch additional metadata for the dashboard.

## Data sources
The purpose of the dashboard prototype is to illustrate this visualisation solution as well as to show how it integrates with the data collected from AWS DeepLens. 

Date | Flight No. | Description
----------------------------------
2018-07-20 | SQ336 | Meal data for this flight is fetched __directly__ from the provided SIA `/meal/upliftplan` API, and a large amount of sample data is generated artifically for illustrative purposes.
2018-07-21 | SQ888 | Food wastage data for this mock flight is fetched __directly__ from the machine learning inference results from the `deeplens` prototype.

## APIs
These APIs are implemented using Express.js for the prototype, but in the actual implementation, will be replaced by AWS Lambda functions mappped via an API Gateway to take advantage of the proposed serverless rchitecture.

### GET /api/meal/date/:date/flight/:flightCode
Returns meal uplift plan for the flight flying on the particular date.

### GET /api/waste/date/:date/flight/:flightCode
Returns meal wastage data for the flight flying on the particular date.

### GET /api/waste/days
Returns food wastage per day in the current month so far.
```
Sample response:
{
  "dates": ["Jul 1", ...],
  "values: [1000, ...]
}
```

### GET /api/waste/months
Returns food wastage per month in the current year so far.
```
Sample response:
{
  "dates": ["Jan", ...],
  "values: [1000, ...]
}
```

### GET /api/waste/food
Returns food wastage in the current month so far by food type.
```
Sample response:
{
  "foodName": ["fish", ...],
  "values: [1000, ...]
}
```

## Folder structure

### public/
Holds the frontend dashboard implemented using AngularJS.

### app.js
Entry point for the Node.js application, runs the web server and connects the app with the relevant routers.

### src/routers
Maps API calls to meal details and wastage details to the corresponding controllers.

### src/controllers
Serves the API calls by providing JSON responses, some of which require fetching from SIA's provided APIs and others using the DeepLens data exported into local storage.

## Installation

### Prerequites
* Node.js
* npm

### First-time setup
1. Run `npm install` to get all dependencies

### Running the web application
1. __Make sure no other process on your machine is listening on port 5000 - if there is such a process, kill it before proceeding.__
2. Run `npm start` to start the server. Your terminal should print "Listening on port 5000...".
3. Navigate to `localhost:5000` on your browser to use the dashboard.

At this point, you can browse the Overview and wastage data for SQ336. You will notice that an alert is shown when accessing SQ888. This is normal, as this fetches data from the DeepLens prototype. 

To experiment with the flow of integrating DeepLens with the dashboard, you may follow the steps in the Deeplens README or watch the video demo to see how it is done.
