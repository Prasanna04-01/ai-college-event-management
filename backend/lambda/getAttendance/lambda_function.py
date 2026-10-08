import json

def lambda_handler(event, context):

    try:
        # Get eventId from URL path
        path_parameters = event.get("pathParameters") or {}
        event_id = path_parameters.get("eventId")

        if not event_id:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "eventId is required"
                })
            }

        # Temporary attendance data
        # Database integration will be added later
        attendance = [
            {
                "userId": "USER001",
                "eventId": event_id,
                "status": "Present"
            },
            {
                "userId": "USER002",
                "eventId": event_id,
                "status": "Present"
            }
        ]

        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "message": "Attendance records retrieved successfully",
                "eventId": event_id,
                "attendance": attendance
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