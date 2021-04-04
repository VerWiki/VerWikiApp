from flask import Flask
import sys
import os
from test_utils.mock_page import MockPage

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import server
import json
from unittest.mock import Mock, MagicMock, patch, PropertyMock
import pytest
from werkzeug.exceptions import InternalServerError, NotFound


def test_base_route():
    app = Flask(__name__)
    client = app.test_client()
    server.configure_routes(app)
    url = "/"

    response = client.get(url)
    print(response.get_data())
    assert response.get_data() == b"Hello World!"
    assert response.status_code == 200


class TestGetContentFromSite:
    def test_get_content_from_site_no_error(self):
        contentMock = Mock()
        contentMock.find.return_value = None
        contentMock.findAll.return_value = []

        soupMock = Mock()
        server.BeautifulSoup = Mock()
        server.BeautifulSoup.return_value = soupMock
        soupMock.find.return_value = contentMock

        with patch("server.requests.get") as patched_get:
            type(patched_get.return_value).ok = PropertyMock(return_value=True)
            assert (
                server._get_content_from_site("randomURL")
                != "mock_get_content_from_site_return_value"
            )

    def test_get_content_from_site_not_found_error(self):
        with patch("server.requests.get") as patched_get:
            type(patched_get.return_value).ok = PropertyMock(return_value=False)
            with pytest.raises(NotFound):
                server._get_content_from_site("randomURL")

    def test_get_content_from_site_internal_server_error(self):
        soupMock = Mock()
        server.BeautifulSoup = Mock()
        server.BeautifulSoup.return_value = soupMock
        soupMock.find.return_value = None

        with patch("server.requests.get") as patched_get:
            type(patched_get.return_value).ok = PropertyMock(return_value=True)
            with pytest.raises(InternalServerError):
                server._get_content_from_site("randomURL")


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
    @patch("server.requests")
    def test_get_content_from_site_not_found_error(self, mock_req):
        app = Flask(__name__)
        client = app.test_client()
        server.configure_routes(app)
        url = "/get-node-info/leafs"

        mock_page = mock_req.get(url)
        mock_page.ok = False

        with pytest.raises(NotFound):
            server._get_content_from_site(url)

    def test_get_node_info_exists(self):
        app = Flask(__name__)
        client = app.test_client()
        server.configure_routes(app)
        url = "/get-node-info/maple-leafs"

        server._get_content_from_site = Mock()
        server._get_content_from_site.return_value = (
            "mock_get_content_from_site_return_value"
        )

        response = client.get(url)
        assert response.status_code == 200
        assert response.json == {"content": "mock_get_content_from_site_return_value"}

    @patch("server.requests")
    @patch("server.BeautifulSoup")
    def test_get_content_from_site_internal_server_error(self, mock_bs, mock_req):
        app = Flask(__name__)
        client = app.test_client()
        server.configure_routes(app)
        url = "/get-node-info/leafs"

        page = MockPage(True)
        mock_req.get.return_value = page

        mock_bs(page.content, "html.parser").find.return_value = None
        server._get_content_from_site(url)

        assert 0 == 1
