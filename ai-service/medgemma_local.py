from transformers import pipeline
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize model pipeline with error handling
try:
    pipe = pipeline(
        "text-generation",
        model="google/medgemma-1.5-4b-it",
        torch_dtype=torch.bfloat16,
        device="cuda" if torch.cuda.is_available() else "cpu",
    )
    logger.info("MedGemma model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    pipe = None

@app.route('/chat', methods=['POST'])
def chat():
    try:
        if not pipe:
            return jsonify({"error": "Model not available"}), 503
            
        data = request.json
        if not data or not data.get('message'):
            return jsonify({"error": "Message required"}), 400
            
        message = data.get('message', '')
        
        prompt = f"You are a helpful AI assistant for children with special needs. Question: {message}"
        
        output = pipe(prompt, max_new_tokens=200, temperature=0.7, do_sample=True)
        response = output[0]['generated_text'].replace(prompt, '').strip()
        return jsonify({'response': response})
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)