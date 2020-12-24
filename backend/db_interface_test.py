import pytest
from unittest.mock import Mock, MagicMock
import sys

sys.modules["pymongo"] = MagicMock()  # Mock out the pymongo dependency in db_interface
import db_interface
from db_interface import (
    VERWIKI_DB_NAME,
    TREES_TABLE_NAME,
    get_tree_by_id,
    validate_and_retrieve_client,
)


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
