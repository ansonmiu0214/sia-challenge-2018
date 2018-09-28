# DeepLens Prototype

## Installation

### Prerequisites
* `python` 
* `pip`
* `virtualenv`

### First-time setup
1. Make sure you are in the `deeplens/` directory.
2. `virtualenv venv` to create the virtual environment.
3. Run `source venv/bin/activate` to activate the virtual environment. Your shell name will now be prefixed with `(venv)`.
4. Run `pip install -r requirements.txt` to install the dependencies listed in `requirements.txt`.

To run the Python script, execute `python main.py`.
To exit the virtual environment, run `deactivate`.

### Running the inference script
The `deeplens.py` script will run the machine learning inference on the images in the `../source_images` directory.

The payload from the above script is handled by `aws_lambda.py`, which computes the relative proportion of food wastage and outputs the final payload - to be consumed by our dashboard API - in the `../deeplens_data` directory for the purposes of the prototype.

It is recommended that you run the `clean.sh` script located in the root directory by executing `./clean.sh`. If there are permission errors, execute `chmod +x clean.sh` to provide execution rights.

After cleaning, navigate back to the `deeplens/` directory and run `python deeplens.py`. If this is your first time running the script, it will download the dataset required for the model, which will take some time.
