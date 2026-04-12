from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

from prompts.detective_prompt import CLUE_EXTRACTION_PROMPT, REVEAL_PROMPT
from case_registry import get_case

load_dotenv()

llm = ChatGroq(
    model='llama-3.1-8b-instant',
    api_key=os.getenv('GROQ_API_KEY')
)


async def extract_clue_ai(user_msg: str, suspect_reply: str) -> str | None:
    """Use AI to detect if a new investigative clue was revealed in the exchange."""
    full_prompt = f'{CLUE_EXTRACTION_PROMPT}\n\nUSER: {user_msg}\nSUSPECT: {suspect_reply}'
    try:
        response = await llm.ainvoke(full_prompt)
        text = response.content.strip()
        if text.upper() == 'NULL' or not text:
            return None
        return text
    except Exception as e:
        if '429' in str(e) or 'rate_limit' in str(e).lower():
            print(f'[CLUE] Rate limit hit, skipping AI clue extraction')
        return None


async def reveal_truth(case_id: str, named_suspect: str, clues: list) -> dict:
    """Generate the dramatic case reveal when the player makes their arrest."""
    case = get_case(case_id)
    killer = case['killer']
    is_correct = named_suspect.lower() == killer.lower()

    clue_summary = '\n'.join(f'- {c}' for c in clues)

    case_reveal_prompt = f"""{REVEAL_PROMPT}

CASE: {case['title']}
SETTING: {case['setting']}
VICTIM: {case['victim']}
TRUE KILLER: {killer}
ARRESTED: {named_suspect}
CORRECT: {is_correct}
CLUES GATHERED:
{clue_summary}"""

    try:
        response = await llm.ainvoke(case_reveal_prompt)
        return {'verdict': response.content.strip(), 'correct': is_correct}
    except Exception as e:
        if '429' in str(e) or 'rate_limit' in str(e).lower():
            fallback = (
                f'The investigation concludes. You arrested {named_suspect}. '
                f'{"Justice was served — you got the right person!" if is_correct else f"Unfortunately, the true killer was {killer}."} '
                f'(API rate limit reached — full narrative unavailable.)'
            )
            return {'verdict': fallback, 'correct': is_correct}
        return {'verdict': 'The investigation concludes.', 'correct': is_correct}
