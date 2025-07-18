import azure.functions as func
import json
from datetime import datetime
from shared import tasks
import uuid

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        req_body = req.get_json()
        task = req_body.get('task')
        if not task or not task.strip():
            return func.HttpResponse(
                json.dumps({'status': 'error', 'message': 'Task cannot be empty'}),
                status_code=400,
                mimetype='application/json',
                headers={
                    "Access-Control-Allow-Origin": "http://localhost:5173",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                }
            )
        if len(task.strip()) > 200:
            return func.HttpResponse(
                json.dumps({'status': 'error', 'message': 'Task too long (max 200 characters)'}),
                status_code=400,
                mimetype='application/json',
                headers={
                    "Access-Control-Allow-Origin": "http://localhost:5173",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                }
            )
        task_id = str(uuid.uuid4())
        tasks.append({
            'id': task_id,
            'task': task.strip(),
            'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'completed': False
        })
        return func.HttpResponse(
            json.dumps({'status': 'success', 'task_id': task_id}),
            status_code=201,
            mimetype='application/json',
            headers={
                "Access-Control-Allow-Origin": "http://localhost:5173",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        )
    except ValueError:
        return func.HttpResponse(
            json.dumps({'status': 'error', 'message': 'Invalid JSON payload'}),
            status_code=400,
            mimetype='application/json',
            headers={
                "Access-Control-Allow-Origin": "http://localhost:5173",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        )
    except Exception as e:
        return func.HttpResponse(
            json.dumps({'status': 'error', 'message': str(e)}),
            status_code=500,
            mimetype='application/json',
            headers={
                "Access-Control-Allow-Origin": "http://localhost:5173",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        )