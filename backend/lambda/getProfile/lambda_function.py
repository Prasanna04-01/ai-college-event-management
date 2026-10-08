import json


def lambda_handler(event, context):

    try:
        # Get userId from query parameter
        query_params = event.get("queryStringParameters") or {}
        user_id = query_params.get("userId")

        # Check if userId was provided
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

        # Temporary profile data
        # Database connection will be added later
        profile = {
            "userId": user_id,
            "name": "Test Student",
            "email": "test@gmail.com",
            "department": "Information Technology",
            "year": 3,
            "skills": ["Python", "AWS"],
            "interests": ["AI", "Cloud Computing"]
        }

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "success": True,
                "message": "Profile retrieved successfully",
                "profile": profile
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