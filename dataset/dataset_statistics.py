import pandas as pd

df = pd.read_csv("emotions_dataset.csv")

print("=" * 40)
print("DATASET STATISTICS")
print("=" * 40)

print("Total Samples :", len(df))
print()

print("Emotion Counts")
print(df["emotion"].value_counts())

print()

print("Average Sentence Length")

print(df["text"].str.len().mean())

print()

print("Maximum Length")

print(df["text"].str.len().max())

print()

print("Minimum Length")

print(df["text"].str.len().min())