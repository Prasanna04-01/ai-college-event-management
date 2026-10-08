import json

def lambda_handler(event, context):

    try:
        # Get eventId from URL
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

        # Get update data from request body
        body = event.get("body")

        if isinstance(body, str):
            body = json.loads(body)

        if not body:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "Update data is required"
                })
            }

        # Fields that can be updated
        allowed_fields = [
            "eventName",
            "description",
            "category",
            "date",
            "time",
            "venue",
            "capacity",
            "organizer",
            "registrationDeadline",
            "status",
            "imageURL"
        ]

        updated_fields = {}

        for field in allowed_fields:
            if field in body:
                updated_fields[field] = body[field]

        if not updated_fields:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "No valid fields provided for update"
                })
            }

        # Database update will be added later
        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "message": "Event update request received successfully",
                "eventId": event_id,
                "updatedFields": updated_fields
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