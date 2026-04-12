"""
Case Registry — central configuration for all Cold Case Vegas cases.

Each case defines its title, setting, victim, killer, suspects (with prompt
module paths), and the ChromaDB collection used for RAG retrieval.

Stories are aligned with the frontend case definitions.
"""

CASES: dict[str, dict] = {
    "case001": {
        "title": "The Mirage Murder",
        "setting": "The Mirage Casino — Floor 12",
        "victim": "Marcus Vega, 42, high-roller found dead in his penthouse suite.",
        "killer": "Ray",
        "victim_identity": "Marcus Vega, 42",
        "victim_status": "Blunt force trauma to the skull",
        "victim_time": "Between 10:50 PM and 11:30 PM",
        "victim_location": "Penthouse Suite, Floor 12, The Mirage",
        "victim_discovered": "Housekeeping staff at 6:30 AM",
        "victim_weapon": "Crystal whiskey decanter (recovered)",
        "suspects": [
            {
                "name": "Diana",
                "prompt_module": "prompts.case001.diana_prompt",
                "prompt_var": "DIANA_SYSTEM_PROMPT",
            },
            {
                "name": "Leo",
                "prompt_module": "prompts.case001.leo_prompt",
                "prompt_var": "LEO_SYSTEM_PROMPT",
            },
            {
                "name": "Ray",
                "prompt_module": "prompts.case001.ray_prompt",
                "prompt_var": "RAY_SYSTEM_PROMPT",
            },
        ],
        "chroma_collection": "case001_documents",
    },
    "case002": {
        "title": "Neon Requiem",
        "setting": "The Bellagio Fountains — Backstage",
        "victim": "Sofia Laurent, 35, star choreographer discovered in the fountain control room.",
        "killer": "Marco",
        "victim_identity": "Sofia Laurent, 35",
        "victim_status": "Asphyxiation — sealed room, ventilation disabled",
        "victim_time": "Between 10:00 PM and 11:30 PM",
        "victim_location": "Fountain Control Room, Backstage, Bellagio",
        "victim_discovered": "Night security during routine sweep at 12:15 AM",
        "victim_weapon": "Under investigation",
        "suspects": [
            {
                "name": "Rena",
                "prompt_module": "prompts.case002.rena_prompt",
                "prompt_var": "RENA_SYSTEM_PROMPT",
            },
            {
                "name": "Marco",
                "prompt_module": "prompts.case002.marco_prompt",
                "prompt_var": "MARCO_SYSTEM_PROMPT",
            },
            {
                "name": "Dante",
                "prompt_module": "prompts.case002.dante_prompt",
                "prompt_var": "DANTE_SYSTEM_PROMPT",
            },
        ],
        "chroma_collection": "case002_documents",
    },
    "case003": {
        "title": "The Jackpot Heist",
        "setting": "Caesar's Palace — Vault B",
        "victim": "Tommy Chen, 58, retired pit boss found inside a sealed casino vault.",
        "killer": "Nina",
        "victim_identity": "Tommy Chen, 58",
        "victim_status": "Cardiac arrest — oxygen depletion in sealed vault",
        "victim_time": "Between 2:00 AM and 4:00 AM Saturday",
        "victim_location": "Vault B, Sub-Level 2, Caesar's Palace",
        "victim_discovered": "Monday morning audit team at 9:00 AM",
        "victim_weapon": "Under investigation",
        "suspects": [
            {
                "name": "Nina",
                "prompt_module": "prompts.case003.nina_prompt",
                "prompt_var": "NINA_SYSTEM_PROMPT",
            },
            {
                "name": "Greg",
                "prompt_module": "prompts.case003.greg_prompt",
                "prompt_var": "GREG_SYSTEM_PROMPT",
            },
            {
                "name": "Luca",
                "prompt_module": "prompts.case003.luca_prompt",
                "prompt_var": "LUCA_SYSTEM_PROMPT",
            },
        ],
        "chroma_collection": "case003_documents",
    },
}


def get_case(case_id: str) -> dict:
    """Return the full case configuration for *case_id*.

    Raises:
        ValueError: If *case_id* does not exist in the registry.
    """
    if case_id not in CASES:
        raise ValueError(
            f"Unknown case ID '{case_id}'. "
            f"Available cases: {', '.join(CASES.keys())}"
        )
    return CASES[case_id]


def list_cases() -> list[dict]:
    """Return a list of all registered cases with their IDs, titles, and settings.

    Each item is a dict with keys: ``id``, ``title``, ``setting``.
    """
    return [
        {"id": cid, "title": cfg["title"], "setting": cfg["setting"]}
        for cid, cfg in CASES.items()
    ]
