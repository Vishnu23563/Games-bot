from flask import Flask, request, jsonify
import numpy as np
from model import load_model, predict_action

app = Flask(__name__)

# Load the pre-trained model
model = load_model('models/model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = np.array(data['features']).reshape(1, -1)
    action = predict_action(model, features)
    return jsonify({'action': action})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True)