from pymongo import MongoClient, errors

VERWIKI_DB_NAME = "verwiki"
TREES_TABLE_NAME = "radialTrees"
LINKS_TABLE_NAME = "nodeLinks"


def get_tree_by_id(id: int) -> object:
    """
    Returns the tree with the specified ID from the database, or
    an error, which is to be handled by the caller.
    """
    try:
        client = validate_and_retrieve_client()
    except Exception as e:
        raise e  # Don't handle error here; allow it to bubble up

    output = client[VERWIKI_DB_NAME][TREES_TABLE_NAME].find_one({"id": id})
    client.close()
    if output == None:
        raise KeyError(f"No tree found with the id {id}")
    if "data" not in output:
        # We should never get this; data should be validated before entering DB!
        print("ERROR MALFORMED DATA IN DATABASE")
        raise TypeError(f"Malformed data in DB for key {id}")
    return output["data"]


def get_node_id_by_link(link: str):
    """
    Gets the associated node ID when searching by link.
    """
    try:
        client = validate_and_retrieve_client()
    except Exception as e:
        raise e
    output = client[VERWIKI_DB_NAME][LINKS_TABLE_NAME].find_one({"link": link})
    client.close()
    if not output:
        raise KeyError(f"No node found with link {link}")
    if "id" not in output:
        raise TypeError(f"Malformed data in the database for link: {link}")
    return output["id"]


def get_link_by_node_id(node_id: str):
    """
    Gets the associated wiki link, and returns it.
    """
    try:
        client = validate_and_retrieve_client()
    except Exception as e:
        raise e
    output = client[VERWIKI_DB_NAME][LINKS_TABLE_NAME].find_one({"id": node_id})
    client.close()
    if not output:
        raise KeyError(f"No link found for node {node_id}")
    if "link" not in output:
        # We should never get this; data should be validated before entering DB!
        print("ERROR MALFORMED DATA IN DATABASE")
        raise TypeError(f"Malformed data in DB for key {node_id}")
    return output["link"]


def validate_and_retrieve_client() -> MongoClient:
    """
    Function to get the MongoClient, and verify that the expected dbs and collections already exist.
    Returns a MongoClient or error if an error occurred.
    NOTE: Caller is expected to close the MongoClient when done with it.
    """
    db_names = []
    try:
        client = MongoClient("localhost", port=27017, serverSelectionTimeoutMS=1000)
        db_names = client.list_database_names()
    except errors.ServerSelectionTimeoutError:
        client.close()
        # Convert to an error that implements the python Exception class
        raise SystemError("Could not connect to DB in time")

    if VERWIKI_DB_NAME not in db_names:
        client.close()
        raise SystemError(
            VERWIKI_DB_NAME
            + " DB not found; if you are developing locally, \
        init db and data by running repopulate_db.py"
        )

    verwikiDB = client[VERWIKI_DB_NAME]
    if TREES_TABLE_NAME not in verwikiDB.collection_names():
        client.close()
        raise SystemError(
            TREES_TABLE_NAME
            + " collection not found; if you are developing locally, \
            init collections and data by running repopulate_db.py"
        )
    return client


if __name__ == "__main__":
    pass
