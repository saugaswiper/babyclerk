// High-yield starter content for Surgery.
export default {
  id: 'surgery',
  name: 'Surgery',
  emoji: '🔪',
  blurb: 'Acute abdomen, peri-operative care, and the surgical sieve under pressure.',
  checklist: [
    'Know the WHO surgical safety checklist',
    'Be able to take a focused acute-abdomen history fast',
    'Memorise fluid resuscitation + maintenance for an adult',
    'Understand NBM/“nil by mouth” and pre-op fasting rules',
    'Be slick at scrubbing in and maintaining a sterile field',
    'Know your patient’s diagnosis, planned op, and consent issues',
    'Carry a structured post-op complication framework',
  ],
  notes: [
    {
      id: 'surg-note-abdo',
      title: 'The Acute Abdomen',
      topic: 'General Surgery',
      sections: [
        {
          heading: 'Localise the pain',
          points: [
            'RIF: appendicitis, Crohn’s, ovarian/ectopic, mesenteric adenitis',
            'RUQ: cholecystitis, cholangitis, hepatitis',
            'Epigastric: pancreatitis, peptic ulcer, MI',
            'Loin → groin: renal colic; central → RIF migration: appendicitis',
          ],
        },
        {
          heading: 'Red flags for surgical emergency',
          points: [
            'Peritonism (guarding, rigidity, rebound) → perforation',
            'Shock with abdominal pain → ruptured AAA, ectopic, bleeding',
            'Absolute constipation + distension + vomiting → obstruction',
          ],
        },
        {
          heading: 'Initial workup',
          points: [
            'Bloods: FBC, U&E, CRP, amylase/lipase, LFTs, G&S, VBG/lactate',
            'βhCG in any woman of childbearing age',
            'Erect CXR (free air), AXR, and CT/USS as indicated',
          ],
        },
      ],
    },
    {
      id: 'surg-note-periop',
      title: 'Peri-operative Care',
      topic: 'Peri-op',
      sections: [
        {
          heading: 'Fasting (pre-op)',
          points: ['No solids 6 hours pre-op', 'Clear fluids allowed up to 2 hours pre-op'],
        },
        {
          heading: 'Post-op complications by timing',
          points: [
            'Immediate: primary haemorrhage, anaesthetic reaction',
            'Early (days): infection, atelectasis, ileus, VTE, anastomotic leak',
            'Late: incisional hernia, adhesions, strictures',
          ],
        },
        {
          heading: 'Post-op pyrexia (the 5 W’s)',
          points: ['Wind (atelectasis/pneumonia)', 'Water (UTI)', 'Wound', 'Walking (DVT/PE)', 'Wonder drugs / lines'],
        },
      ],
    },
    {
      id: 'surg-note-fluids',
      title: 'IV Fluids',
      topic: 'Peri-op',
      sections: [
        {
          heading: 'The 5 R’s',
          points: ['Resuscitation', 'Routine maintenance', 'Replacement', 'Redistribution', 'Reassessment'],
        },
        {
          heading: 'Adult maintenance (per 24h)',
          points: ['~25–30 mL/kg water', '~1 mmol/kg Na⁺, K⁺, Cl⁻', '~50–100 g glucose to limit ketosis'],
        },
      ],
    },
  ],
  flashcards: [
    { id: 'surg-fc-1', topic: 'General Surgery', front: 'Boas’ sign', back: 'Hyperaesthesia below the right scapula — associated with acute cholecystitis.' },
    { id: 'surg-fc-2', topic: 'General Surgery', front: 'Murphy’s sign', back: 'Pain and arrest of inspiration on palpation of the RUQ during deep breath — acute cholecystitis (must be negative on the left).' },
    { id: 'surg-fc-3', topic: 'General Surgery', front: 'Rovsing’s sign', back: 'Palpation of the LIF causes pain in the RIF — suggests appendicitis.' },
    { id: 'surg-fc-4', topic: 'General Surgery', front: 'Charcot’s triad', back: 'Fever, RUQ pain, jaundice — ascending cholangitis. Add hypotension + confusion = Reynolds’ pentad.' },
    { id: 'surg-fc-5', topic: 'General Surgery', front: 'Causes of bowel obstruction (small vs large)', back: 'Small bowel: adhesions (most common), hernias. Large bowel: malignancy (most common), volvulus, diverticular stricture.' },
    { id: 'surg-fc-6', topic: 'Vascular', front: 'The 6 P’s of acute limb ischaemia', back: 'Pain, Pallor, Pulselessness, Perishing cold, Paraesthesia, Paralysis. Paraesthesia and paralysis are the limb-threatening late signs.' },
    { id: 'surg-fc-7', topic: 'General Surgery', front: 'Glasgow / modified criteria use in pancreatitis', back: 'Severity scoring (PANCREAS): PaO₂, Age, Neutrophils/WCC, Calcium, Renal urea, Enzymes (LDH/AST), Albumin, Sugar (glucose).' },
    { id: 'surg-fc-8', topic: 'Peri-op', front: 'ASA grade meaning', back: 'ASA I healthy → II mild systemic disease → III severe systemic disease → IV constant threat to life → V moribund → VI brain-dead organ donor. “E” suffix = emergency.' },
    { id: 'surg-fc-9', topic: 'General Surgery', front: 'Hernia: difference between incarcerated and strangulated', back: 'Incarcerated = irreducible contents. Strangulated = compromised blood supply (tender, erythematous, systemically unwell) — a surgical emergency.' },
    { id: 'surg-fc-10', topic: 'Vascular', front: 'Triad of ruptured AAA', back: 'Abdominal/back/flank pain, hypotension/collapse, and a pulsatile expansile abdominal mass. Do NOT delay for imaging if unstable — straight to theatre.' },
  ],
  viva: [
    { id: 'surg-viva-1', topic: 'General Surgery', question: 'A 24-year-old has right iliac fossa pain. How do you approach this?', answer: 'Focused history (migration from central to RIF, anorexia, nausea) and examination for peritonism, plus βhCG in all women. Bloods including FBC, CRP and G&S. Appendicitis is the lead diagnosis but consider gynaecological causes (ectopic, ovarian torsion), Crohn’s, and mesenteric adenitis. Imaging (USS/CT) if uncertain, analgesia and fluids, and involve seniors for surgical assessment.' },
    { id: 'surg-viva-2', topic: 'Peri-op', question: 'How would you assess a post-operative patient who has become febrile on day 3?', answer: 'Work through the 5 W’s: Wind (atelectasis/chest infection), Water (UTI), Wound (surgical site), Walking (DVT/PE), and Wonder drugs/lines. ABCDE, examine the wound and chest, review the drug chart and lines, and request targeted investigations (cultures, CXR, urine, Doppler). Treat the source and escalate concerns of anastomotic leak or sepsis.' },
    { id: 'surg-viva-3', topic: 'General Surgery', question: 'What are the key principles of managing bowel obstruction?', answer: '“Drip and suck”: nil by mouth, NG tube on free drainage to decompress, and IV fluids with electrolyte correction. Catheterise and monitor fluid balance, give analgesia and anti-emetics, and image with CT to find the cause and level. Many small-bowel adhesional cases settle conservatively; closed-loop, ischaemia or perforation need surgery.' },
    { id: 'surg-viva-4', topic: 'Vascular', question: 'A patient presents with a cold, painful, pulseless leg. What is your concern and approach?', answer: 'Acute limb ischaemia — the 6 P’s. This is a limb-threatening emergency. Assess for the embolic vs thrombotic cause, give analgesia and high-flow oxygen, start anticoagulation (IV heparin) and urgently involve vascular surgery. Time is muscle — revascularisation (embolectomy, bypass or thrombolysis) is needed within hours.' },
    { id: 'surg-viva-5', topic: 'Peri-op', question: 'How do you prescribe maintenance IV fluids for a stable adult?', answer: 'Roughly 25–30 mL/kg/day of water, with about 1 mmol/kg/day each of sodium, potassium and chloride, and 50–100 g/day of glucose to limit starvation ketosis. Reassess clinically and with electrolytes, account for losses, and avoid over-prescription which causes oedema and hyponatraemia.' },
  ],
  mcqs: [
    {
      id: 'surg-mcq-1', topic: 'General Surgery',
      question: 'A 45-year-old has fever, RUQ pain and jaundice. Which named triad does this represent?',
      options: ['Beck’s triad', 'Charcot’s triad', 'Virchow’s triad', 'Cushing’s triad'],
      answer: 1,
      explanation: 'Fever + RUQ pain + jaundice = Charcot’s triad of ascending cholangitis. Adding hypotension and confusion gives Reynolds’ pentad.',
    },
    {
      id: 'surg-mcq-2', topic: 'General Surgery',
      question: 'What is the single most common cause of small bowel obstruction in the developed world?',
      options: ['Malignancy', 'Adhesions', 'Hernia', 'Volvulus'],
      answer: 1,
      explanation: 'Post-operative adhesions are the leading cause of small bowel obstruction. Malignancy is the most common cause of large bowel obstruction.',
    },
    {
      id: 'surg-mcq-3', topic: 'Peri-op',
      question: 'According to standard guidance, clear fluids may be taken up to how long before surgery?',
      options: ['1 hour', '2 hours', '4 hours', '6 hours'],
      answer: 1,
      explanation: 'Clear fluids are allowed up to 2 hours pre-op; solids should stop 6 hours before.',
    },
    {
      id: 'surg-mcq-4', topic: 'Vascular',
      question: 'A hypotensive 70-year-old smoker has sudden severe back pain and a pulsatile abdominal mass. Best next step?',
      options: ['CT angiogram then review tomorrow', 'Immediate surgical/vascular involvement for likely ruptured AAA', 'Oral analgesia and discharge', 'Bedside echocardiogram'],
      answer: 1,
      explanation: 'This is a ruptured AAA until proven otherwise. An unstable patient goes straight to theatre — do not delay for imaging.',
    },
    {
      id: 'surg-mcq-5', topic: 'General Surgery',
      question: 'Which sign describes pain in the RIF when the LIF is palpated?',
      options: ['Murphy’s sign', 'Rovsing’s sign', 'Boas’ sign', 'Cullen’s sign'],
      answer: 1,
      explanation: 'Rovsing’s sign supports appendicitis. Murphy’s = cholecystitis, Boas’ = referred cholecystitis hyperaesthesia, Cullen’s = periumbilical bruising (e.g. pancreatitis).',
    },
  ],
}
