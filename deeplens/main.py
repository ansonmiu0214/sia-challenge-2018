from keras.applications import ResNet50
# from keras.applications import VGG16
from keras.applications import imagenet_utils
from keras.preprocessing.image import img_to_array
from keras.models import model_from_json
from PIL import Image
import numpy as np
import io

def load_model():
  global model
  model = ResNet50(weights="imagenet")
  # model = VGG16(weights="imagenet", include_top=False)
  print("Model loaded")
  
def prepare_image(image, target):
  if image.mode != "RGB":
    image = image.convert("RGB")

  image = image.resize(target)
  image = img_to_array(image)
  image = np.expand_dims(image, axis=0)
  image = imagenet_utils.preprocess_input(image)

  return image
  

if __name__ == "__main__":
  load_model()
  image = Image.open("food3.jpeg")

  image = prepare_image(image, target=(224, 224))

  preds = model.predict(image)
  results = imagenet_utils.decode_predictions(preds)

  for idx, classifier, confidence in results[0]:
    print("{}: {}".format(classifier, confidence))