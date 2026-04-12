"""
State machine — manages suspect emotional states per case.

Each suspect starts CALM and transitions through DEFENSIVE to BREAKING
when the player mentions specific trigger keywords in their messages.
"""

STATE_TRANSITIONS = {
    'case001': {
        'Diana': {
            'CALM_triggers': ['floor 12', 'keycard', 'security footage', 'control room', '11:15', 'you were there'],
            'DEFENSIVE_triggers': ['argument', 'confronted', 'i know you were', 'we have footage', 'you argued'],
        },
        'Leo': {
            'CALM_triggers': ['nightclub', 'bankruptcy', 'debt', 'money', '80 lakh', 'neon and gold'],
            'DEFENSIVE_triggers': ['you shoved', 'physical contact', 'you touched him', 'floor 12', 'you lied'],
        },
        'Ray': {
            'CALM_triggers': ['waste chute', 'disposal', 'chute', 'floor 12 at 11:30', 'drink alibi'],
            'DEFENSIVE_triggers': ['information leak', 'schedules', 'shen', 'keycard log', 'floor 11', 'you never went'],
        },
    },
    'case002': {
        'Rena': {
            'CALM_triggers': ['notepad', 'crossed out', 'replaced', 'understudy', 'argument with sofia'],
            'DEFENSIVE_triggers': ['control room corridor', '9:45', 'you were backstage', 'keycard 9:44', 'room service unanswered'],
        },
        'Marco': {
            'CALM_triggers': ['ventilation', 'hvac', 'control room', 'maintenance hatch', 'parking garage'],
            'DEFENSIVE_triggers': ['affair', 'hr complaint', 'corrupted footage', 'admin access', 'camera deletion', 'restraining order'],
        },
        'Dante': {
            'CALM_triggers': ['budget', 'vendor', 'production costs', 'shell company', 'finances'],
            'DEFENSIVE_triggers': ['fake invoices', 'shredder', 'lago restaurant', 'left at 9:43', 'you lied about dinner'],
        },
    },
    'case003': {
        'Nina': {
            'CALM_triggers': ['vip credit', 'phantom accounts', 'ghost accounts', 'financial irregularities', 'audit files'],
            'DEFENSIVE_triggers': ['deactivated keycard', 'department hold', 'miguel santos', 'missing files', 'lexus 1:12 am', 'messenger bag'],
        },
        'Greg': {
            'CALM_triggers': ['vault camera', 'static feed', 'signal interrupt', 'camera anomaly'],
            'DEFENSIVE_triggers': ['failed to flag', 'deactivated account', 'frank navarro', 'you should have reported', 'negligence'],
        },
        'Luca': {
            'CALM_triggers': ['gambling', 'debts', 'sports betting', 'horseshoe lounge', 'vinnie'],
            'DEFENSIVE_triggers': ['will changed', 'cut out', 'inheritance', '$85,000', 'last chance text', 'tough love'],
        },
    },
}

# Current emotional state of each suspect — keyed by 'case_id_suspect_name'
suspect_states: dict[str, str] = {}


def _state_key(case_id: str, suspect_name: str) -> str:
    return f'{case_id}_{suspect_name}'


def update_state(case_id: str, suspect_name: str, user_message: str) -> str:
    """Advance the suspect's emotional state based on trigger keywords in the user message."""
    key = _state_key(case_id, suspect_name)
    msg = user_message.lower()

    # Initialize if first interaction
    if key not in suspect_states:
        suspect_states[key] = 'CALM'

    current = suspect_states[key]
    transitions = STATE_TRANSITIONS.get(case_id, {}).get(suspect_name, {})

    if not transitions:
        return current

    if current == 'CALM' and any(kw in msg for kw in transitions.get('CALM_triggers', [])):
        suspect_states[key] = 'DEFENSIVE'
    elif current == 'DEFENSIVE' and any(kw in msg for kw in transitions.get('DEFENSIVE_triggers', [])):
        suspect_states[key] = 'BREAKING'

    return suspect_states[key]


def get_state_instruction(state: str) -> str:
    """Return a behavioural instruction string for the given emotional state."""
    instructions = {
        'CALM': 'You are composed and in control. Give brief, measured responses.',
        'DEFENSIVE': (
            'You are uncomfortable and guarded. Answers are shorter. '
            'You are evasive. Avoid direct eye contact in your tone.'
        ),
        'BREAKING': (
            'You are under extreme pressure. Small inconsistencies are creeping '
            'into your story. You are not confessing but cracks are visible. '
            'Your composure is slipping.'
        ),
    }
    return instructions.get(state, instructions['CALM'])


def reset_states(case_id: str = None):
    """Reset suspect states. If case_id given, only reset that case's suspects."""
    if case_id:
        keys_to_remove = [k for k in suspect_states if k.startswith(case_id)]
        for key in keys_to_remove:
            del suspect_states[key]
    else:
        suspect_states.clear()
