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

        body = json.loads(
            event.get("body", "{}")
        )

        existing = table.get_item(
            Key={
                "EventID": event_id
            }
        )

        if "Item" not in existing:

            return {
                "statusCode": 404,
                "body": json.dumps({
                    "success": False,
                    "message": "Event not found"
                })
            }

        allowed_fields = {
            "eventName": "EventName",
            "description": "Description",
            "category": "Category",
            "date": "Date",
            "time": "Time",
            "venue": "Venue",
            "capacity": "Capacity",
            "organizer": "Organizer",
            "registrationDeadline": "RegistrationDeadline",
            "status": "Status",
            "imageURL": "ImageURL"
        }

        update_parts = []
        expression_values = {}
        expression_names = {}

        for input_field, dynamo_field in allowed_fields.items():

            if input_field in body:

                name_key = "#" + dynamo_field
                value_key = ":" + dynamo_field

                expression_names[name_key] = dynamo_field

                value = body[input_field]

                if input_field == "capacity":
                    value = int(value)

                expression_values[value_key] = value

                update_parts.append(
                    f"{name_key} = {value_key}"
                )

        if not update_parts:

            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "No fields provided for update"
                })
            }

        response = table.update_item(
            Key={
                "EventID": event_id
            },
            UpdateExpression="SET " + ", ".join(update_parts),
            ExpressionAttributeNames=expression_names,
            ExpressionAttributeValues=expression_values,
            ReturnValues="ALL_NEW"
        )

        updated_event = convert_decimals(
            response["Attributes"]
        )

        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "message": "Event updated successfully",
                "event": updated_event
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