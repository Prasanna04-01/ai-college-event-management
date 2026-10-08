import json
import boto3
import uuid

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Events")


def lambda_handler(event, context):

    try:

        body = json.loads(event.get("body", "{}"))

        required_fields = [
            "eventName",
            "description",
            "category",
            "date",
            "time",
            "venue",
            "capacity",
            "organizer",
            "registrationDeadline"
        ]

        for field in required_fields:

            if field not in body:

                return {
                    "statusCode": 400,
                    "body": json.dumps({
                        "success": False,
                        "message": f"Missing field: {field}"
                    })
                }

        event_id = "EVT" + uuid.uuid4().hex[:8].upper()

        event_item = {
            "EventID": event_id,
            "EventName": body["eventName"],
            "Description": body["description"],
            "Category": body["category"],
            "Date": body["date"],
            "Time": body["time"],
            "Venue": body["venue"],
            "Capacity": int(body["capacity"]),
            "Organizer": body["organizer"],
            "RegistrationDeadline": body["registrationDeadline"],
            "Status": body.get("status", "Upcoming"),
            "ImageURL": body.get("imageURL", "")
        }

        table.put_item(
            Item=event_item
        )

        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "message": "Event created successfully",
                "event": event_item
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