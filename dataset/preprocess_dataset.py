import pandas as pd

print("Loading dataset...")

df = pd.read_csv("emotions_dataset.csv")

print("Original Shape:", df.shape)

# Remove duplicates
df = df.drop_duplicates()

# Remove missing values
df = df.dropna()

# Convert to lowercase
df["text"] = df["text"].str.lower()

print("Cleaned Shape:", df.shape)

df.to_csv("clean_emotions_dataset.csv", index=False)

print("Dataset cleaned successfully.")