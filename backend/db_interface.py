from pymongo import MongoClient, errors

VERWIKI_DB_NAME = 'verwiki'
TREES_TABLE_NAME = "radialTrees"

def get_tree_by_id(id: int) -> object:
    """
    Returns the tree with the specified ID from the database, or 
    an error, which is to be handled by the caller.
    """
    try:
        client = validate_and_retrieve_client()
    except Exception as e:
        raise e # Don't handle error here; allow it to bubble up

    output = client[VERWIKI_DB_NAME][TREES_TABLE_NAME].find_one({"id": id})
    client.close()
    if output == None:
        raise KeyError("No tree found with the id " + str(id))
    if 'data' not in output: # We should never get this; data should be validated before entering DB!
        print("ERROR MALFORMED DATA IN DATABASE")
        raise TypeError("Malformed data in DB for key " + str(id))
    return output['data']


def validate_and_retrieve_client() -> MongoClient:
    """
    Function to get the MongoClient, and verify that the expected dbs and collections already exist.
    Returns a MongoClient or error if an error occurred.
    NOTE: Caller is expected to close the MongoClient when done with it.
    """
    db_names = []
    try:
        client = MongoClient('localhost', port=27017, serverSelectionTimeoutMS=1000)
        db_names = client.list_database_names()
    except errors.ServerSelectionTimeoutError:
        print ("CONNECTION TIMEOUT TO DB")
        client.close()
        raise SystemError("Could not connect to DB in time")

    if VERWIKI_DB_NAME not in db_names:
        client.close()
        raise SystemError(VERWIKI_DB_NAME + " DB not found; if you are developing locally, \
        init db and data by running repopulate_db.py")
    
    verwikiDB = client[VERWIKI_DB_NAME]
    if TREES_TABLE_NAME not in verwikiDB.collection_names():
        client.close()
        raise SystemError(TREES_TABLE_NAME + " collection not found; if you are developing locally, \
            init collections and data by running repopulate_db.py")
    return client




if __name__ == "__main__":
    get_tree_by_id(1)