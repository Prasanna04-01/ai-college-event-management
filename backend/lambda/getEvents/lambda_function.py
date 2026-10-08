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

        response = table.scan()

        events = response.get("Items", [])

        events = convert_decimals(events)

        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "message": "Events retrieved successfully",
                "events": events
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