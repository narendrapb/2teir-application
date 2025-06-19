import azure.functions as func
import json

app = func.FunctionApp()

@app.route(route="health", methods=["GET"])
def health(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(
        json.dumps({"health": "Application running"}),
        status_code=200,
        mimetype='application/json'
    )