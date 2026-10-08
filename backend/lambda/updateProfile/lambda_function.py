import json


def lambda_handler(event, context):

    try:
        # Get userId from query parameter
        query_params = event.get("queryStringParameters") or {}
        user_id = query_params.get("userId")

        # Get data sent in request body
        body = event.get("body", {})

        if isinstance(body, str):
            body = json.loads(body)

        # Check userId
        if not user_id:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "success": False,
                    "message": "userId is required"
                })
            }

        # Check that at least one field is provided
        allowed_fields = [
            "name",
            "department",
            "year",
            "skills",
            "interests"
        ]

        updated_fields = {
            field: body[field]
            for field in allowed_fields
            if field in body
        }

        if not updated_fields:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": json.dumps({
                    "success": False,
                    "message": "No profile information provided for update"
                })
            }

        # Temporary response
        # Database update will be connected later
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "success": True,
                "message": "Profile update request received successfully",
                "userId": user_id,
                "updatedFields": updated_fields
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