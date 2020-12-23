from db_connection import verwikiDB


def get_tree_by_id(id: int) -> object:
    """
    Returns the tree with the specified ID from the database, or 
    {} if there is no tree with the specified ID.
    """

    output = verwikiDB.radialTrees.find_one({"id": id})
    if output == None:
        return {}
    return output['data']

if __name__ == "__main__":
    get_tree_by_id(1)