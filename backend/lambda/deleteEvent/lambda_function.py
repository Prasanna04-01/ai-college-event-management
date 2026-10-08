import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Events")


def convert_decimals(obj):

    if isinstance(obj, Decimal):
        if obj % 1 == 0:
            return int(obj)
        return float(obj)

    if isinstance(obj, dict):
        return {
            key: convert_decimals(value)
            for key, value in obj.items()
        }

    if isinstance(obj, list):
        return [
            convert_decimals(value)
            for value in obj
        ]

    return obj


def lambda_handler(event, context):

    try:

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

        response = table.delete_item(
            Key={
                "EventID": event_id
            },
            ReturnValues="ALL_OLD"
        )

        if "Attributes" not in response:

            return {
                "statusCode": 404,
                "body": json.dumps({
                    "success": False,
                    "message": "Event not found"
                })
            }

        deleted_event = convert_decimals(
            response["Attributes"]
        )

        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "message": "Event deleted successfully",
                "event": deleted_event
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