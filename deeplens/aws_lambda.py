"""
TODO introduction
"""

from datetime import datetime
import simplejson as json
import os

DEEPLENS_DATA_DIR = "../deeplens_data"
def process_deeplens_payload(data, flightDate, flightCode, basename):
  # calculate percentage
  totalSize = data['totalWastage']
  wastage = data['wastage']
  mealCode = data['mealCode']

  for food in wastage:
    food['percentage'] = float(food['boundingRectangleArea']) / totalSize
    del food['boundingRectangleArea']

  # format payload
  json_payload = {
    'timestamp': str(datetime.now()),
    'mealCode': mealCode,
    'wastage': wastage
  }

  # write to file
  date_path = "{}/{}".format(DEEPLENS_DATA_DIR, flightDate)
  flight_path = "{}/{}".format(date_path, flightCode)

  if not os.path.exists(date_path):
    os.mkdir(date_path)

  if not os.path.exists(flight_path):
    os.mkdir(flight_path)

  json_filename = "{}/{}.json".format(flight_path, basename)
  with open(json_filename, 'w') as json_file:
    json.dump(json_payload, json_file, indent=4)