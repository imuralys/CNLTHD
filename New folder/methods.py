from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/greet', methods=['GET'])
def greet():
    return jsonify(message="Hello, World!")


@app.route('/submit', methods=['POST'])
def submit():
    data = request.json #get the JSON data from the request
    name = data.get('name') #extract the name from the JSON data
    if name:
        return jsonify(message=f"Hello, {name}!")
    return jsonify(error="Name not provided"), 400

if __name__ == '__main__':
    app.run(debug=True)
