import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = "TeleMedAI_DB"

async def debug_db():
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client.get_database(DB_NAME)
    
    print(f"Connected to DB: {DB_NAME}")

    # List all databases
    dbs = await client.list_database_names()
    print(f"Databases: {dbs}")
    
    # List collections
    collections = await db.list_collection_names()
    print(f"Collections: {collections}")
    
    # Check patientonboardings
    if 'patientonboardings' in collections:
        count = await db.patientonboardings.count_documents({})
        print(f"Count in patientonboardings: {count}")
        
        doc = await db.patientonboardings.find_one({})
        if doc:
            print("Sample document keys:", doc.keys())
            print("Sample userId type:", type(doc.get('userId')))
            print("Sample userId:", doc.get('userId'))
    else:
        print("Collection 'patientonboardings' not found!")
        # Try to find similar names
        for col in collections:
            if 'patient' in col.lower():
                print(f"Found similar collection: {col}")
                doc = await db[col].find_one({})
                if doc:
                    print(f"Sample doc in {col}: {doc.keys()}")

if __name__ == "__main__":
    asyncio.run(debug_db())
