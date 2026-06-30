CRISIS_KEYWORDS = [

    "kill myself",
    "suicide",
    "end my life",
    "don't want to live",
    "want to die",
    "die",
    "self harm",
    "self-harm",
    "hopeless",
    "no reason to live",
    "better off dead",
    "i give up",
    "i can't go on",
    "i want to disappear",
    "hurt myself"

]


def detect_crisis(text):

    text = text.lower()

    for keyword in CRISIS_KEYWORDS:

        if keyword in text:
            return True

    return False