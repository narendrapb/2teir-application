import azure.functions as func
import json
import shared  # ✅ import the module, not just the list

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        req_body = req.get_json()
        task_id = req_body.get('id')

        if not task_id:
            return func.HttpResponse(
                json.dumps({'status': 'error', 'message': 'Task ID required'}),
                status_code=400,
                mimetype='application/json',
                headers={
                    "Access-Control-Allow-Origin": "http://localhost:5173",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
                    "Access-Control-Allow-Headers": "Content-Type"
                }
            )

        initial_length = len(shared.tasks)
        shared.tasks[:] = [task for task in shared.tasks if task['id'] != task_id]  # ✅ in-place update

        if len(shared.tasks) < initial_length:
            return func.HttpResponse(
                json.dumps({'status': 'success'}),
                status_code=200,
                mimetype='application/json',
                headers={
                    "Access-Control-Allow-Origin": "http://localhost:5173",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
                    "Access-Control-Allow-Headers": "Content-Type"
                }
            )

        return func.HttpResponse(
            json.dumps({'status': 'error', 'message': 'Task not found'}),
            status_code=404,
            mimetype='application/json',
            headers={
                "Access-Control-Allow-Origin": "http://localhost:5173",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
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
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
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
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        )
