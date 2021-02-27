from flask import Flask
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import server
import json
from unittest.mock import Mock


def test_base_route():
    app = Flask(__name__)
    client = app.test_client()
    server.configure_routes(app)
    url = "/"

    response = client.get(url)
    print(response.get_data())
    assert response.get_data() == b"Hello World!"
    assert response.status_code == 200


class TestGetTreeByIDRoute:
    def test_get_tree_by_id_exists(self):
        app = Flask(__name__)
        client = app.test_client()
        server.configure_routes(app)
        url = "/get-tree-by-id/1"

        fake_tree = {"children": []}
        server.db_interface.get_tree_by_id = Mock()
        server.db_interface.get_tree_by_id.return_value = fake_tree
        response = client.get(url)
        assert response.status_code == 200
        assert response.json == fake_tree

    def test_get_tree_by_id_db_returns_key_error(self):
        app = Flask(__name__)
        client = app.test_client()
        server.configure_routes(app)
        url = "/get-tree-by-id/1"

        server.db_interface.get_tree_by_id = Mock()
        server.db_interface.get_tree_by_id.side_effect = KeyError(
            Mock(status=404), "not found"
        )
        response = client.get(url)
        assert response.status_code == 404

    def test_get_tree_by_id_db_returns_type_error(self):
        app = Flask(__name__)
        client = app.test_client()
        server.configure_routes(app)
        url = "/get-tree-by-id/1"

        server.db_interface.get_tree_by_id = Mock()
        server.db_interface.get_tree_by_id.side_effect = TypeError(
            Mock(status=500), "Type Error"
        )
        response = client.get(url)
        assert response.status_code == 500

    def test_get_tree_by_id_db_returns_system_error(self):
        app = Flask(__name__)
        client = app.test_client()
        server.configure_routes(app)
        url = "/get-tree-by-id/1"

        server.db_interface.get_tree_by_id = Mock()
        server.db_interface.get_tree_by_id.side_effect = SystemError(
            Mock(status=500), "System Error"
        )
        response = client.get(url)
        assert response.status_code == 500


class TestGetNodeInfo:
    def test_get_node_info_exists(self):
        app = Flask(__name__)
        client = app.test_client()
        server.configure_routes(app)
        url = "/get-node-info/leafs"

        fake_link = {"link": "https://mapleleafs.nhl.com"}
        server.db_interface.get_link_by_node_id = Mock()
        server.db_interface.get_link_by_node_id.return_value = fake_link

        server._get_content_from_site = Mock()
        server._get_content_from_site.return_value = "marner"

        response = client.get(url)
        assert response.status_code == 200
        assert response.json == {"content": "marner"}

    def test_get_node_info_db_returns_key_error(self):
        app = Flask(__name__)
        client = app.test_client()
        server.configure_routes(app)
        url = "/get-node-info/leafs"

        server.db_interface.get_link_by_node_id = Mock()
        server.db_interface.get_link_by_node_id.side_effect = KeyError(
            Mock(status=404), "not found"
        )
        response = client.get(url)
        assert response.status_code == 404

    def test_get_node_info_db_returns_type_error(self):
        app = Flask(__name__)
        client = app.test_client()
        server.configure_routes(app)
        url = "/get-node-info/leafs"

        server.db_interface.get_link_by_node_id = Mock()
        server.db_interface.get_link_by_node_id.side_effect = TypeError(
            Mock(status=500), "Type Error"
        )
        response = client.get(url)
        assert response.status_code == 500

    def test_get_node_info_db_returns_system_error(self):
        app = Flask(__name__)
        client = app.test_client()
        server.configure_routes(app)
        url = "/get-node-info/leafs"

        server.db_interface.get_link_by_node_id = Mock()
        server.db_interface.get_link_by_node_id.side_effect = SystemError(
            Mock(status=500), "System Error"
        )
        response = client.get(url)
        assert response.status_code == 500
