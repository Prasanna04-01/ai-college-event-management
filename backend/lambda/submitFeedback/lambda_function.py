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
        rating = body.get("rating")
        comment = body.get("comment", "")

        if not user_id or not event_id or rating is None:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "userId, eventId and rating are required"
                })
            }

        # Database and sentiment analysis will be added later
        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "message": "Feedback submitted successfully",
                "userId": user_id,
                "eventId": event_id,
                "rating": rating,
                "comment": comment
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
