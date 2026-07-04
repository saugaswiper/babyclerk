// High-yield starter content for Internal Medicine.
// Edit freely — add/remove items in any array. IDs just need to be unique within the rotation.
export default {
  id: 'internal-medicine',
  name: 'Internal Medicine',
  emoji: '🩺',
  blurb: 'Workhorse rotation: acute management, chronic disease, and the daily presentation.',
  checklist: [
    'CTU (KGH Connell 9/10): pass = 60% on the ~100-MCQ exit exam',
    'Log all mandatory CTU encounters on Elentra early — don’t leave them to the end',
    'Have a slick CTU consult note ready for ED consults on call (from 5PM)',
    'Be able to present a full SOAP note from memory',
    'Know your patients’ meds, doses, and why they’re on them',
    'Read up on each new admission’s top differential before rounds',
    'Practice interpreting an ABG and a basic ECG daily',
    'Have a one-line summary + plan ready for every patient',
  ],
  notes: [
    {
      id: 'im-note-queens',
      title: 'Queen’s Rotation Guide — Medicine Core (CTU)',
      topic: 'Queen’s',
      sections: [
        {
          heading: 'Format',
          points: [
            '~4-week CTU block at KGH (Connell 9 or 10)',
            'Team (A/B/C/D/G) = you + another clerk, 2–3 residents, an attending (attendings change every 2 weeks)',
            '4–5 overnight call shifts including at least one weekend; you carry a pager on call',
            'On call: pick up CTU consults in the ED (“CTU Consult”, Section A) from 5PM; write the consult note, then review with your attending ~7–8AM',
          ],
        },
        {
          heading: 'Assessment',
          points: ['Pass = 60% on the CTU exit exam (~100 MCQ)', 'Log all mandatory encounters on Elentra (there are a lot — start early)'],
        },
        {
          heading: 'High-yield to review',
          points: [
            'Delirium (DIMS), upper & lower GI bleeds, CHF, anemia, AKI',
            'Empiric antibiotics for cellulitis, pneumonia, UTI — note inpatient vs outpatient choices',
            'Structured approaches to shortness of breath, syncope, and weakness/falls',
          ],
        },
        {
          heading: 'Resources',
          points: ['UWorld (tough & US-oriented — don’t be discouraged)', 'Toronto Notes + your pre-clerkship notes', 'A pocket/on-call handbook', 'UpToDate (attendings will ask what it says)'],
        },
      ],
    },
    {
      id: 'im-note-cp',
      title: 'Acute Chest Pain Approach',
      topic: 'Cardiology',
      sections: [
        {
          heading: 'Cannot-miss differentials',
          points: [
            'ACS (STEMI / NSTEMI / unstable angina)',
            'Aortic dissection (tearing pain to back, unequal BP/pulses)',
            'Pulmonary embolism (pleuritic, tachycardia, hypoxia)',
            'Tension pneumothorax, pericardial tamponade, oesophageal rupture',
          ],
        },
        {
          heading: 'Immediate workup',
          points: [
            'ECG within 10 minutes of arrival',
            'Troponin (serial), CXR, FBC, U&E, coagulation',
            'Continuous cardiac monitoring + IV access + oxygen if hypoxic',
          ],
        },
        {
          heading: 'Initial ACS management (MONA-BASH idea)',
          points: [
            'Aspirin 300 mg, second antiplatelet per protocol',
            'Nitrates for ongoing pain (avoid if hypotensive / RV infarct)',
            'Anticoagulation, analgesia, and urgent PCI for STEMI',
          ],
        },
      ],
    },
    {
      id: 'im-note-aki',
      title: 'Acute Kidney Injury',
      topic: 'Nephrology',
      sections: [
        {
          heading: 'Classify the cause',
          points: [
            'Pre-renal: hypovolaemia, sepsis, cardiorenal (most common)',
            'Intrinsic: ATN, glomerulonephritis, interstitial nephritis, contrast/drugs',
            'Post-renal: obstruction — always rule out with bladder scan / USS',
          ],
        },
        {
          heading: 'KDIGO staging (creatinine OR urine output)',
          points: [
            'Stage 1: creatinine 1.5–1.9× baseline',
            'Stage 2: 2.0–2.9× baseline',
            'Stage 3: ≥3× baseline or need for dialysis',
          ],
        },
        {
          heading: 'Management priorities',
          points: [
            'Treat the cause; optimise fluids and perfusion',
            'Stop nephrotoxins (NSAIDs, ACEi/ARB, contrast)',
            'Watch for hyperkalaemia, acidosis, fluid overload — dialysis indications (AEIOU)',
          ],
        },
      ],
    },
    {
      id: 'im-note-sepsis',
      title: 'Sepsis & the Sepsis Six',
      topic: 'Acute Medicine',
      sections: [
        {
          heading: 'Give three (within 1 hour)',
          points: ['Oxygen to target sats', 'IV fluids (balanced crystalloid)', 'IV broad-spectrum antibiotics'],
        },
        {
          heading: 'Take three',
          points: ['Blood cultures (before antibiotics)', 'Serum lactate', 'Urine output / fluid balance'],
        },
      ],
    },
  ],
  flashcards: [
    { id: 'im-fc-1', topic: 'Cardiology', front: 'ECG criteria for STEMI', back: 'ST elevation ≥1 mm in ≥2 contiguous limb leads, or ≥2 mm in ≥2 contiguous chest leads (≥1.5 mm in women for V2–V3), or new LBBB with ischaemic symptoms.' },
    { id: 'im-fc-2', topic: 'Endocrine', front: 'Diagnostic thresholds for diabetes (Diabetes Canada)', back: 'A1C ≥6.5%, fasting glucose ≥7.0 mmol/L, or 2-h OGTT / random ≥11.1 mmol/L. Need a repeat (or second) abnormal test if asymptomatic.' },
    { id: 'im-fc-3', topic: 'Respiratory', front: 'CURB-65 components', back: 'Confusion, Urea >7 mmol/L, RR ≥30, BP <90 systolic or ≤60 diastolic, age ≥65. Each = 1 point; guides admission/severity in pneumonia.' },
    { id: 'im-fc-4', topic: 'Gastro', front: 'First-line management of upper GI bleed (variceal)', back: 'ABC + resuscitate, terlipressin + prophylactic antibiotics, urgent endoscopy (band ligation) within 24h. Risk-stratify with Glasgow-Blatchford.' },
    { id: 'im-fc-5', topic: 'Nephrology', front: 'ECG changes of hyperkalaemia (in order)', back: 'Tall tented T waves → flattened P waves → prolonged PR → widened QRS → sine wave → VF/asystole.' },
    { id: 'im-fc-6', topic: 'Nephrology', front: 'Emergency management of hyperkalaemia', back: 'IV calcium gluconate (cardioprotection), insulin + dextrose and salbutamol (shift K+ into cells), then remove K+ (diuresis, dialysis, binders).' },
    { id: 'im-fc-7', topic: 'Endocrine', front: 'DKA diagnostic triad', back: 'Hyperglycaemia (>11 mmol/L), ketonaemia/ketonuria (≥3 mmol/L), acidosis (pH <7.3 or bicarbonate <15). Treat: fluids first, then fixed-rate insulin, replace K+.' },
    { id: 'im-fc-8', topic: 'Haematology', front: 'Causes of macrocytic anaemia', back: 'Megaloblastic: B12/folate deficiency. Non-megaloblastic: alcohol, liver disease, hypothyroidism, myelodysplasia, drugs (methotrexate).' },
    { id: 'im-fc-9', topic: 'Respiratory', front: 'Light’s criteria for an exudative effusion', back: 'Exudate if any: pleural/serum protein >0.5, pleural/serum LDH >0.6, or pleural LDH >2/3 upper limit of normal serum LDH.' },
    { id: 'im-fc-10', topic: 'Cardiology', front: 'First-line rate control in AF', back: 'Beta-blocker or rate-limiting calcium-channel blocker (diltiazem/verapamil). Digoxin if sedentary/heart failure. Anticoagulate per CHA₂DS₂-VASc.' },
    { id: 'im-fc-11', topic: 'Acute Medicine', front: 'qSOFA criteria', back: 'RR ≥22, altered mentation (GCS <15), systolic BP ≤100. ≥2 suggests higher mortality risk in suspected sepsis.' },
    { id: 'im-fc-12', topic: 'Gastro', front: 'Causes of a raised anion gap metabolic acidosis (MUDPILES)', back: 'Methanol, Uraemia, DKA, Propylene glycol/Paraldehyde, Iron/Isoniazid, Lactic acidosis, Ethylene glycol, Salicylates.' },
  ],
  viva: [
    { id: 'im-viva-1', topic: 'Cardiology', question: 'A 60-year-old presents with crushing central chest pain. Walk me through your immediate approach.', answer: 'ABCDE assessment, attach monitoring and obtain IV access. ECG within 10 minutes and serial troponins. Give aspirin 300 mg, manage pain and hypoxia. If STEMI → primary PCI (or thrombolysis if PCI unavailable) plus second antiplatelet and anticoagulation. Continuously reassess and consider non-ACS causes such as dissection and PE.' },
    { id: 'im-viva-2', topic: 'Respiratory', question: 'How do you assess the severity of a community-acquired pneumonia?', answer: 'Use CURB-65 (Confusion, Urea >7, RR ≥30, BP <90/≤60, age ≥65). Score 0–1 = likely outpatient, 2 = consider admission, ≥3 = severe, manage as inpatient and consider ICU. Combine with clinical judgement, sats, and comorbidities.' },
    { id: 'im-viva-3', topic: 'Endocrine', question: 'A patient with type 1 diabetes is drowsy with glucose 28 and ketones 4. What is the diagnosis and how do you manage it?', answer: 'Diabetic ketoacidosis. Confirm with ABG/VBG (acidosis) and ketones. Management: IV fluids first (0.9% saline) to restore volume, then fixed-rate IV insulin (0.1 units/kg/hr), monitor and replace potassium, treat the precipitant (infection, missed insulin), and monitor glucose/ketones/electrolytes. Involve seniors and diabetes team.' },
    { id: 'im-viva-4', topic: 'Nephrology', question: 'How would you investigate a patient with a new acute kidney injury?', answer: 'Establish baseline creatinine and classify pre-renal, renal, post-renal. History/exam for volume status and nephrotoxins. Bloods (U&E, FBC, CK, bone profile, ±immunology), urine dip and ACR, and renal ultrasound to exclude obstruction. Review and stop nephrotoxic drugs, optimise perfusion, and monitor for complications.' },
    { id: 'im-viva-5', topic: 'Haematology', question: 'What features in an anaemia history point you towards the underlying cause?', answer: 'Diet and alcohol, GI symptoms and blood loss (melaena, menorrhagia), drugs, chronic disease, and family history. Combine with the MCV: microcytic (iron deficiency, thalassaemia), normocytic (chronic disease, acute bleed, haemolysis), macrocytic (B12/folate, alcohol, hypothyroid, myelodysplasia).' },
    { id: 'im-viva-6', topic: 'Cardiology', question: 'When and how do you anticoagulate a patient with atrial fibrillation?', answer: 'Estimate stroke risk with CHA₂DS₂-VASc and bleeding risk with ORBIT/HAS-BLED. Offer anticoagulation (DOAC first-line, or warfarin) when stroke risk outweighs bleeding risk — generally score ≥2, and consider in men ≥1. Manage rate or rhythm separately depending on symptoms and onset.' },
  ],
  mcqs: [
    {
      id: 'im-mcq-1', topic: 'Cardiology',
      question: 'A 68-year-old man has central chest pain for 40 minutes. ECG shows 2 mm ST elevation in II, III and aVF. What is the most appropriate immediate management?',
      options: ['Discharge with outpatient stress test', 'Aspirin and arrange primary PCI', 'Oral beta-blocker only', 'Reassure and repeat ECG in 24 hours'],
      answer: 1,
      explanation: 'Inferior STEMI (II, III, aVF). Immediate management is aspirin plus urgent reperfusion — primary PCI is preferred where available within the timeframe.',
    },
    {
      id: 'im-mcq-2', topic: 'Nephrology',
      question: 'A patient with AKI has K⁺ 6.9 mmol/L with tented T waves. Which is given FIRST?',
      options: ['Insulin with dextrose', 'Nebulised salbutamol', 'IV calcium gluconate', 'Oral calcium resonium'],
      answer: 2,
      explanation: 'With ECG changes, IV calcium gluconate is given first to stabilise the myocardium. Insulin/dextrose and salbutamol then shift potassium intracellularly; definitive removal follows.',
    },
    {
      id: 'im-mcq-3', topic: 'Respiratory',
      question: 'A 72-year-old with cough and fever has new confusion, urea 9 mmol/L, RR 32, BP 100/70. What is the CURB-65 score?',
      options: ['2', '3', '4', '5'],
      answer: 2,
      explanation: 'Confusion (1) + Urea >7 (1) + RR ≥30 (1) + age ≥65 (1) = 4. BP is not low enough to score (systolic ≥90, diastolic >60). A score of 4 indicates severe pneumonia — admit and consider ICU.',
    },
    {
      id: 'im-mcq-4', topic: 'Endocrine',
      question: 'Which is the correct FIRST step in managing diabetic ketoacidosis?',
      options: ['Fixed-rate IV insulin', 'IV sodium bicarbonate', 'IV 0.9% sodium chloride fluid resuscitation', 'Oral rehydration'],
      answer: 2,
      explanation: 'Fluid resuscitation comes first to restore intravascular volume; fixed-rate insulin follows, with careful potassium replacement. Bicarbonate is rarely indicated.',
    },
    {
      id: 'im-mcq-5', topic: 'Gastro',
      question: 'A patient with known cirrhosis presents with haematemesis. Alongside resuscitation, which drug combination is most appropriate before endoscopy?',
      options: ['Omeprazole and tranexamic acid', 'Terlipressin and prophylactic antibiotics', 'Adrenaline and metoclopramide', 'Warfarin reversal alone'],
      answer: 1,
      explanation: 'Suspected variceal bleed: terlipressin (splanchnic vasoconstriction) plus prophylactic antibiotics reduce mortality, with urgent endoscopy for band ligation.',
    },
  ],
}
