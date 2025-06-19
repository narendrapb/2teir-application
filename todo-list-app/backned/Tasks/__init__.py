import azure.functions as func
import json
from .shared import tasks

def main(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(
        json.dumps({'tasks': tasks}),
        status_code=200,
        mimetype='application/json'
    )