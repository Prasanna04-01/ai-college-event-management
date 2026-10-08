import json


def lambda_handler(event, context):

    try:
        # Get data sent to Lambda
        body = event.get("body", {})

        # API Gateway may send body as a JSON string
        if isinstance(body, str):
            body = json.loads(body)

        # Required fields
        required_fields = [
            "name",
            "email",
            "password",
            "department",
            "year"
        ]

        # Check for missing fields
        missing_fields = [
            field for field in required_fields
            if not body.get(field)
        ]

        if missing_fields:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "success": False,
                    "message": "Missing required fields",
                    "fields": missing_fields
                })
            }

        # Get user information
        name = body["name"]
        email = body["email"]
        password = body["password"]
        department = body["department"]
        year = body["year"]

        # Optional fields
        skills = body.get("skills", [])
        interests = body.get("interests", [])

        # Backend response
        response = {
            "success": True,
            "message": "User registration data received successfully",
            "user": {
                "name": name,
                "email": email,
                "department": department,
                "year": year,
                "skills": skills,
                "interests": interests
            }
        }

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps(response)
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