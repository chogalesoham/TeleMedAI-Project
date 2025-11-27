import asyncio
import os
from database import db
from agent_service import chat_with_agent
from dotenv import load_dotenv

load_dotenv()

async def test():
    print("Testing Agent Service...")
    
    # 1. Find a user with onboarding data
    print("Finding a patient...")
    patient = await db.patientonboardings.find_one({})
    
    if not patient:
        print("No patient found in DB to test with.")
        return

    user_id = str(patient['userId'])
    print(f"Found patient with userId: {user_id}")
    
    # 2. Test Chat
    print("\n--- Test 1: General Greeting ---")
    response = await chat_with_agent(user_id, "Hello, who are you?")
    print(f"Agent: {response.get('response')}")
    
    print("\n--- Test 2: Medical Context ---")
    response = await chat_with_agent(user_id, "What medications am I currently taking?")
    print(f"Agent: {response.get('response')}")
    
    print("\n--- Test 3: Missing Data Handling ---")
    # Test with invalid ID
    response = await chat_with_agent("000000000000000000000000", "Hello")
    print(f"Agent (Invalid ID): {response}")

if __name__ == "__main__":
    asyncio.run(test())
