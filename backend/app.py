from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

tasks = []

@app.route('/add', methods=['POST'])
def add_task():
    data = request.get_json()
    task = data.get('task')
    if task:
        tasks.append({
            'task': task,
            'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
        return jsonify({'status': 'success'}), 201
    return jsonify({'status': 'error', 'message': 'No task provided'}), 400

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks}),200

@app.route('/',methods=["GET"])
def application_health():
    return jsonify({"health":"Application running on the port 5000"}),200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
