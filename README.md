# sia-challenge-2018
A functional prototype for our proposed solution tackling the __in-flight F&B consumption tracking__ problem statement.

Team Name | Team Members 
--- | --- 
_F5 Shift_ | Mary Cheng, Sharen Choi, Anson Miu, Kero Leung

## Repository structure

### `dashboard/`
Source files and README for the Dashboard prototype (also provided below).

### `deeplens/`
Source files and README for the DeepLens prototype (also provided below).

### `deeplens_data/`
__This directory does not exist in the initial commit__ as it is the output folder for the DeepLens machine learning inference Python script. It will exist after the script is run (see the DeepLens README below).

### `mock_data/`
Contains mock JSONs for food waste generated for one of the SIA flights listed in the SIA meal uplift API. Random data is generated in the CSVs and exported to corresponding JSONs via the included Python script. 

The mock data serves the purpose of illustrating the functional dashboard prototype being able to dynamically fetch and render data from an external data source.

### `source_images/`
Images used by the DeepLens prototype. The object recognition model will run on these images to generate the food wastage payload to be rendered on the dashboard.

### `clean.sh`
A small Bash script used to clean the `deeplens_data` directory

## [DeepLens prototype](https://github.com/ansonmiu0214/sia-challenge-2018/tree/master/deeplens)

This aims to similate the DeepLens capabilities through a Python script feeding local images through a machine learning inference script (powered by Keras using the ResNet50 dataset).

### Installation

#### Prerequisites
* `python` (version 2.7)
* `pip` (package manager from which other dependencies will be installed from)
* `virtualenv`

#### First-time setup
1. Make sure you are in the `deeplens/` directory.
2. `virtualenv venv` to create the virtual environment.
3. Run `source venv/bin/activate` to activate the virtual environment. Your shell name will now be prefixed with `(venv)`.
4. Run `pip install -r requirements.txt` to install the dependencies listed in `requirements.txt`.

To run the Python script, execute `python main.py`.
To exit the virtual environment, run `deactivate`.

#### Running the inference script
The `deeplens.py` script will run the machine learning inference on the images in the `../source_images` directory.

The payload from the above script is handled by `aws_lambda.py`, which computes the relative proportion of food wastage and outputs the final payload - to be consumed by our dashboard API - in the `../deeplens_data` directory for the purposes of the prototype.

It is recommended that you run the `clean.sh` script located in the root directory by executing `./clean.sh`. If there are permission errors, execute `chmod +x clean.sh` to provide execution rights.

After cleaning, navigate back to the `deeplens/` directory and run `python deeplens.py`. If this is your first time running the script, it will download the dataset required for the model, which will take some time.

#### Inspecting the output
The output JSON payload will be in `./deeplens_data`, relative to the __root folder__ of the repository. These will be consumed by the dashboard API when inspecting food wastage for __flight SQ888__, which is a fictitious flight code created solely to demonstrate the integration of DeepLens data into the dashboard.


## [Dashboard prototype](https://github.com/ansonmiu0214/sia-challenge-2018/tree/master/dashboard)

This aims to simulate the serverless dashboard visualisation solution using a full-stack JavaScript web application that renders based on data fetched from our custom-defined APIs, which in turn uses the SIA /meal/upliftplan API to fetch additional metadata for the dashboard.

### Data sources
The purpose of the dashboard prototype is to illustrate this visualisation solution as well as to show how it integrates with the data collected from AWS DeepLens. 

Date | Flight No. | Description
--- | --- | ---
2018-07-20 | SQ336 | Meal data for this flight is fetched __directly__ from the provided SIA `/meal/upliftplan` API, and a large amount of sample data is generated artifically for illustrative purposes.
2018-07-20 | SQ888 | Food wastage data for this mock flight is fetched __directly__ from the machine learning inference results from the `deeplens` prototype.

### APIs
These APIs are implemented using Express.js for the prototype, but in the actual implementation, will be replaced by AWS Lambda functions mappped via an API Gateway to take advantage of the proposed serverless rchitecture.

#### GET `/api/meal/date/:date/flight/:flightCode`
Returns meal uplift plan for the flight flying on the particular date.

#### GET `/api/waste/date/:date/flight/:flightCode`
Returns meal wastage data for the flight flying on the particular date.

#### GET `/api/waste/days`
Returns food wastage per day in the current month so far.

Sample response:
```
{
  "dates": ["Jul 1", ...],
  "values: [1000, ...]
}
```

#### GET /api/waste/months
Returns food wastage per month in the current year so far.

Sample response:
```
{
  "dates": ["Jan", ...],
  "values: [1000, ...]
}
```

#### GET /api/waste/food
Returns food wastage in the current month so far by food type.

Sample response:
```
{
  "foodName": ["fish", ...],
  "values: [1000, ...]
}
```

### Folder structure

#### `public/`
Holds the frontend dashboard implemented using AngularJS.

#### `app.js`
Entry point for the Node.js application, runs the web server and connects the app with the relevant routers.

#### `src/routers`
Maps API calls to meal details and wastage details to the corresponding controllers.

#### `src/controllers`
Serves the API calls by providing JSON responses, some of which require fetching from SIA's provided APIs and others using the DeepLens data exported into local storage.

### Installation

#### Prerequites
* Node.js
* npm

#### First-time setup
1. Run `npm install` to get all dependencies

#### Running the web application
1. __Make sure no other process on your machine is listening on port 5000 - if there is such a process, kill it before proceeding.__
2. Run `npm start` to start the server. Your terminal should print "Listening on port 5000...".
3. Navigate to `localhost:5000` on your browser to use the dashboard.

At this point, you can browse the Overview and wastage data for SQ336. You will notice that an alert is shown when accessing SQ888. This is normal, as this fetches data from the DeepLens prototype. 

To experiment with the flow of integrating DeepLens with the dashboard, you may follow the steps in the Deeplens README or watch the video demo to see how it is done.
