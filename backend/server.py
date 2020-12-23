from flask import Flask, jsonify, request, Response, json
from werkzeug.exceptions import InternalServerError
app = Flask(__name__)
PORT = 3003
import db_interface


@app.route("/", methods=['GET'])
def hello():
    """
    Sample route
    """
    return "Hello World!"


@app.route("/get-tree-by-id", methods=['GET'])
def get_tree_by_id():
    """
    Expects the body of the request to have an id key; returns
    the tree corresponding to an ID else {} if there is no such
    tree.
    """
    body = request.json
    id = body['id']
    print(id)

    return jsonify(db_interface.get_tree_by_id(id))


@app.errorhandler(InternalServerError)
def handle_500(e):
    """Returns JSON instead of HTML for 500 errors."""

    response = e.get_response()
    # replace the body with JSON
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    return response


if __name__ == "__main__":
    print("Starting server on port ", PORT)
    app.run(port=PORT)
