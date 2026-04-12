from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatGroq(
    model='llama-3.1-8b-instant',
    api_key=os.getenv('GROQ_API_KEY')
)


async def score_suspicion(suspect_response: str) -> int:
    """Score a suspect's response for linguistic evasiveness and deceptive patterns.

    Returns an integer 0–100 (0 = direct/credible, 100 = highly evasive/deceptive).
    Falls back to 50 on any error.
    """
    prompt = f'''You are a deception analysis expert.
Rate the following statement on a scale of 0 to 100 for linguistic evasiveness and deceptive patterns.
0 = completely direct, specific, and credible.
100 = highly evasive, vague, contradictory, or showing deception markers.
Consider: hedging language, vagueness, excessive denials, topic avoidance, emotional distance.

Reply with ONLY a single integer between 0 and 100. No explanation.

Statement: {suspect_response}'''

    try:
        response = await llm.ainvoke(prompt)
        value = int(response.content.strip())
        return min(100, max(0, value))
    except Exception as e:
        if '429' in str(e) or 'rate_limit' in str(e).lower():
            print(f'[SUSPICION] Rate limit hit, falling back to 50')
        return 50
