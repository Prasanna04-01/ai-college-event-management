import json
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Users")


def lambda_handler(event, context):

    try:
        body = json.loads(event.get("body", "{}"))

        email = body.get("email")
        password = body.get("password")

        if not email or not password:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "Email and password are required"
                })
            }

        response = table.scan()

        users = response.get("Items", [])

        for user in users:

            if (
                user.get("Email") == email
                and user.get("Password") == password
            ):

                return {
                    "statusCode": 200,
                    "body": json.dumps({
                        "success": True,
                        "message": "Login successful",
                        "UserID": user.get("UserID"),
                        "Name": user.get("Name"),
                        "Email": user.get("Email"),
                        "Role": user.get("Role")
                    })
                }

        return {
            "statusCode": 401,
            "body": json.dumps({
                "success": False,
                "message": "Invalid email or password"
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