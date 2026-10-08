import json

def lambda_handler(event, context):

    try:
        # Get userId from URL path
        path_parameters = event.get("pathParameters") or {}
        user_id = path_parameters.get("userId")

        if not user_id:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "userId is required"
                })
            }

        # Temporary recommendations
        # Real AI/ML recommendation logic will be integrated later
        recommendations = [
            {
                "eventId": "EVT001",
                "eventName": "AWS Cloud Workshop",
                "category": "Cloud Computing",
                "reason": "Matches your interest in Cloud Computing"
            },
            {
                "eventId": "EVT002",
                "eventName": "AI & Machine Learning Seminar",
                "category": "Artificial Intelligence",
                "reason": "Matches your interest in AI"
            }
        ]

        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "message": "Event recommendations retrieved successfully",
                "userId": user_id,
                "recommendations": recommendations
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "success": False,
                "message": "Internal server error",
                "error": str(e)
            })
        }