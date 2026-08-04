// Queen's MEDS 2028 clerkship rotation windows, by stream — DE-IDENTIFIED.
// Extracted from the official IntraTract schedules. Contains ONLY cohort-level
// rotation date ranges (identical for everyone in a stream); no names, no
// per-student rows, no locations. See vault/Resources/Curriculum.
//
// Mapping notes (so this stays honest — verify against your official schedule):
// - Section A is column-aligned: OBG, AN (Anesthesia), EM (Emergency), MS
//   (Medicine Selective ×2) and PEDS each map to their 2-week window(s).
// - Section B: MEDCORE→Internal Medicine (first 4 wks), PSYCH (next 4 wks),
//   then the Surgery block (subspecialties/selective/vacation permute per
//   student, so it's represented as one Surgery span).
// - Anesthesia / Emergency / Medicine Selective have no study deck in the app
//   yet, so they're carried as informational schedule blocks (ids in
//   EXTRA_BLOCKS, see lib/schedule.js) — they show "what you're on now" and
//   support exam countdowns, but aren't study tiles.
// - Tract selectives, Neurology and Family Medicine aren't in these two blocks
//   — add those yourself.
// - Exam dates aren't encoded (they weren't cohort-uniform in the source);
//   set them per rotation in the schedule editor.

export const QUEENS_MEDS2028 = {
  id: 'queens-meds2028',
  label: "Queen's MEDS 2028",
  streams: {
    '1': {
      label: 'Stream 1',
      rotations: {
        'internal-medicine': { start: '2026-09-14', end: '2026-10-11' },
        psychiatry: { start: '2026-10-12', end: '2026-11-08' },
        surgery: { start: '2026-11-09', end: '2027-01-17' },
        obgyn: { start: '2027-01-18', end: '2027-01-31' },
        anesthesia: { start: '2027-02-01', end: '2027-02-14' },
        emergency: { start: '2027-02-15', end: '2027-02-28' },
        medSelective: { start: '2027-03-01', end: '2027-03-28' },
        pediatrics: { start: '2027-03-29', end: '2027-04-11' },
      },
    },
    '2': {
      label: 'Stream 2',
      rotations: {
        'internal-medicine': { start: '2027-01-18', end: '2027-02-14' },
        psychiatry: { start: '2027-02-15', end: '2027-03-14' },
        surgery: { start: '2027-03-15', end: '2027-05-09' },
        obgyn: { start: '2027-05-24', end: '2027-06-06' },
        anesthesia: { start: '2027-06-07', end: '2027-06-20' },
        emergency: { start: '2027-06-21', end: '2027-07-04' },
        medSelective: { start: '2027-07-05', end: '2027-08-01' },
        pediatrics: { start: '2027-08-02', end: '2027-08-15' },
      },
    },
    '3': {
      label: 'Stream 3',
      rotations: {
        obgyn: { start: '2026-09-14', end: '2026-09-27' },
        anesthesia: { start: '2026-09-28', end: '2026-10-11' },
        emergency: { start: '2026-10-12', end: '2026-10-25' },
        medSelective: { start: '2026-10-26', end: '2026-11-22' },
        pediatrics: { start: '2026-11-23', end: '2026-12-06' },
        'internal-medicine': { start: '2027-05-24', end: '2027-06-20' },
        psychiatry: { start: '2027-06-21', end: '2027-07-18' },
        surgery: { start: '2027-07-19', end: '2027-09-12' },
      },
    },
  },
}
