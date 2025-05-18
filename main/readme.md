# Job Description Translator

A Flask web application that translates complex job descriptions into simpler, more understandable language for job applicants using OpenAI's GPT models.

## Features

- Paste any job description into the web interface
- Get a simplified, jargon-free translation that explains the role clearly
- Responsive design that works on desktop and mobile devices

## Setup

1. Clone this repository
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Set your OpenAI API key using the provided script:
   ```
   python set_api_key.py YOUR_API_KEY
   ```
   Or run the script without arguments to be prompted for the key:
   ```
   python set_api_key.py
   ```
5. Run the application:
   ```
   python app.py
   ```
   Or use the provided shell script:
   ```
   ./run.sh
   ```
6. Open your browser and navigate to `http://localhost:12000`

## Running with Docker

This application can also be run using Docker and Docker Compose.

**Prerequisites:**
- Docker installed and running on your system.
- Docker Compose installed (usually comes with Docker Desktop).

**Steps:**

1.  **Ensure your OpenAI API Key is in `.env` file:**
    Make sure you have a `.env` file in the `job-ad/jz-app-jobad` directory with your OpenAI API key:
    ```
    OPENAI_API_KEY=your_openai_api_key_here
    SECRET_KEY=your_secret_key_here # Optional: for Flask flash messages, a default is used if not set
    ```
    The `set_api_key.py` script creates/updates this file. If you ran it previously, your API key should already be there.

2.  **Build and run the application using Docker Compose:**
    Navigate to the `job-ad/jz-app-jobad` directory (where `docker-compose.yml` is located) in your terminal and run:
    ```bash
    docker-compose up --build
    ```
    - The `--build` flag ensures the Docker image is built (or rebuilt if changes were made).
    - Docker Compose will start the `web` service defined in `docker-compose.yml`.

3.  **Access the application:**
    Once the containers are running, open your browser and navigate to `http://localhost:12000`.

4.  **To stop the application:**
    Press `Ctrl+C` in the terminal where `docker-compose up` is running. To remove the containers, you can run:
    ```bash
    docker-compose down
    ```

## Testing with Sample Data

A sample job description is included in the repository for testing purposes. To test the application with this sample:

1. Make sure the application is running in one terminal
2. In another terminal, run:
   ```
   python test_with_sample.py
   ```
   This will send the sample job description to the API and display the translated result.

## Technologies Used

- Flask: Web framework
- OpenAI API: For translating job descriptions
- Bootstrap: For responsive UI
- JavaScript: For handling form submissions and displaying results

## License

MIT
