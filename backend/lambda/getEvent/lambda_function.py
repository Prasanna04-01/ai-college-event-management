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

        # Temporary event data
        # Database connection will be added later
        event_data = {
            "eventId": event_id,
            "eventName": "AWS Cloud Workshop",
            "description": "Introduction to AWS Cloud Services",
            "category": "Technical",
            "date": "2026-10-20",
            "time": "10:00 AM",
            "venue": "IT Seminar Hall",
            "capacity": 100,
            "organizer": "AWS Student Builder Group",
            "registrationDeadline": "2026-10-18",
            "status": "Upcoming"
        }

        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "message": "Event details retrieved successfully",
                "event": event_data
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