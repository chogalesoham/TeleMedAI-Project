import os
import motor.motor_asyncio
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = "TeleMedAI" # Extracted from URI

if not MONGODB_URI:
    print("WARNING: MONGODB_URI not found in environment variables.")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client.get_database(DB_NAME)

async def get_patient_data(user_id: str):
    """
    Fetches patient onboarding data for a given user_id.
    """
    try:
        # PatientOnboarding collection usually stores userId as ObjectId
        # Check if user_id is a valid ObjectId string
        if not ObjectId.is_valid(user_id):
            return None
            
        user_oid = ObjectId(user_id)
        
        # Find in 'patientonboardings' (mongoose default pluralization usually lowercases)
        # Or check the actual collection name. Based on model 'PatientOnboarding', it's likely 'patientonboardings'
        patient_data = await db.patientonboardings.find_one({"userId": user_oid})
        
        # Fetch user details for name
        user_data = await db.users.find_one({"_id": user_oid})
        patient_name = "Patient"
        if user_data and "name" in user_data:
            patient_name = user_data["name"]
        
        if not patient_data:
            print(f"No patient data found for userId: {user_id}")
            return None
            
        # Convert ObjectId to string for JSON serialization
        patient_data["_id"] = str(patient_data["_id"])
        patient_data["userId"] = str(patient_data["userId"])
        patient_data["patientName"] = patient_name
        
        return patient_data
        
    except Exception as e:
        print(f"Error fetching patient data: {e}")
        return None
