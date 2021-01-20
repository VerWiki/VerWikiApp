import db_interface
from flask import Flask, jsonify, request, Response, json
from flask_cors import CORS
from werkzeug.exceptions import InternalServerError, BadRequest, HTTPException, NotFound

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
        print(f"Node information - {node_id}")
        return jsonify({"nodeid": node_id})

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


if __name__ == "__main__":
    print("Starting server on port ", PORT)
    configure_routes(app)
    app.run(port=PORT, debug=True)
