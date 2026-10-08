import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")

users_table = dynamodb.Table("Users")
events_table = dynamodb.Table("Events")


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
        user_id = path_parameters.get("userId")

        if not user_id:

            return {
                "statusCode": 400,
                "body": json.dumps({
                    "success": False,
                    "message": "userId is required"
                })
            }

        # Get user profile
        user_response = users_table.get_item(
            Key={
                "UserID": user_id
            }
        )

        if "Item" not in user_response:

            return {
                "statusCode": 404,
                "body": json.dumps({
                    "success": False,
                    "message": "User not found"
                })
            }

        user = user_response["Item"]

        interests = user.get("Interests", [])
        skills = user.get("Skills", [])

        if isinstance(interests, str):
            interests = [interests]

        if isinstance(skills, str):
            skills = [skills]

        user_preferences = [
            str(item).lower()
            for item in interests + skills
        ]

        # Get events
        events_response = events_table.scan()

        events = events_response.get("Items", [])

        recommendations = []

        for event_item in events:

            category = str(
                event_item.get("Category", "")
            ).lower()

            description = str(
                event_item.get("Description", "")
            ).lower()

            event_name = str(
                event_item.get("EventName", "")
            ).lower()

            text = (
                category
                + " "
                + description
                + " "
                + event_name
            )

            score = 0

            for preference in user_preferences:

                if preference in text:
                    score += 1

            if score > 0:

                event_item["RecommendationScore"] = score

                recommendations.append(event_item)

        recommendations.sort(
            key=lambda x: x.get(
                "RecommendationScore",
                0
            ),
            reverse=True
        )

        recommendations = convert_decimals(
            recommendations
        )

        return {
            "statusCode": 200,
            "body": json.dumps({
                "success": True,
                "message": "Recommendations generated successfully",
                "userId": user_id,
                "recommendations": recommendations
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