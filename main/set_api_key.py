#!/usr/bin/env python3
import os
import sys
from dotenv import load_dotenv, set_key

def main():
    # Load existing .env file if it exists
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    load_dotenv(env_path)
    
    # Check if API key is provided as command line argument
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
    else:
        # Otherwise, prompt the user for the API key
        api_key = input("Enter your OpenAI API key: ").strip()
    
    if not api_key:
        print("Error: API key cannot be empty.")
        return
    
    # Set the API key in the .env file
    set_key(env_path, "OPENAI_API_KEY", api_key)
    print(f"API key has been set in {env_path}")
    print("You can now run the application with: python app.py")

if __name__ == "__main__":
    main()