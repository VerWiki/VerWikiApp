import pytest
from unittest.mock import Mock, MagicMock
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pymongo import errors
import db_interface
from db_interface import (
    VERWIKI_DB_NAME,
    TREES_TABLE_NAME,
    LINKS_TABLE_NAME,
    get_tree_by_id,
    validate_and_retrieve_client,
    get_link_by_node_id,
    get_node_id_by_link,
    Utils,
)

sys.modules[
    "pymongo.MongoClient"
] = MagicMock()  # Mock out the pymongo dependency in db_interface


class TestUtilsAddChildCounts:
    def test_add_child_counts(self):
        tree1 = {
            "id": 1,
            "data": {"name": "Root", "children": [{"name": "Front", "children": []}]},
        }
        expected_output = {
            "name": "Root",
            "children": [{"name": "Front", "children": [], "numChildren": 0}],
            "numChildren": 1,
        }
        output = Utils.add_child_counts(tree1["data"])
        assert output == expected_output

    def test_add_child_counts_no_children_key(self):
        tree1 = {"name": "Root"}
        assert Utils.add_child_counts(tree1) == {"name": "Root", "numChildren": 0}


class TestPrettyPrinter:
    def test_pretty_printers(self):
        tree1 = {
            "id": 1,
            "data": {"name": "Root", "children": [{"name": "Front", "children": []}]},
        }
        assert Utils.pretty_printer(tree1) == None


class TestValidateAndRetrieveClient:
    def test_validate_and_retrieve_client_db_and_collection_exist(self):
        db_interface.MongoClient = MagicMock()
        client = MagicMock()
        mockVerwikiClient = MagicMock()

        db_interface.MongoClient.return_value = client
        client.list_database_names.return_value = [VERWIKI_DB_NAME]

        client.__getitem__.return_value = mockVerwikiClient
        mockVerwikiClient.collection_names.return_value = [TREES_TABLE_NAME]

        assert validate_and_retrieve_client() == client

    def test_validate_and_retrieve_client_db_not_exist(self):
        db_interface.MongoClient = MagicMock()
        client = MagicMock()

        db_interface.MongoClient.return_value = client
        client.list_database_names.return_value = []
        with pytest.raises(SystemError):  # Check that a SystemError is raised
            validate_and_retrieve_client()

    def test_validate_and_retrieve_client_db_conn_err(self):
        db_interface.MongoClient = MagicMock()
        client = MagicMock()

        db_interface.MongoClient.return_value = client
        client.list_database_names.side_effect = errors.ServerSelectionTimeoutError()
        with pytest.raises(SystemError):  # Check that a SystemError is raised
            validate_and_retrieve_client()

    def test_validate_and_retrieve_client_db_exist_collection_not(self):
        db_interface.MongoClient = MagicMock()
        client = MagicMock()
        mockVerwikiClient = MagicMock()

        db_interface.MongoClient.return_value = client
        client.list_database_names.return_value = [VERWIKI_DB_NAME]
        client.__getitem__.return_value = mockVerwikiClient
        # Simulate the case that the trees table doesn't exist in the db
        mockVerwikiClient.collection_names.return_value = []

        with pytest.raises(SystemError):
            validate_and_retrieve_client()


class TestGetLinkByNodeID:
    def test_get_link_by_id_exists_in_db(self):
        db_interface.validate_and_retrieve_client = Mock()
        client = MagicMock()
        client.close.return_value = None
        db_interface.validate_and_retrieve_client.return_value = client
        client[VERWIKI_DB_NAME][LINKS_TABLE_NAME].find_one.return_value = {
            "link": "https://mapleleafs.nhl.com"
        }

        assert get_link_by_node_id("leafs") == "https://mapleleafs.nhl.com"

    def test_get_link_by_id_validate_returns_err(self):
        db_interface.validate_and_retrieve_client = Mock()
        client = MagicMock()
        client.close.return_value = None
        db_interface.validate_and_retrieve_client.side_effect = SystemError(
            Mock(status=500), "System Error"
        )
        with pytest.raises(SystemError):
            get_link_by_node_id("leafs")

    def test_get_link_by_id_not_in_db(self):
        db_interface.validate_and_retrieve_client = Mock()
        client = MagicMock()
        client.close.return_value = None
        db_interface.validate_and_retrieve_client.return_value = client
        client[VERWIKI_DB_NAME][LINKS_TABLE_NAME].find_one.return_value = None

        with pytest.raises(KeyError):
            get_link_by_node_id("leafs")

    def test_get_link_by_id_malformed_data(self):

        db_interface.validate_and_retrieve_client = Mock()
        client = MagicMock()
        client.close.return_value = None
        db_interface.validate_and_retrieve_client.return_value = client
        client[VERWIKI_DB_NAME][LINKS_TABLE_NAME].find_one.return_value = {
            "wrongKey": "https://mapleleafs.nhl.com"
        }

        with pytest.raises(TypeError):
            get_link_by_node_id("leafs")


