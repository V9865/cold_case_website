import './SuspectAvatar.css';

// ══════════════════════════════════════════════════════════════════════
// SIZE MAP
// ══════════════════════════════════════════════════════════════════════
const SIZE_MAP = { xs: 24, sm: 32, md: 44, lg: 64 };

// ══════════════════════════════════════════════════════════════════════
// AVATAR DESIGNS — each is a function (size) => SVG string
// viewBox is always '0 0 64 64' for consistency
// ══════════════════════════════════════════════════════════════════════
const AVATAR_DESIGNS = {

  // ── CASE 001 — The Mirage Murder ────────────────────────────────────

  diana: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#0A0E1A"/>
    <path d="M16 56 Q24 46 30 44 L32 54 L34 44 Q40 46 48 56" fill="#1B2938"/>
    <path d="M30 44 L32 52 L34 44" fill="#111827"/>
    <ellipse cx="32" cy="26" rx="10" ry="12" fill="#D4B896"/>
    <path d="M22 20 Q26 12 32 12 Q38 12 42 20 Q42 22 40 22 Q38 16 32 16 Q26 16 24 22 Q22 22 22 20Z" fill="#1A1A2E"/>
    <ellipse cx="28" cy="24" rx="1.8" ry="1" fill="#1A1A1A"/>
    <ellipse cx="36" cy="24" rx="1.8" ry="1" fill="#1A1A1A"/>
    <path d="M29 30 Q32 32 35 30" stroke="#B8956A" stroke-width="0.8" fill="none"/>
  </svg>`,

  leo: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#0A0E1A"/>
    <path d="M18 56 Q24 46 30 44 L32 56 L34 44 Q40 46 46 56" fill="#4A0E2E"/>
    <rect x="30" y="42" width="4" height="6" fill="#D4AF37"/>
    <path d="M26 44 Q32 40 38 44" fill="#4A0E2E"/>
    <ellipse cx="32" cy="26" rx="11" ry="12" fill="#C68B5A"/>
    <path d="M22 18 Q24 10 32 10 Q40 10 42 18" fill="#1A1A1A"/>
    <ellipse cx="28" cy="24" rx="2" ry="1.2" fill="#1A1A1A"/>
    <ellipse cx="36" cy="24" rx="2" ry="1.2" fill="#1A1A1A"/>
    <path d="M27 32 Q32 35 37 32" stroke="#A0704A" stroke-width="1" fill="none"/>
  </svg>`,

  ray: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#0A0E1A"/>
    <path d="M12 56 Q20 44 28 42 L32 56 L36 42 Q44 44 52 56" fill="#1A1A2E"/>
    <ellipse cx="32" cy="26" rx="12" ry="13" fill="#8B7355"/>
    <rect x="20" y="23" width="10" height="5" rx="2" fill="#0A0A0A"/>
    <rect x="34" y="23" width="10" height="5" rx="2" fill="#0A0A0A"/>
    <line x1="30" y1="25" x2="34" y2="25" stroke="#222" stroke-width="1.2"/>
    <path d="M24 36 Q32 40 40 36" stroke="#7A6348" stroke-width="1.5" fill="none"/>
    <path d="M22 16 Q32 12 42 16" stroke="#0A0A0A" stroke-width="3" fill="none"/>
  </svg>`,

  detective_001: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#0A0A0A"/>
    <!-- Trenchcoat collar -->
    <path d="M16 58 Q22 48 28 44 L30 46 L26 56" fill="#2A2A2A"/>
    <path d="M48 58 Q42 48 36 44 L34 46 L38 56" fill="#2A2A2A"/>
    <path d="M26 44 Q32 40 38 44 L36 48 Q32 45 28 48Z" fill="#1A1A1A"/>
    <!-- Shirt & tie -->
    <path d="M30 44 L32 52 L34 44" fill="#8B0000" opacity="0.9"/>
    <rect x="30.5" y="44" width="3" height="2" rx="0.5" fill="#E8E8E8" opacity="0.3"/>
    <!-- Face -->
    <ellipse cx="32" cy="28" rx="10" ry="11" fill="#C8A882"/>
    <!-- Jaw shadow -->
    <path d="M24 32 Q28 38 32 38 Q36 38 40 32" fill="#B89870" opacity="0.4"/>
    <!-- Eyes -->
    <ellipse cx="28" cy="27" rx="1.5" ry="1" fill="#1A1A1A"/>
    <ellipse cx="36" cy="27" rx="1.5" ry="1" fill="#1A1A1A"/>
    <!-- Eyebrows -->
    <path d="M25 24.5 Q28 23 30 24" stroke="#3A2A1A" stroke-width="1.2" fill="none"/>
    <path d="M34 24 Q36 23 39 24.5" stroke="#3A2A1A" stroke-width="1.2" fill="none"/>
    <!-- Nose -->
    <path d="M32 28 L31 31 L33 31" stroke="#B89870" stroke-width="0.6" fill="none"/>
    <!-- Mouth -->
    <path d="M29 33.5 Q32 35 35 33.5" stroke="#A08060" stroke-width="0.8" fill="none"/>
    <!-- Fedora -->
    <ellipse cx="32" cy="19" rx="16" ry="3" fill="#1A1A1A"/>
    <path d="M18 19 Q20 8 32 7 Q44 8 46 19" fill="#222222"/>
    <path d="M18 19 Q20 10 32 9 Q44 10 46 19" fill="#2A2A2A"/>
    <!-- Hat band -->
    <rect x="20" y="17" width="24" height="2.5" rx="1" fill="#8B0000" opacity="0.8"/>
    <!-- Hat highlight -->
    <path d="M24 12 Q32 10 40 12" stroke="#3A3A3A" stroke-width="0.5" fill="none"/>
  </svg>`,

  // ── CASE 002 — Neon Requiem ─────────────────────────────────────────

  rena: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#0A0E1A"/>
    <path d="M16 56 Q24 46 30 44 L32 54 L34 44 Q40 46 48 56" fill="#1A0A1A"/>
    <ellipse cx="32" cy="27" rx="10" ry="12" fill="#D4B896"/>
    <path d="M20 22 Q22 10 32 8 Q36 8 38 12 Q42 8 46 14 Q44 20 40 22" fill="#2A1520" opacity="0.95"/>
    <path d="M18 22 Q20 28 18 38" stroke="#2A1520" stroke-width="3" fill="none"/>
    <path d="M46 22 Q44 28 46 38" stroke="#2A1520" stroke-width="3" fill="none"/>
    <ellipse cx="28" cy="25" rx="1.8" ry="2" fill="#1A1A1A"/>
    <ellipse cx="36" cy="25" rx="1.8" ry="2" fill="#1A1A1A"/>
    <path d="M29 31 Q32 34 35 31" stroke="#B8956A" stroke-width="0.8" fill="#C46060" opacity="0.6"/>
    <circle cx="26" cy="28" r="1" fill="#FF6B8A" opacity="0.3"/>
    <circle cx="38" cy="28" r="1" fill="#FF6B8A" opacity="0.3"/>
  </svg>`,

  marco: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#0A0E1A"/>
    <path d="M18 56 Q24 46 30 44 L32 56 L34 44 Q40 46 46 56" fill="#1A2030"/>
    <rect x="29" y="42" width="6" height="4" rx="1" fill="#2A3040"/>
    <ellipse cx="32" cy="26" rx="11" ry="12" fill="#C68B5A"/>
    <path d="M20 20 Q24 14 32 14 Q40 14 44 20 Q44 22 42 21 Q38 16 32 16 Q26 16 22 21 Q20 22 20 20Z" fill="#1A1A2E"/>
    <rect x="25" y="23" width="5" height="3.5" rx="1.5" fill="none" stroke="#00D4FF" stroke-width="0.8"/>
    <rect x="34" y="23" width="5" height="3.5" rx="1.5" fill="none" stroke="#00D4FF" stroke-width="0.8"/>
    <line x1="30" y1="24.5" x2="34" y2="24.5" stroke="#00D4FF" stroke-width="0.6"/>
    <path d="M18 22 Q18 18 22 20" stroke="#333" stroke-width="2" fill="none"/>
    <circle cx="16" cy="24" r="2.5" fill="none" stroke="#333" stroke-width="1.5"/>
    <path d="M29 32 Q32 34 35 32" stroke="#A0704A" stroke-width="0.8" fill="none"/>
  </svg>`,

  dante: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#0A0E1A"/>
    <path d="M16 56 Q24 46 30 44 L32 54 L34 44 Q40 46 48 56" fill="#2A1A2A"/>
    <path d="M30 44 L32 52 L34 44" fill="#D4AF37" opacity="0.6"/>
    <rect x="30" y="42" width="4" height="3" fill="#D4AF37" opacity="0.3"/>
    <ellipse cx="32" cy="26" rx="11" ry="12" fill="#C08050"/>
    <path d="M20 20 Q22 10 32 10 Q42 10 44 20 Q44 22 42 18 Q38 14 32 14 Q26 14 22 18 Q20 22 20 20Z" fill="#0A0A0A"/>
    <path d="M20 20 Q22 18 26 17" stroke="#0A0A0A" stroke-width="1.5" fill="none"/>
    <ellipse cx="28" cy="24" rx="2" ry="1.2" fill="#1A1A1A"/>
    <ellipse cx="36" cy="24" rx="2" ry="1.2" fill="#1A1A1A"/>
    <path d="M24 22 L28 21" stroke="#0A0A0A" stroke-width="1.2" fill="none"/>
    <path d="M36 21 L40 22" stroke="#0A0A0A" stroke-width="1.2" fill="none"/>
    <path d="M28 32 Q32 35 36 32" stroke="#A06030" stroke-width="1" fill="none"/>
  </svg>`,

  detective_002: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#06101A"/>
    <!-- Jacket -->
    <path d="M16 58 Q22 48 28 44 L30 46 L24 58" fill="#1A2A3A"/>
    <path d="M48 58 Q42 48 36 44 L34 46 L40 58" fill="#1A2A3A"/>
    <path d="M28 44 Q32 41 36 44 L34 48 Q32 46 30 48Z" fill="#0F1F2F"/>
    <!-- Shirt collar -->
    <path d="M30 44 L32 48 L34 44" fill="#E0E8F0" opacity="0.4"/>
    <!-- Badge -->
    <path d="M22 50 L24 48 L26 50 L25 52 L23 52Z" fill="#00CED1" opacity="0.7"/>
    <circle cx="24" cy="50" r="1" fill="#06101A"/>
    <!-- Face -->
    <ellipse cx="32" cy="28" rx="10" ry="11" fill="#C8A882"/>
    <!-- Jaw shadow -->
    <path d="M24 32 Q28 38 32 38 Q36 38 40 32" fill="#B89870" opacity="0.3"/>
    <!-- Eyes -->
    <ellipse cx="28" cy="27" rx="1.5" ry="1" fill="#1A1A1A"/>
    <ellipse cx="36" cy="27" rx="1.5" ry="1" fill="#1A1A1A"/>
    <!-- Eyebrows -->
    <path d="M25 25 Q28 24 30 25" stroke="#3A2A1A" stroke-width="1" fill="none"/>
    <path d="M34 25 Q36 24 39 25" stroke="#3A2A1A" stroke-width="1" fill="none"/>
    <!-- Nose -->
    <path d="M32 28 L31 31 L33 31" stroke="#B89870" stroke-width="0.6" fill="none"/>
    <!-- Mouth -->
    <path d="M29 34 Q32 35.5 35 34" stroke="#A08060" stroke-width="0.8" fill="none"/>
    <!-- Hair — neat, short -->
    <path d="M22 22 Q24 12 32 11 Q40 12 42 22 Q42 18 38 15 Q34 13 32 13 Q30 13 26 15 Q22 18 22 22Z" fill="#1A1A2E"/>
    <!-- Part line -->
    <path d="M28 14 Q30 12 32 13" stroke="#0A0A1A" stroke-width="0.8" fill="none"/>
    <!-- 5 o'clock shadow -->
    <path d="M26 32 Q28 36 32 37 Q36 36 38 32" fill="#A08060" opacity="0.15"/>
  </svg>`,

  // ── CASE 003 — The Jackpot Heist ───────────────────────────────────

  nina: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#0A0A14"/>
    <path d="M16 56 Q24 46 30 44 L32 54 L34 44 Q40 46 48 56" fill="#1A1A2E"/>
    <path d="M28 44 L32 48 L36 44" fill="#8B5CF6" opacity="0.3"/>
    <ellipse cx="32" cy="26" rx="10" ry="12" fill="#D4B896"/>
    <path d="M20 20 Q22 10 32 8 Q42 10 44 20 Q44 22 40 20 Q36 14 32 14 Q28 14 24 20 Q20 22 20 20Z" fill="#0A0A14"/>
    <path d="M20 20 Q18 24 16 32" stroke="#0A0A14" stroke-width="2.5" fill="none"/>
    <path d="M44 20 Q46 24 48 32" stroke="#0A0A14" stroke-width="2.5" fill="none"/>
    <ellipse cx="28" cy="24" rx="1.8" ry="1.2" fill="#1A1A1A"/>
    <ellipse cx="36" cy="24" rx="1.8" ry="1.2" fill="#1A1A1A"/>
    <path d="M24 22 L29 21" stroke="#1A1A1A" stroke-width="1" fill="none"/>
    <path d="M35 21 L40 22" stroke="#1A1A1A" stroke-width="1" fill="none"/>
    <path d="M29 31 Q32 33 35 31" stroke="#B8956A" stroke-width="0.8" fill="none"/>
  </svg>`,

  greg: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#0A0A14"/>
    <path d="M14 56 Q22 44 28 42 L32 56 L36 42 Q42 44 50 56" fill="#2A2A2A"/>
    <ellipse cx="32" cy="27" rx="13" ry="14" fill="#C08050"/>
    <rect x="20" y="14" width="24" height="8" rx="2" fill="#3A3A3A"/>
    <rect x="22" y="16" width="20" height="4" rx="1" fill="#4A4A4A"/>
    <ellipse cx="27" cy="25" rx="2.5" ry="1.5" fill="#1A1A1A"/>
    <ellipse cx="37" cy="25" rx="2.5" ry="1.5" fill="#1A1A1A"/>
    <path d="M22 23 L26 22" stroke="#1A1A1A" stroke-width="1.5" fill="none"/>
    <path d="M38 22 L42 23" stroke="#1A1A1A" stroke-width="1.5" fill="none"/>
    <path d="M27 34 L37 34" stroke="#A06030" stroke-width="1.5" fill="none"/>
    <path d="M26 30 Q28 29 30 30" stroke="#A06030" stroke-width="0.8" fill="none"/>
    <path d="M34 30 Q36 29 38 30" stroke="#A06030" stroke-width="0.8" fill="none"/>
  </svg>`,

  luca: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#0A0A14"/>
    <path d="M18 56 Q24 46 30 44 L32 54 L34 44 Q40 46 46 56" fill="#1E1E2E"/>
    <path d="M30 44 L32 50 L34 44" fill="#2A2A3A"/>
    <ellipse cx="32" cy="27" rx="10" ry="12" fill="#D4B896"/>
    <path d="M22 20 Q24 12 28 10 Q26 16 28 18" fill="#2A1A10" opacity="0.9"/>
    <path d="M28 10 Q32 8 36 10 Q34 14 32 16 Q30 14 28 10Z" fill="#2A1A10" opacity="0.9"/>
    <path d="M36 10 Q40 12 42 20 Q40 18 38 16 Q38 12 36 10Z" fill="#2A1A10" opacity="0.9"/>
    <path d="M24 18 Q22 14 24 10" stroke="#2A1A10" stroke-width="2" fill="none"/>
    <path d="M40 18 Q42 14 40 10" stroke="#2A1A10" stroke-width="2" fill="none"/>
    <ellipse cx="28" cy="25" rx="1.5" ry="1.2" fill="#1A1A1A"/>
    <ellipse cx="36" cy="25" rx="1.5" ry="1.2" fill="#1A1A1A"/>
    <path d="M27 31 Q32 35 37 31" stroke="#B8956A" stroke-width="1" fill="none"/>
    <path d="M29 33 Q32 34 35 33" fill="#C46060" opacity="0.4"/>
  </svg>`,

  detective_003: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#0A0A0A"/>
    <!-- Tactical vest -->
    <path d="M16 58 Q22 48 27 44 L28 46 L22 58" fill="#1A1A2E"/>
    <path d="M48 58 Q42 48 37 44 L36 46 L42 58" fill="#1A1A2E"/>
    <path d="M27 44 Q32 41 37 44 L35 48 Q32 46 29 48Z" fill="#0F0F1E"/>
    <!-- Vest straps -->
    <line x1="24" y1="48" x2="26" y2="56" stroke="#8B5CF6" stroke-width="0.8" opacity="0.5"/>
    <line x1="40" y1="48" x2="38" y2="56" stroke="#8B5CF6" stroke-width="0.8" opacity="0.5"/>
    <!-- Collar -->
    <path d="M29 44 L32 47 L35 44" fill="#2A2A3E" opacity="0.6"/>
    <!-- Face -->
    <ellipse cx="32" cy="28" rx="10" ry="11" fill="#D4B896"/>
    <!-- Jaw shadow -->
    <path d="M24 32 Q28 38 32 38 Q36 38 40 32" fill="#C0A480" opacity="0.3"/>
    <!-- Eyes — narrow, focused -->
    <ellipse cx="28" cy="27" rx="1.8" ry="0.9" fill="#1A1A1A"/>
    <ellipse cx="36" cy="27" rx="1.8" ry="0.9" fill="#1A1A1A"/>
    <!-- Eyebrows — sharp -->
    <path d="M24.5 24.5 Q27 23 30 24.5" stroke="#2A1A10" stroke-width="1.3" fill="none"/>
    <path d="M34 24.5 Q37 23 39.5 24.5" stroke="#2A1A10" stroke-width="1.3" fill="none"/>
    <!-- Nose -->
    <path d="M32 28.5 L31 31 L33 31" stroke="#C0A480" stroke-width="0.6" fill="none"/>
    <!-- Mouth — firm line -->
    <path d="M29 34 L35 34" stroke="#A08060" stroke-width="0.8" fill="none"/>
    <!-- Hair — cropped tight -->
    <path d="M22 22 Q24 13 32 12 Q40 13 42 22 Q42 17 38 14 Q34 12 32 12 Q30 12 26 14 Q22 17 22 22Z" fill="#1A1A1A"/>
    <!-- Buzzcut texture -->
    <path d="M26 16 Q32 14 38 16" stroke="#2A2A2A" stroke-width="0.4" fill="none"/>
    <path d="M25 18 Q32 16 39 18" stroke="#2A2A2A" stroke-width="0.4" fill="none"/>
    <!-- Earpiece -->
    <circle cx="43" cy="28" r="2" fill="#1A1A2E" stroke="#8B5CF6" stroke-width="0.8"/>
    <path d="M43 30 Q44 34 42 38" stroke="#8B5CF6" stroke-width="0.6" opacity="0.6" fill="none"/>
    <!-- Scar -->
    <path d="M38 30 L40 33" stroke="#C8A070" stroke-width="0.6" opacity="0.5" fill="none"/>
  </svg>`,
};

