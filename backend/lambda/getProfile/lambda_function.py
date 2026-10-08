import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Users")


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

        query_parameters = event.get("queryStringParameters") or {}
        user_id = query_parameters.get("userId")

        if not user_id:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "userId is required"
                })
            }

        response = table.get_item(
            Key={
                "UserID": user_id
            }
        )

        if "Item" not in response:
            return {
                "statusCode": 404,
                "body": json.dumps({
                    "success": False,
                    "message": "User not found"
                })
            }

        user = response["Item"]

        user.pop("Password", None)
        user.pop("PasswordHash", None)

        user = convert_decimals(user)

        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "message": "Profile retrieved successfully",
                "user": user
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