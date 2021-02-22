from pymongo import MongoClient, errors
import uuid
from typing import Tuple

VERWIKI_DB_NAME = "verwiki"
TREES_TABLE_NAME = "radialTrees"
LINKS_TABLE_NAME = "nodeLinks"


def temp_add_node_links(tree: dict) -> dict:
    """
    TEMPORARY - adds links as a sibling field to name.
    Should enable clicking on every node to open up a link.
    """
    tree[
        "link"
    ] = "https://cwsl.ca/wiki/doku.php?id=wisdom_perspectival_and_participatory_knowing"
    if "children" in tree and len(tree["children"]) != 0:
        for i, child in enumerate(tree["children"]):
            tree["children"][i] = temp_add_node_links(child)
    return tree


def create_node_ids(tree: dict) -> tuple:
    """
    For each node within the tree, adds a UID, and creates a relation
    between links and nodes.
    ASSUMPTION - The tree structure would have a `link` subfield
    at the same level as `name` subfield.
    """
    node_link_relation = []
    uid = str(uuid.uuid4())
    node_link_relation.append({"uid": uid, "link": tree["link"]})
    tree["uid"] = uid
    if "children" in tree and len(tree["children"]) != 0:
        for i, child in enumerate(tree["children"]):
            subtree, node_link_rel = create_node_ids(child)
            tree["children"][i] = subtree
            node_link_relation.extend(node_link_rel)
    return tree, node_link_relation


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
