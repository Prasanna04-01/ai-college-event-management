import json

def lambda_handler(event, context):

    try:
        body = event.get("body")

        if isinstance(body, str):
            body = json.loads(body)

        if not body:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "Request body is required"
                })
            }

        user_id = body.get("userId")
        event_id = body.get("eventId")
        status = body.get("status", "Present")

        if not user_id or not event_id:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "userId and eventId are required"
                })
            }

        # Attendance database logic will be added later
        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "message": "Attendance marked successfully",
                "userId": user_id,
                "eventId": event_id,
                "status": status
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "success": False,
                "message": "Internal server error",
                "error": str(e)
            })
        }