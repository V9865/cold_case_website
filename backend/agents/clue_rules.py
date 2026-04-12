"""
Clue rules — per-case keyword-based clue detection.

When the combined user message + suspect reply contains trigger keywords,
a new investigative clue is revealed to the player.
"""

CLUE_RULES: dict[str, list[dict]] = {
    'case001': [
        {
            'keywords': ['11:14', '11:15', 'keycard', 'floor 12 at 11'],
            'clue': "Diana's keycard accessed Floor 12 at 11:14 PM — contradicting her alibi",
            'id': 'diana_keycard',
        },
        {
            'keywords': ['card counting', 'card-counting', 'cheating', 'counting operation'],
            'clue': 'Marcus Vega was running a card-counting operation at the high-roller tables',
            'id': 'marcus_counting',
        },
        {
            'keywords': ['argument', 'confronted', 'heated', 'spoke to marcus', 'i was there'],
            'clue': 'Diana and Marcus had a heated confrontation on Floor 12 at 11:15 PM',
            'id': 'diana_argument',
        },
        {
            'keywords': ['nightclub', 'bankruptcy', 'neon and gold', '80 lakh', 'debt', 'owes'],
            'clue': 'Leo Fontaine and Marcus Vega had an unresolved Rs 80 lakh financial dispute',
            'id': 'leo_debt',
        },
        {
            'keywords': ['shoved', 'pushed', 'physical', 'touched him', 'grabbed'],
            'clue': 'Leo Fontaine made physical contact with Marcus Vega at approximately 11:00 PM',
            'id': 'leo_shove',
        },
        {
            'keywords': ['waste chute', 'chute', 'disposal chute', 'waste panel'],
            'clue': 'Ray showed unusual hesitation when the Floor 12 waste chute was mentioned',
            'id': 'ray_chute',
        },
        {
            'keywords': ['information leak', 'schedules', 'shen', 'passing details', 'criminal'],
            'clue': "Ray's story began contradicting itself when the information leak was raised",
            'id': 'ray_leak',
        },
        {
            'keywords': ['floor 11', 'drink alibi', 'bar at 11:30', 'went to get a drink'],
            'clue': "Ray's claim that he visited the Floor 11 bar is contradicted by the keycard log",
            'id': 'ray_alibi',
        },
        {
            'keywords': ['glass trophy', 'trophy', 'mantelpiece', 'missing trophy'],
            'clue': 'A glass trophy from the Floor 12 mantelpiece is unaccounted for — a potential murder weapon',
            'id': 'trophy',
        },
    ],
    'case002': [
        {
            'keywords': ['notepad', 'crossed out', 'names list', 'crossed-out names'],
            'clue': "Sofia's notepad contained crossed-out names — Rena Torres was one of them",
            'id': 'rena_notepad',
        },
        {
            'keywords': ['9:44', 'backstage keycard', 'rena keycard', 'came back'],
            'clue': "Rena's backstage keycard was used at 9:44 PM — she was near the control room",
            'id': 'rena_backstage',
        },
        {
            'keywords': ['room service', 'unanswered', 'no one answered', 'food at door'],
            'clue': "Room service was left outside Rena's door unanswered — her alibi has gaps",
            'id': 'rena_room_service',
        },
        {
            'keywords': ['affair', 'personal relationship', 'hr complaint', 'unwanted contact'],
            'clue': 'Marco and Sofia had a secret affair — Sofia filed an HR complaint before her death',
            'id': 'marco_affair',
        },
        {
            'keywords': ['corrupted footage', 'deleted recordings', 'admin access', 'camera deletion'],
            'clue': 'Backstage camera footage was deleted by someone with admin access — Marco has admin privileges',
            'id': 'marco_footage',
        },
        {
            'keywords': ['maintenance hatch', 'hvac panel', 'external ventilation', 'ventilation override'],
            'clue': 'The ventilation was disabled from an external panel Marco would know how to access',
            'id': 'marco_hvac',
        },
        {
            'keywords': ['fire exit', 'garage door', 'no keycard', 'unsecured door'],
            'clue': 'Marco could have re-entered backstage through an unsecured fire exit without leaving a trace',
            'id': 'marco_fire_exit',
        },
        {
            'keywords': ['fake invoices', 'shell company', 'vendor fraud', 'luxe stage'],
            'clue': "Dante created shell companies to siphon $200K from the show's production budget",
            'id': 'dante_fraud',
        },
        {
            'keywords': ['lago', 'restaurant', '9:43', 'left early', 'dinner alibi'],
            'clue': "Dante's dinner alibi collapses — restaurant records show he left at 9:43 PM, not 11:00 PM",
            'id': 'dante_alibi',
        },
        {
            'keywords': ['shredder', 'shredded documents', 'office', 'destroying evidence'],
            'clue': "Dante's paper shredder was full the morning after — he was destroying financial documents",
            'id': 'dante_shredder',
        },
    ],
    'case003': [
        {
            'keywords': ['phantom accounts', 'ghost accounts', 'fake players', 'vip credit scheme'],
            'clue': '14 phantom player accounts were issued $1.2M in casino credit — all under Nina\'s authorization',
            'id': 'nina_phantom',
        },
        {
            'keywords': ['deactivated keycard', 'miguel santos', 'employee 2847', 'department hold'],
            'clue': "The deactivated keycard used to open the vault was kept active by a 'department hold' — only department heads can do this",
            'id': 'nina_keycard',
        },
        {
            'keywords': ['lexus', '1:12 am', 'parking garage', 'messenger bag', '2:35 am'],
            'clue': "Nina's car was at Caesar's from 1:12 AM to 2:35 AM — she left with a messenger bag she didn't arrive with",
            'id': 'nina_car',
        },
        {
            'keywords': ['missing audit files', 'home office', 'backup files', 'tommy files gone'],
            'clue': "The audit files from Tommy's home office are missing — someone took the backup evidence",
            'id': 'nina_files',
        },
        {
            'keywords': ['static feed', 'camera interrupt', 'vault camera', '1:25 am'],
            'clue': 'The vault corridor camera went to static at 1:25 AM — Greg failed to investigate',
            'id': 'greg_camera',
        },
        {
            'keywords': ['failed to flag', 'didn\'t report', 'negligence', 'protocol violation'],
            'clue': "Greg saw the deactivated keycard being used but didn't flag it — a critical failure",
            'id': 'greg_negligence',
        },
        {
            'keywords': ['frank navarro', 'former partner', 'evidence tampering', 'tommy testimony'],
            'clue': "Greg's former police partner was fired due to Tommy's testimony — a possible grudge",
            'id': 'greg_grudge',
        },
        {
            'keywords': ['gambling debt', '$85,000', 'sports betting', 'vinnie', 'horseshoe lounge'],
            'clue': "Luca owes $85,000 to an illegal sports betting operation on Fremont Street",
            'id': 'luca_debts',
        },
        {
            'keywords': ['will changed', 'inheritance reduced', 'cut out', '5%', 'scholarship fund'],
            'clue': "Tommy changed his will 3 weeks ago — Luca's share dropped from 60% to 5%",
            'id': 'luca_will',
        },
        {
            'keywords': ['golden gate', 'downtown alibi', 'blackjack tables', 'was gambling'],
            'clue': "Luca was actually at the Golden Gate casino during the murder — his alibi checks out but he lied about being home",
            'id': 'luca_alibi',
        },
    ],
}


def check_rules(case_id: str, user_msg: str, suspect_reply: str, already_found: list) -> tuple:
    """Check if the exchange reveals a new clue based on keyword rules.

    Args:
        case_id: The case identifier (e.g. 'case001').
        user_msg: The player's interrogation message.
        suspect_reply: The suspect's response.
        already_found: List of clue IDs already discovered.

    Returns:
        A tuple of (clue_text, clue_id) if a new clue is found, or (None, None).
    """
    combined = (user_msg + ' ' + suspect_reply).lower()
    rules = CLUE_RULES.get(case_id, [])
    for rule in rules:
        if any(kw in combined for kw in rule['keywords']) and rule['id'] not in already_found:
            return rule['clue'], rule['id']
    return None, None