// ══════════════════════════════════════════════════════════════════════
// GENERIC FALLBACK — detective badge with gold shield outline
// ══════════════════════════════════════════════════════════════════════
const FALLBACK_AVATAR = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="32" fill="#0A0E1A"/>
  <path d="M32 16 L38 22 L44 22 L40 28 L42 36 L32 31 L22 36 L24 28 L20 22 L26 22Z" fill="none" stroke="#D4AF37" stroke-width="1.5"/>
  <circle cx="32" cy="26" r="3" fill="none" stroke="#D4AF37" stroke-width="1"/>
</svg>`;

// ══════════════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════════════
export default function SuspectAvatar({
  characterId,
  size = 'md',
  caseId,
  withName = false,
}) {
  const px = SIZE_MAP[size] || SIZE_MAP.md;

  // Normalise characterId to snake_case lowercase key
  let key = characterId
    ? characterId.toLowerCase().replace(/\s+/g, '_')
    : null;

  // Special case: 'detective' + caseId → 'detective_001', etc.
  if (key === 'detective' && caseId) {
    key = `detective_${String(caseId).padStart(3, '0')}`;
  }

  const designFn = key && AVATAR_DESIGNS[key] ? AVATAR_DESIGNS[key] : FALLBACK_AVATAR;
  const svgString = designFn(px);

  return (
    <div className="suspect-avatar">
      <div
        className="suspect-avatar__circle"
        style={{ width: px, height: px }}
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
      {withName && key && (
        <span className="suspect-avatar__name">
          {characterId}
        </span>
      )}
    </div>
  );
}
