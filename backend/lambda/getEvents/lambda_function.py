import json


def lambda_handler(event, context):

    try:
        # Temporary event list
        # Database connection will be added later
        events = [
            {
                "eventId": "EVT001",
                "eventName": "AWS Workshop",
                "description": "AWS Cloud Workshop",
                "category": "Technical",
                "date": "2026-10-20",
                "time": "10:00 AM",
                "venue": "IT Seminar Hall",
                "capacity": 100,
                "organizer": "IT Department",
                "registrationDeadline": "2026-10-18",
                "status": "Upcoming"
            },
            {
                "eventId": "EVT002",
                "eventName": "AI Seminar",
                "description": "Introduction to Artificial Intelligence",
                "category": "Technical",
                "date": "2026-10-25",
                "time": "11:00 AM",
                "venue": "Seminar Hall",
                "capacity": 150,
                "organizer": "IT Department",
                "registrationDeadline": "2026-10-23",
                "status": "Upcoming"
            }
        ]

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "success": True,
                "message": "Events retrieved successfully",
                "events": events
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