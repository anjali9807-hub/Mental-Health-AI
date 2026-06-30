import os
print("1. Starting predict.py")

from transformers import AutoTokenizer, AutoModelForSequenceClassification
print("2. Transformers imported")

import torch
print("3. Torch imported")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "bert_emotion_model")

print("4. Model path:", MODEL_PATH)

print("5. Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
print("6. Tokenizer loaded")

print("7. Loading model...")
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
print("8. Model loaded")

labels = [
    "sadness",
    "joy",
    "love",
    "anger",
    "fear",
    "surprise"
]

def predict_emotion(text):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True
    )

    with torch.no_grad():
        outputs = model(**inputs)

    prediction = torch.argmax(outputs.logits, dim=1)

    return labels[prediction.item()]

if __name__ == "__main__":
    print("Prediction:", predict_emotion("I am very happy today"))