from flask import Flask, jsonify, request, Response, json
from werkzeug.exceptions import InternalServerError, BadRequest, HTTPException, NotFound

app = Flask(__name__)
PORT = 3003
import db_interface


def configure_routes(app):
    @app.route("/", methods=["GET"])
    def hello():
        """
        Sample route
        """
        return "Hello World!"

    @app.route("/get-tree-by-id", methods=["GET"])
    def get_tree_by_id():
        """
        Expects the body of the request to have an id key; returns
        the tree corresponding to an ID else {} if there is no such
        tree.
        """
        body = request.json
        if body is None or "id" not in body:
            br = BadRequest()
            br.description = "ID key not found in body; cannot get tree by ID"
            raise br

        id = body["id"]
        try:
            tree = db_interface.get_tree_by_id(id)
            return jsonify(tree)
        except KeyError as e:
            nf = NotFound()
            nf.description = str(e)
            raise nf
        except Exception as e:
            internalSrvErr = InternalServerError()
            internalSrvErr.description = str(e)
            raise internalSrvErr

    @app.errorhandler(HTTPException)
    def handle_exception(e):
        """Returns JSON instead of HTML for errors."""

        response = e.get_response()
        # replace the body with JSON
        response.data = json.dumps(
            {
                "code": e.code,
                "name": e.name,
                "description": e.description,
            }
        )
        response.content_type = "application/json"
        return response


if __name__ == "__main__":
    print("Starting server on port ", PORT)
    configure_routes(app)
    app.run(port=PORT)
