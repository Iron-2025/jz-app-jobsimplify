import os
from flask import Flask, render_template, request, jsonify, flash
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev_key_for_flash_messages")

# Get OpenAI API key
api_key = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client if API key is available
client = None
if api_key:
    client = OpenAI(api_key=api_key)

@app.route('/tools/job-simplify/')
def index():
    api_key_set = bool(api_key)
    return render_template('index.html', api_key_set=api_key_set)

@app.route('/tools/job-simplify/translate', methods=['POST'])
def translate_job():
    job_description = request.form.get('job_description')
    
    if not job_description:
        return jsonify({"error": "No job description provided"}), 400
    
    # Check if OpenAI client is initialized
    if not client:
        return jsonify({
            "error": "OpenAI API key is not set. Please add your API key to the .env file."
        }), 500

    try:
        # First, validate if the input is a job description
        validation_response = client.chat.completions.create(
            model="gpt-4o-mini", # Using a faster model for validation
            messages=[
                {"role": "system", "content": "You are a validation assistant. Your task is to determine if the provided text is a job description. Respond with 'VALID' if it is a job description, and 'INVALID' if it is not. Do not provide any other explanation or text."},
                {"role": "user", "content": f"Is the following text a job description? Text: {job_description}"}
            ],
            temperature=0.0,
            max_tokens=10 
        )

        validation_result = validation_response.choices[0].message.content.strip().upper()

        if validation_result != "VALID":
            return jsonify({"error": "This is not a proper job description, please review and check the source"}), 400

        # If valid, proceed to translate the job description
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Using GPT-4o for translation
            messages=[
                {"role": "system", "content": "You are a helpful assistant that translates complex job descriptions into clear, straightforward language that job applicants can easily understand. Focus on explaining technical jargon, clarifying responsibilities, and highlighting the most important skills and qualifications."},
                {"role": "user", "content": f"Please translate this job description into simpler, more understandable language for job applicants:\n\n{job_description}"}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        translated_text = response.choices[0].message.content
        
        return jsonify({
            "original": job_description,
            "translated": translated_text
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=12000, debug=True)
