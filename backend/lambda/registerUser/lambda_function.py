import json
import boto3
import uuid

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Users")


def lambda_handler(event, context):

    try:
        body = json.loads(event.get("body", "{}"))

        name = body.get("name")
        email = body.get("email")
        password = body.get("password")

        if not name or not email or not password:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "Name, email and password are required"
                })
            }

        user_id = "USER" + uuid.uuid4().hex[:8].upper()

        user_item = {
            "UserID": user_id,
            "Name": name,
            "Email": email,
            "Password": password,
            "Role": "USER"
        }

        table.put_item(Item=user_item)

        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "message": "User registered successfully",
                "UserID": user_id
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