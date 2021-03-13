import db_interface
from flask import Flask, jsonify, request, Response, json
from flask_cors import CORS
from werkzeug.exceptions import InternalServerError, BadRequest, HTTPException, NotFound
from keybert import KeyBERT
from time import time
from bs4 import BeautifulSoup
import requests


app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
PORT = 3003


def configure_routes(app):
    @app.route("/", methods=["GET"])
    def hello():
        """
        Sample route
        """
        return "Hello World!"

    @app.route("/get-tree-by-id/<id>", methods=["GET"])
    def get_tree_by_id(id):
        """
        Returns the tree corresponding to the ID else an error status that
        the client must handle.
        """
        try:
            tree = db_interface.get_tree_by_id(int(id))
            return jsonify(tree)
        except KeyError as e:
            nf = NotFound()
            nf.description = str(e)
            raise nf
        except Exception as e:
            internalSrvErr = InternalServerError()
            internalSrvErr.description = str(e)
            raise internalSrvErr

    @app.route("/get-node-info/<node_id>", methods=["GET"])
    def get_node_info(node_id):
        """
        Gets the associated link from the database, gets the text associated
        with it, and summarizes it.
        """
        try:
            link = db_interface.get_link_by_node_id(node_id)
        except KeyError as e:
            nf = NotFound()
            nf.description = str(e)
            raise nf
        except Exception as e:
            internalSrvErr = InternalServerError()
            internalSrvErr.description = str(e)
            raise internalSrvErr
        try:
            content = _get_content_from_site(link)
        except Exception as e:
            raise e
        return jsonify({"content": content})

    @app.route("/get-node-id-by-link/<link>", methods=["GET"])
    def get_node_id_by_link(link: str) -> str:
        """
        Gets the node ID of the node associated with the given link

        Args:
            link (str): The link for which to get the node ID

        Returns:
            str: The node ID
        """
        print("REACHED SERVER FUNCTION")
        node_id = "placeholder"
        return node_id
        try:
            node_id = db_interface.get_node_id_by_link(link)
            print(node_id)
        except KeyError as e:
            nf = NotFound()
            nf.description = str(e)
            print("KEYERROR")
            return jsonify({"id": node_id})
            # raise nf
        except Exception as e:
            internalSrvErr = InternalServerError()
            internalSrvErr.description = str(e)
            print("EXCEPTION")
            return jsonify({"id": node_id})
            # raise internalSrvErr
        return jsonify({"id": node_id})

    @app.errorhandler(HTTPException)
    def handle_exception(e):
        """
        Returns JSON instead of HTML for errors.
        """
        response = e.get_response()
        # replace the body with JSON
        response.data = json.dumps(
            {"code": e.code, "name": e.name, "description": e.description}
        )
        response.content_type = "application/json"
        return response


def _get_content_from_site(url: str) -> str:
    page = requests.get(url)
    if not page.ok:
        raise NotFound("No additional information available for the topic - 404")
    soup = BeautifulSoup(page.content, "html.parser")

    # dokuwiki__content is assumed to have the main content of the article
    content = soup.find("div", {"id": "dokuwiki__content"})
    if content is None:
        raise InternalServerError("Error when showing article preview")

    # Remove the pageID from the displayed article
    page_id = content.find("div", {"class": "pageId"})
    if page_id is not None:
        page_id.decompose()

    anchors = content.findAll("a", {"href": True})
    for anchor in anchors:
        # Prepend https://cwsl.ca to all links which were previously local links
        if len(anchor["href"]) > 0 and anchor["href"][0] == "/":
            anchor["href"] = f"https://cwsl.ca{anchor['href']}"
        anchor["onMouseEnter"] = "console.log('hello world')"

    return str(content)


if __name__ == "__main__":
    print("Starting server on port ", PORT)
    configure_routes(app)
    app.run(port=PORT, debug=True)