class TestGetNodeIDByLink:
    def test_get_nodeid_by_link_exists_in_db(self):
        db_interface.validate_and_retrieve_client = Mock()
        client = MagicMock()
        client.close.return_value = None
        db_interface.validate_and_retrieve_client.return_value = client
        client[VERWIKI_DB_NAME][LINKS_TABLE_NAME].find_one.return_value = {
            "id": "leafs"
        }

        assert get_node_id_by_link("https://mapleleafs.nhl.com") == "leafs"

    def test_get_nodeid_by_link_validate_returns_err(self):
        db_interface.validate_and_retrieve_client = Mock()
        client = MagicMock()
        client.close.return_value = None
        db_interface.validate_and_retrieve_client.side_effect = SystemError(
            Mock(status=500), "System Error"
        )
        with pytest.raises(SystemError):
            get_node_id_by_link("https://mapleleafs.nhl.com")

    def test_get_nodeid_by_link_not_in_db(self):
        db_interface.validate_and_retrieve_client = Mock()
        client = MagicMock()
        client.close.return_value = None
        db_interface.validate_and_retrieve_client.return_value = client
        client[VERWIKI_DB_NAME][LINKS_TABLE_NAME].find_one.return_value = None

        with pytest.raises(KeyError):
            get_node_id_by_link("https://mapleleafs.nhl.com")

    def test_get_nodeid_by_link_malformed_data(self):
        db_interface.validate_and_retrieve_client = Mock()
        client = MagicMock()
        client.close.return_value = None
        db_interface.validate_and_retrieve_client.return_value = client
        client[VERWIKI_DB_NAME][LINKS_TABLE_NAME].find_one.return_value = {
            "ide": "leafs"
        }
        with pytest.raises(TypeError):
            get_node_id_by_link("https://mapleleafs.nhl.com")


class TestGetTreeByID:
    def test_get_tree_by_id_exists_in_db(self):
        db_interface.validate_and_retrieve_client = Mock()
        client = MagicMock()
        client.close.return_value = None
        db_interface.validate_and_retrieve_client.return_value = client
        mock_tree = {"children": []}
        client[VERWIKI_DB_NAME][TREES_TABLE_NAME].find_one.return_value = {
            "data": mock_tree
        }

        assert get_tree_by_id(1) == mock_tree

    def test_get_tree_by_id_validate_returns_err(self):
        db_interface.validate_and_retrieve_client = Mock()
        client = MagicMock()
        client.close.return_value = None
        db_interface.validate_and_retrieve_client.side_effect = SystemError(
            Mock(status=500), "System Error"
        )
        with pytest.raises(SystemError):
            get_tree_by_id(1)

    def test_get_tree_by_id_not_in_db(self):
        db_interface.validate_and_retrieve_client = Mock()
        client = MagicMock()
        client.close.return_value = None
        db_interface.validate_and_retrieve_client.return_value = client
        client[VERWIKI_DB_NAME][TREES_TABLE_NAME].find_one.return_value = None

        with pytest.raises(KeyError):
            get_tree_by_id(1)

    def test_get_tree_by_id_malformed_data(self):
        db_interface.validate_and_retrieve_client = Mock()
        client = MagicMock()
        client.close.return_value = None
        db_interface.validate_and_retrieve_client.return_value = client
        client[VERWIKI_DB_NAME][TREES_TABLE_NAME].find_one.return_value = {
            "noDataKey": 96
        }

        with pytest.raises(TypeError):
            get_tree_by_id(1)


if __name__ == "__main__":
    pass
