from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatGroq(
    model='llama-3.1-8b-instant',
    api_key=os.getenv('GROQ_API_KEY')
)


async def classify_intent(user_message: str) -> str:
    """Classify an interrogation question into one of four categories.

    Returns one of: ALIBI, MOTIVE, TIMELINE, GENERAL.
    """
    prompt = f'''Classify this interrogation question into exactly one category:
ALIBI - asking about whereabouts, location, who can verify presence
MOTIVE - asking about relationships, grudges, money, reasons to harm
TIMELINE - asking about specific times, sequences, durations, order of events
GENERAL - any other question

Reply with ONLY one word. Question: {user_message}'''

    try:
        response = await llm.ainvoke(prompt)
        result = response.content.strip().upper()
        if result in ['ALIBI', 'MOTIVE', 'TIMELINE', 'GENERAL']:
            return result
        return 'GENERAL'
    except Exception as e:
        if '429' in str(e) or 'rate_limit' in str(e).lower():
            print(f'[INTENT] Rate limit hit, falling back to GENERAL')
        return 'GENERAL'
