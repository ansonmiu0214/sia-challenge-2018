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

RESNET_DIMENSIONS = (224, 224)
FLIGHT_CODE = "SQ856"
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

  image = image.resize(target)
  image.show()
  
  image = img_to_array(image)
  image = np.expand_dims(image, axis=0)
  image = imagenet_utils.preprocess_input(image)

  return image

def parseImage(path):
  image = Image.open(path)

  image = prepare_image(image, target=RESNET_DIMENSIONS)

  predictions = model.predict(image)
  results = imagenet_utils.decode_predictions(predictions)

  data = { classifier: float(confidence) for _, classifier, confidence in results[0] }

  timestamp = str(datetime.now())
  json_payload = { 
    "timestamp": timestamp,
    "flightCode": FLIGHT_CODE,
    "payload": data
  }

  basename, _ = os.path.basename(path).split('.')
  json_filename = "{}/{}.json".format(DEEPLENS_DATA_DIR, basename)
  
  with open(json_filename, 'w') as json_file:
    json.dump(json_payload, json_file, indent=4)
  
  print("Exported results for {}".format(basename))


if __name__ == "__main__":
  load_model()
  for filename in glob("{}/*.jpeg".format(SOURCE_IMAGE_DIR)):
    parseImage(filename)