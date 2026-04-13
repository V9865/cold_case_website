"""
Generic suspect agent — replaces the per-suspect diana.py / leo.py / ray.py
modules with a single, session-aware implementation.

Each (case_id, suspect_name) pair gets its own LLM chain and memory, created
lazily on first request and cached in AGENT_SESSIONS.
"""

from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
)
from dotenv import load_dotenv
import os

from agents.state_machine import update_state, get_state_instruction
from agents.intent_classifier import classify_intent
from rag.retriever import retrieve_context

load_dotenv()

# ── Session cache ────────────────────────────────────────────────────────────────
# Maps '{case_id}_{suspect_name}' → {'chain': ConversationChain, 'memory': ConversationBufferMemory}

AGENT_SESSIONS: dict[str, dict] = {}


def _build_prompt(system_prompt: str) -> ChatPromptTemplate:
    """Construct the ChatPromptTemplate for a suspect chain."""
    return ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template(
            system_prompt + '\n\n{state_and_context}'
        ),
        MessagesPlaceholder(variable_name='history'),
        HumanMessagePromptTemplate.from_template('{input}'),
    ])


# ── Public API ───────────────────────────────────────────────────────────────────

def get_or_create_agent(
    case_id: str,
    suspect_name: str,
    system_prompt: str,
) -> ConversationChain:
    """Return (or lazily create) the ConversationChain for a specific suspect session.

    Args:
        case_id: The case identifier (e.g. 'case001').
        suspect_name: The suspect's name (e.g. 'Diana').
        system_prompt: The full system prompt text for this suspect.

    Returns:
        The cached or newly created ConversationChain.
    """
    session_key = f'{case_id}_{suspect_name}'

    if session_key not in AGENT_SESSIONS:
        llm = ChatGroq(
            model='llama-3.1-8b-instant',
            api_key=os.getenv('GROQ_API_KEY'),
            streaming=True,
        )

        memory = ConversationBufferMemory(
            return_messages=True,
            memory_key='history',
        )

        prompt_template = _build_prompt(system_prompt)

        chain = ConversationChain(
            llm=llm,
            memory=memory,
            prompt=prompt_template.partial(state_and_context=''),
            verbose=False,
        )

        AGENT_SESSIONS[session_key] = {
            'chain': chain,
            'memory': memory,
            'prompt_template': prompt_template,
        }

    return AGENT_SESSIONS[session_key]['chain']


async def stream_suspect(
    case_id: str,
    suspect_name: str,
    system_prompt: str,
    user_message: str,
    collection_name: str = 'case_documents',
):
    """Stream an LLM response for a suspect interrogation turn.

    Yields individual tokens followed by a final metadata payload:
        ``__DONE__<full_response>__STATE__<new_state>``

    Args:
        case_id: The case identifier.
        suspect_name: The suspect's display name.
        system_prompt: The full system prompt text for this suspect.
        user_message: The detective's latest message.
        collection_name: ChromaDB collection for RAG retrieval.
    """
    # ── Prep: state, intent, RAG context ─────────────────────────────────────
    new_state = update_state(case_id, suspect_name, user_message)
    intent = await classify_intent(user_message)
    context = retrieve_context(user_message, suspect_name, collection_name=collection_name)
    state_instr = get_state_instruction(new_state)

    intent_map = {
        'ALIBI': 'Reinforce your stated timeline carefully.',
        'MOTIVE': 'Deflect from any suggestion of motive.',
        'TIMELINE': 'Be precise about your stated times.',
        'GENERAL': '',
    }

    state_and_context = (
        f'[STATE]: {state_instr}\n'
        f'[INTENT]: {intent_map.get(intent, "")}\n'
        f'[CASE CONTEXT]:\n{context}'
    )

    # ── Get / create chain and stream ────────────────────────────────────────
    chain = get_or_create_agent(case_id, suspect_name, system_prompt)

    session_key = f'{case_id}_{suspect_name}'
    prompt_template = AGENT_SESSIONS[session_key]['prompt_template']
    chain.prompt = prompt_template.partial(state_and_context=state_and_context)

    full_response = ''
    try:
        async for chunk in chain.astream({'input': user_message}):
            if 'response' in chunk:
                token = chunk['response']
                full_response += token
                yield token
    except Exception as e:
        error_str = str(e)
        if '429' in error_str or 'rate_limit' in error_str.lower() or 'RateLimit' in type(e).__name__:
            yield '__ERROR__RATE_LIMIT__You have hit the Groq API daily token limit. Please wait a few minutes or switch to a smaller model.'
            return
        else:
            yield f'__ERROR__LLM__{error_str}'
            return

    yield '__DONE__' + full_response + '__STATE__' + new_state


def reset_agent(case_id: str, suspect_name: str) -> None:
    """Clear memory and remove the session for a single suspect.

    No-op if the session does not exist.
    """
    session_key = f'{case_id}_{suspect_name}'
    if session_key in AGENT_SESSIONS:
        AGENT_SESSIONS[session_key]['memory'].clear()
        del AGENT_SESSIONS[session_key]


def reset_all_agents(case_id: str) -> None:
    """Remove every agent session whose key starts with *case_id*."""
    keys_to_remove = [k for k in AGENT_SESSIONS if k.startswith(case_id)]
    for key in keys_to_remove:
        AGENT_SESSIONS[key]['memory'].clear()
        del AGENT_SESSIONS[key]
