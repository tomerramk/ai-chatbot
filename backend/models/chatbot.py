import os
import sys
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from config.config import PERSONALITIES

# Check if running as a PyInstaller executable
IS_EXE = hasattr(sys, "_MEIPASS")

class ChatbotModel:
    def __init__(self):
        """Handle model loading differently based on execution mode"""

        if IS_EXE:
            # Running as an EXE – prompt for model name and access token
            self.model_name = input("Enter the model name (e.g., mistralai/Mistral-7B-Instruct-v0.2): ").strip()
            access_token = input("Enter your Hugging Face access token: ").strip()
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, token=access_token)
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name, torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32, token=access_token
            )
        else:
            # Running normally – check backend/models and download if missing
            self.model_name = os.getenv("MODEL_NAME")
            if not self.model_name:
                self.model_name = input("Enter the model name (e.g., mistralai/Mistral-7B-Instruct-v0.2): ").strip()

            self.local_model_path = f"models/{self.model_name.split('/')[-1]}"

            if not os.path.exists(self.local_model_path):
                print(f"Downloading model: {self.model_name} ...")
                self.download_model()
            else:
                print(f"Loading model from: {self.local_model_path}")

            # Load tokenizer & model from local storage
            self.tokenizer = AutoTokenizer.from_pretrained(self.local_model_path)
            self.model = AutoModelForCausalLM.from_pretrained(
                self.local_model_path, torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
            )

    def download_model(self):
        """Download and save the model locally"""
        os.makedirs(self.local_model_path, exist_ok=True)
        tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        model = AutoModelForCausalLM.from_pretrained(self.model_name, torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32)
        
        tokenizer.save_pretrained(self.local_model_path)
        model.save_pretrained(self.local_model_path)

        print(f"Model saved at: {self.local_model_path}")

    def generate_response(self, prompt, conversation_history=None, persona=None, max_new_tokens=512, temperature=0.7):
        """
        Generate a response from the model given a prompt and optional conversation history and persona.
        
        Returns:
            tuple: (response_text, updated_conversation_history)
        """
        if conversation_history is None:
            conversation_history = []

        # Use the provided persona or default to "You are a helpful assistant."
        system_message = f"System: {PERSONALITIES.get(persona, PERSONALITIES['default'])}"

        # Construct the full conversation history
        full_prompt = system_message + "\n\n"
        for user_msg, assistant_msg in conversation_history:
            full_prompt += f"User: {user_msg}\nAssistant: {assistant_msg}\n"

        # Add the current user input
        full_prompt += f"User: {prompt}\nAssistant:"

        # Tokenize the full prompt
        inputs = self.tokenizer(full_prompt, return_tensors="pt", truncation=True, max_length=4096).to(self.model.device)

        # Generate response
        with torch.no_grad():
            output = self.model.generate(
                inputs["input_ids"],
                attention_mask=inputs["attention_mask"],
                max_new_tokens=max_new_tokens,
                temperature=temperature,
                do_sample=temperature > 0,
                pad_token_id=self.tokenizer.pad_token_id
            )

        # Decode the response and clean it up
        response_ids = output[0][inputs["input_ids"].shape[1]:]
        response = self.tokenizer.decode(response_ids, skip_special_tokens=True).strip()

        # Ensure it does not continue generating additional questions
        response = response.split("\nUser:")[0].strip()

        conversation_history.append((prompt, response))

        return response, conversation_history  # Return response + updated history

