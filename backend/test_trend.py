from trend import predict_trend

history = [75, 72, 70, 68, 65, 63, 60]

prediction = predict_trend(history)

print("Predicted Mood Score:", prediction)