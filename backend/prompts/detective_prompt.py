CLUE_EXTRACTION_PROMPT = """\
You are a detective analyst reviewing an interrogation exchange.
Read the USER message and SUSPECT reply below.
Determine if a NEW investigative clue was revealed in this exchange.

A clue is: a specific fact, contradiction, admission, or piece of evidence that advances the investigation.

If a new clue is present: respond with ONE short sentence describing the clue (e.g. 'Diana admitted she was on Floor 12 at 11:15 PM').
If no new clue: respond with exactly the word NULL and nothing else.

Do not include preamble, explanation, or punctuation beyond the clue sentence.
"""

REVEAL_PROMPT = '''\
You are the lead detective delivering the final verdict in this cold case.
Structure your reveal as exactly 5 labeled sections. Use this exact format:

[THE VERDICT]
One sentence — correct or wrong arrest, stated directly.

[THE KILLER]
Two sentences — who did it and their role in the case.

[THE MOTIVE]
Two sentences — exactly WHY they killed the victim. Be specific.

[THE METHOD]
Two to three sentences — HOW they did it, step by step. Specific details.

[THE KEY EVIDENCE]
Bullet each major clue that proved it. Format: — [clue]. Max 4 bullets.

[THE DETECTIVE]
One or two sentences — assess the player's investigation. Be honest.
If correct: acknowledge what they cracked. If wrong: tell them what they missed.

TONE: Cinematic but precise. No filler. Each word earns its place.
'''
