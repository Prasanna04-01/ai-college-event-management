import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource("dynamodb")

feedback_table = dynamodb.Table("Feedback")
events_table = dynamodb.Table("Events")


def lambda_handler(event, context):

    try:

        body = json.loads(event.get("body", "{}"))

        user_id = body.get("userId")
        event_id = body.get("eventId")
        rating = body.get("rating")
        comment = body.get("comment", "")

        if not user_id:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "userId is required"
                })
            }

        if not event_id:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "eventId is required"
                })
            }

        if rating is None:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "rating is required"
                })
            }

        # Check event exists
        event_response = events_table.get_item(
            Key={
                "EventID": event_id
            }
        )

        if "Item" not in event_response:
            return {
                "statusCode": 404,
                "body": json.dumps({
                    "success": False,
                    "message": "Event not found"
                })
            }

        feedback_id = "FDB" + uuid.uuid4().hex[:8].upper()

        feedback_item = {
            "FeedbackID": feedback_id,
            "UserID": user_id,
            "EventID": event_id,
            "Rating": int(rating),
            "Comment": comment,
            "Sentiment": "Pending",
            "SubmittedAt": datetime.utcnow().isoformat()
        }

        feedback_table.put_item(
            Item=feedback_item
        )

        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "message": "Feedback submitted successfully",
                "feedback": feedback_item
            })
        }

    except Exception as e:

        return {
            "statusCode": 500,
            "body": json.dumps({
                "success": False,
                "message": str(e)
            })
        }