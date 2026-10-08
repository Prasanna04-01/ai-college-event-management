import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource("dynamodb")

attendance_table = dynamodb.Table("Attendance")
events_table = dynamodb.Table("Events")


def lambda_handler(event, context):

    try:
        path_parameters = event.get("pathParameters") or {}
        event_id = path_parameters.get("eventId")

        body = json.loads(event.get("body", "{}"))

        user_id = body.get("userId")

        if not event_id:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "eventId is required"
                })
            }

        if not user_id:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "userId is required"
                })
            }

        # Check whether event exists
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

        attendance_id = "ATT" + uuid.uuid4().hex[:8].upper()

        attendance_item = {
            "AttendanceID": attendance_id,
            "UserID": user_id,
            "EventID": event_id,
            "ScanTime": datetime.utcnow().isoformat(),
            "Status": "Present"
        }

        attendance_table.put_item(
            Item=attendance_item
        )

        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "message": "Attendance marked successfully",
                "attendance": attendance_item
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