import azure.functions as func
import json
from datetime import datetime
from .shared import tasks

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        req_body = req.get_json()
        task = req_body.get('task')
        if task:
            tasks.append({
                'task': task,
                'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })
            return func.HttpResponse(
                json.dumps({'status': 'success'}),
                status_code=201,
                mimetype='application/json'
            )
        return func.HttpResponse(
            json.dumps({'status': 'error', 'message': 'No task provided'}),
            status_code=400,
            mimetype='application/json'
        )
    except Exception as e:
        return func.HttpResponse(
            json.dumps({'status': 'error', 'message': str(e)}),
            status_code=500,
            mimetype='application/json'
        )