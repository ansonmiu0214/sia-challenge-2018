"""
TODO introduction
"""

from keras.applications import ResNet50
# from keras.applications import VGG16
from keras.applications import imagenet_utils
from keras.preprocessing.image import img_to_array
from keras.models import model_from_json
from PIL import Image
import numpy as np
import simplejson as json
from glob import glob
from datetime import datetime
import os
from random import randint
import aws_lambda

RESNET_DIMENSIONS = (224, 224)
MOCK_FLIGHT_DATE = "2018-07-20"
MOCK_FLIGHT_CODE = "SQ888"

SOURCE_IMAGE_DIR = "../source_images"
DEEPLENS_DATA_DIR = "../deeplens_data"

def load_model():
  global model
  model = ResNet50(weights="imagenet")
  # model = VGG16(weights="imagenet", include_top=False)
  print("Model loaded")
  
def prepare_image(image, target):
  if image.mode != "RGB":
    image = image.convert("RGB")

  # resize to fit dimensions
  image = image.resize(target)
  image = img_to_array(image)
  image = np.expand_dims(image, axis=0)
  image = imagenet_utils.preprocess_input(image)

  return image

def parseImage(path):
  image = Image.open(path)

  # prepare the image for inference
  image = prepare_image(image, target=RESNET_DIMENSIONS)

  # run inference and decode results
  predictions = model.predict(image)
  results = imagenet_utils.decode_predictions(predictions)

  # mock the bounding rectangle by randomising the sizes
  food_item_count = len(results[0])
  rect_areas = [randint(1, 20) for _ in range(food_item_count)]

  data = [
    {
      'foodName': classifier,
      'confidence': float(confidence),
      'boundingRectangleArea': float(rect_areas[idx])
    }
    for idx, (_, classifier, confidence) in enumerate(results[0])
  ]

  # format payload for processing by lambda
  # need data on total wastage in order to compute relative proportions
  payload = {
    'wastage': data,
    'totalWastage': sum(rect_areas),
    'mealCode': 'S001'
  }

  # delegate to lambda function for processing and exporting payload
  basename, _ = os.path.basename(path).split('.')
  aws_lambda.process_deeplens_payload(payload, MOCK_FLIGHT_DATE, MOCK_FLIGHT_CODE, basename)

  print("Exported results for {}".format(basename))  


if __name__ == "__main__":
  load_model()
  for filename in glob("{}/*.jpeg".format(SOURCE_IMAGE_DIR)):
    parseImage(filename)

  print("Completed.")
