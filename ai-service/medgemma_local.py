from transformers import pipeline
import torch
from flask import Flask, request, jsonify

app = Flask(__name__)

pipe = pipeline(
    "text-generation",
    model="google/medgemma-1.5-4b-it",
    torch_dtype=torch.bfloat16,
    device="cuda" if torch.cuda.is_available() else "cpu",
)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    
    prompt = f"You are a helpful AI assistant for children with special needs. Question: {message}"
    
    try:
        output = pipe(prompt, max_new_tokens=200, temperature=0.7, do_sample=True)
        response = output[0]['generated_text'].replace(prompt, '').strip()
        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)