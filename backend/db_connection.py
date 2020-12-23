from pymongo import MongoClient #pip3 install pymongo

# Connect to a mongoDB instance running locally on the default port 27017 (must be already running locally)
connection = MongoClient('localhost', 27017)
# Select the verwikiDB (creates it if not already existing)
verwikiDB = connection['verwiki']

#python3 -m pip install -r requirements.txt