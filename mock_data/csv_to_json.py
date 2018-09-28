from random import randint
from datetime import datetime
import csv
import os
import json
from glob import glob

FLIGHT_DATE = '2018-07-20'
FLIGHT_CODE = 'SQ336'

if __name__ == "__main__":
  if not os.path.exists(FLIGHT_DATE):
    os.mkdir(FLIGHT_DATE)

  json_dir = FLIGHT_DATE + '/' + FLIGHT_CODE
  if not os.path.exists(json_dir):
    os.mkdir(json_dir)

  for filename in glob("*.csv"):
    with open(filename, newline='', encoding='utf-8-sig') as csvfile:
      [_, *food], *rest = csv.reader(csvfile, delimiter=',')
      
      food_count = len(food)
      for mealNo, (mealCode, *sizes) in enumerate(rest):
        total_size = sum(map(int, sizes))

        payload = {
          'timestamp': str(datetime.now()),
          'mealCode': mealCode,
          'wastage': [
            {
              'foodName': food[idx], 
              'confidence': float(randint(60, 99)) / 100,
              'percentage': float(sizes[idx]) / total_size
            }
            for idx in range(food_count)
          ]
        }
        
        json_filename = "{}/{}-{}.json".format(json_dir, mealCode, mealNo)
        with open(json_filename, 'w') as json_file:
          json.dump(payload, json_file, indent=4)