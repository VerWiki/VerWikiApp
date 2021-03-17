from pymongo import MongoClient, errors

VERWIKI_DB_NAME = "verwiki"
TREES_TABLE_NAME = "radialTrees"
LINKS_TABLE_NAME = "nodeLinks"


class Utils:
    @staticmethod
    def add_child_counts(tree: object) -> object:
        """
        Recursive function to add the numChildren field of each node in the tree.
        tree: The "data" field of the tree (not the entire tree itself).
        returns the updated tree.
        """
        children = tree.get("children", [])
        tree["numChildren"] = len(children)
        for i, child in enumerate(children):
            subtree = Utils.add_child_counts(child)
            tree["children"][i] = subtree
        return tree

    @staticmethod
    def pretty_printer(d: object, indent: int = 0):
        """
        Prints a python dictionary in a readable fashion.
        d = python dictionary to print.
        indent = how much to indent the children in each level.
        """
        for key, value in d.items():
            print("\t" * indent + str(key))
            if isinstance(value, dict):
                Utils.pretty_printer(value, indent + 1)
            else:
                print("\t" * (indent + 1) + str(value))


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


## TODO THIS FUNCTION IS DEPRECATED TO BE REMOVED 
def get_link_by_node_id(node_id: str) -> str:
    """
    Gets the associated wiki link for the given node ID, and returns it.
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
