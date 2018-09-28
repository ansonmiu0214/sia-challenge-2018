# Dashboard Prototype
TODO

## Data sources
The purpose of the dashboard prototype is to illustrate this visualisation solution as well as to show how it integrates with the data collected from AWS DeepLens. 

Date | Flight No. | Description
----------------------------------
2018-07-20 | SQ336 | Meal data for this flight is fetched __directly__ from the provided SIA `/meal/upliftplan` API, and a large amount of sample data is generated artifically for illustrative purposes.
2018-07-21 | SQ888 | Food wastage data for this mock flight is fetched __directly__ from the machine learning inference results from the `deeplens` prototype.

## APIs
These APIs are implemented using Express.js for the prototype, but in the actual implementation, will be replaced by AWS Lambda functions mappped via an API Gateway to take advantage of the proposed serverless rchitecture.

### /api/meal/date/:date/flight/:flightCode
TODO

### /api/waste/date/:date/flight/:flightCode
TODO