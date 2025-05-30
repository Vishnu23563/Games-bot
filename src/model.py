import joblib
import numpy as np

def load_model(path):
    return joblib.load(path)

def predict_action(model, features):
    # Replace with your model's prediction logic
    prediction = model.predict(features)
    return int(prediction[0])