import json


def lambda_handler(event, context):

    try:
        # Get request body
        body = event.get("body", {})

        # API Gateway sends body as a JSON string
        if isinstance(body, str):
            body = json.loads(body)

        # Required fields
        email = body.get("email")
        password = body.get("password")

        # Check required fields
        if not email or not password:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "success": False,
                    "message": "Email and password are required"
                })
            }

        # Login request received successfully
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "success": True,
                "message": "Login request received successfully",
                "email": email
            })
        }

    except Exception as e:

        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "success": False,
                "message": "Internal server error",
                "error": str(e)
            })
        }
        