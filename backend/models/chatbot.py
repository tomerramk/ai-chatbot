import os
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from config.config import PERSONALITIES
from utils.get_arg_value import get_arg_value

class ChatbotModel:
    def __init__(self):
        """Handle model loading"""

        self.model_name = get_arg_value('model', "Enter the model name (e.g., mistralai/Mistral-7B-Instruct-v0.2): ", "MODEL_NAME").strip()
        self.access_token = get_arg_value('token', "Enter your Hugging Face access token: ", "HF_ACCESS_TOKEN").strip()

        self.local_model_path = f"models/{self.model_name.split('/')[-1]}"

        if not os.path.exists(self.local_model_path):
            print(f"Downloading model: {self.model_name} ...")
            self.download_model()
        else:
            print(f"Loading model from: {self.local_model_path}")

        # Load tokenizer and model from the local cache
        self.tokenizer = AutoTokenizer.from_pretrained(self.local_model_path, token=self.access_token, cache_dir=self.local_model_path)
        self.model = AutoModelForCausalLM.from_pretrained(
            self.local_model_path, token=self.access_token, cache_dir=self.local_model_path, torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
        )

    def download_model(self):
        """Download and save the model locally"""

        os.makedirs(self.local_model_path, exist_ok=True)

        # Download tokenizer and model
        tokenizer = AutoTokenizer.from_pretrained(self.model_name, token=self.access_token, cache_dir=self.local_model_path)
        model = AutoModelForCausalLM.from_pretrained(self.model_name, token=self.access_token,  cache_dir=self.local_model_path, torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32)
        
        tokenizer.save_pretrained(self.local_model_path)
        model.save_pretrained(self.local_model_path)

        print(f"Model saved at: {self.local_model_path}")

    def generate_response(self, prompt, conversation_history=None, persona=None, max_new_tokens=512, temperature=0.7):
        """
        Generate a response from the model given a prompt and optional conversation history and persona.
        
        Parameters:
            prompt (str): The input text for the model to respond to.
            conversation_history (list): Optional list of past (user_input, assistant_response) pairs.
            persona (str): Optional persona to customize the model's behavior.
            max_new_tokens (int): The maximum number of new tokens to generate in response.
            temperature (float): Controls randomness of output (higher = more random).

        Returns:
            tuple: (response_text, updated_conversation_history)
        """

        if conversation_history is None:
            conversation_history = []

        system_message = f"System: {PERSONALITIES.get(persona, PERSONALITIES['default'])}"

        full_prompt = system_message + "\n\n"
        for user_msg, assistant_msg in conversation_history:
            full_prompt += f"User: {user_msg}\nAssistant: {assistant_msg}\n"

        full_prompt += f"User: {prompt}\nAssistant:"

        inputs = self.tokenizer(full_prompt, return_tensors="pt", truncation=True, max_length=4096).to(self.model.device)

        with torch.no_grad():
            output = self.model.generate(
                inputs["input_ids"],
                attention_mask=inputs["attention_mask"],
                max_new_tokens=max_new_tokens,
                temperature=temperature,
                do_sample=temperature > 0,
                pad_token_id=self.tokenizer.pad_token_id
            )

        response_ids = output[0][inputs["input_ids"].shape[1]:]
        response = self.tokenizer.decode(response_ids, skip_special_tokens=True).strip()

        response = response.split("\nUser:")[0].strip()

        conversation_history.append((prompt, response))

        return response, conversation_history

