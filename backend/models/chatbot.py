import os
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Read model name from environment variable
MODEL_NAME = os.getenv("MODEL_NAME", "mistralai/Mistral-7B-Instruct-v0.2")  # Default to Mistral 7B
LOCAL_MODEL_PATH = f"models/{MODEL_NAME.split('/')[-1]}"  # Save model locally

class ChatbotModel:
    def __init__(self):
        """Load model locally; download if missing"""

        if not os.path.exists(LOCAL_MODEL_PATH):
            print(f"Downloading model: {MODEL_NAME} ...")
            self.download_model()
        else:
            print(f"Loading model from: {LOCAL_MODEL_PATH}")

        # Load tokenizer & model from local storage
        self.tokenizer = AutoTokenizer.from_pretrained(LOCAL_MODEL_PATH)
        self.model = AutoModelForCausalLM.from_pretrained(
            LOCAL_MODEL_PATH, torch_dtype=torch.float16, device_map="auto"
        )

        # Set padding token to EOS if missing
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token  # Use EOS as padding token


    def download_model(self):
        """Download and save the model locally"""

        os.makedirs(LOCAL_MODEL_PATH, exist_ok=True)

        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32)
        
        tokenizer.save_pretrained(LOCAL_MODEL_PATH)
        model.save_pretrained(LOCAL_MODEL_PATH)

        print(f"Model saved at: {LOCAL_MODEL_PATH}")


    def generate_response(self, prompt, conversation_history=None, persona=None, max_new_tokens=512, temperature=0.7):
        """
        Generate a response from the model given a prompt and optional conversation history and persona.
        
        Returns:
            tuple: (response_text, updated_conversation_history)
        """
        if conversation_history is None:
            conversation_history = []

        # Use the provided persona or default to "You are a helpful assistant."
        system_message = f"System: {persona.strip()}" if persona else "System: You are a helpful assistant."

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

