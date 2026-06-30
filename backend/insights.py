def generate_insight(history):

    if not history:
        return "No mood history available."

    latest = history[-1]

    emotion = latest.get("emotion", "")

    trend = latest.get("trend", 0)

    if emotion == "joy" and trend >= 7:
        return (
            "Your recent mood looks positive. "
            "Keep maintaining the healthy habits that are helping you."
        )

    elif emotion == "sadness":
        return (
            "You've recently expressed sadness. "
            "Consider taking a short break, talking to someone you trust, "
            "or doing an activity you enjoy."
        )

    elif emotion == "anger":
        return (
            "Recent moods indicate anger. "
            "Deep breathing or a short walk may help reduce stress."
        )

    elif emotion == "fear":
        return (
            "You seem to be feeling anxious recently. "
            "Try focusing on one task at a time and practice relaxation."
        )

    elif emotion == "love":
        return (
            "Positive relationships appear to be contributing to your mood."
        )

    elif emotion == "surprise":
        return (
            "Unexpected events can affect emotions. "
            "Take a moment to reflect before reacting."
        )

    return "Keep tracking your moods to receive more personalized insights."