from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

db = client["mental_health_ai"]

collection = db["daily_checkins"]