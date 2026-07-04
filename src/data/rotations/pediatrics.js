// High-yield starter content for Paediatrics.
export default {
  id: 'pediatrics',
  name: 'Paediatrics',
  emoji: '🧸',
  blurb: 'Sick child recognition, developmental milestones, and weight-based everything.',
  checklist: [
    'Complete + log the 12 Aquifer/CLIPP cases on Elentra',
    'Plan EPAs: COPC week for Preventive Health/Advocacy/Child Otoscopy; Inpatient week for Handover',
    'Exit exam is 3 hours, ~100 MCQ — pass 60%',
    'Know the paediatric ABCDE and the sick-child traffic-light system',
    'Be able to estimate weight and calculate fluid/drug doses by weight',
    'Memorise key developmental milestones by age',
    'Know the Ontario/Canadian (NACI) immunisation schedule',
    'Recognise non-blanching rash → meningococcal sepsis pathway',
  ],
  notes: [
    {
      id: 'paeds-note-queens',
      title: 'Queen’s Rotation Guide — Paediatrics',
      topic: 'Queen’s',
      sections: [
        {
          heading: 'Format (4 weeks, Kingston — 4 units)',
          points: [
            'Inpatient (KGH Kidd 10, handover ~7:30AM)',
            'Well Newborn (KGH Kidd 5, NICU)',
            'Ambulatory clinics (HDH Jeanne Mance 1 + specialty clinics — some are at KGH)',
            'COPC (children’s ER, HDH JM1)',
            'Call: 1 NICU weekend, 1 Ward weekend, 2 weekday NICU/Ward/ER shifts, 1 Bilirubin clinic',
          ],
        },
        {
          heading: 'Assessment',
          points: [
            'Log all mandatory encounters + the 12 Aquifer cases on Elentra',
            '≥4 outpatient assessments, 2 Mini-CEX (easiest early in COPC week), 1 Newborn + 1 Inpatient form, mid + exit meetings',
            'Pass = 60% on the ~100-MCQ exit exam',
          ],
        },
        {
          heading: 'High-yield to review',
          points: [
            'Approaches to paeds abdo pain, N/V, constipation/diarrhoea, rashes, fever + sore throat, headache',
            'Weight-based dosing of ibuprofen/acetaminophen',
            'Asthma, diabetes, common tumours & blood disorders, URTIs, vaccine schedule',
            'Neonatal jaundice: CPS hyperbilirubinemia guideline + phototherapy nomogram; breastmilk vs breastfeeding jaundice',
          ],
        },
        {
          heading: 'Resources',
          points: ['PedsCases + pupdoc.ca', 'Canadian Paediatric Society (cps.ca) documents', 'UCalgary CARDS (case-based exam prep)', 'UpToDate for on-the-fly dosing'],
        },
      ],
    },
    {
      id: 'paeds-note-sickchild',
      title: 'The Acutely Unwell Child',
      topic: 'Acute Paediatrics',
      sections: [
        {
          heading: 'Paediatric assessment triangle',
          points: ['Appearance (tone, interactivity, consolability)', 'Work of breathing (recession, grunting, nasal flaring)', 'Circulation to skin (colour, mottling, cap refill)'],
        },
        {
          heading: 'Red flags (NICE traffic light)',
          points: [
            'Pale/mottled/blue, weak or high-pitched cry, no response to cues',
            'Grunting, RR >60, severe recession, sats <92%',
            'Reduced skin turgor, age <3 months with temp ≥38°C, non-blanching rash',
          ],
        },
      ],
    },
    {
      id: 'paeds-note-fluids',
      title: 'Fluids & Resuscitation Doses',
      topic: 'Acute Paediatrics',
      sections: [
        {
          heading: 'Estimating weight',
          points: ['Weight (kg) ≈ (age + 4) × 2 for ages 1–5 years (use real weight whenever possible)'],
        },
        {
          heading: 'Key emergency numbers',
          points: [
            'Fluid bolus: 10 mL/kg (20 mL/kg in trauma/non-cardiac, reassess after each)',
            'Maintenance: Holliday-Segar 100/50/20 rule (mL/kg/day for first 10/next 10/each subsequent kg)',
            'Adrenaline in anaphylaxis: IM 1:1000 by age band',
          ],
        },
      ],
    },
    {
      id: 'paeds-note-milestones',
      title: 'Developmental Milestones',
      topic: 'Development',
      sections: [
        {
          heading: 'Gross motor',
          points: ['6 wks: head control developing', '6–8 mo: sits unsupported', '12 mo: stands/cruises', '18 mo: walks well', '2 yr: runs, kicks ball'],
        },
        {
          heading: 'Social / speech',
          points: ['6 wks: social smile', '9 mo: stranger awareness', '12 mo: 1–2 words', '2 yr: 2-word phrases', '3 yr: short sentences'],
        },
        {
          heading: 'Red flags',
          points: ['No social smile by 8 wks', 'Not sitting by 9 mo', 'Not walking by 18 mo', 'No words by 18 mo', 'Loss of skills at any age'],
        },
      ],
    },
  ],
  flashcards: [
    { id: 'paeds-fc-1', topic: 'Acute Paediatrics', front: 'IM adrenaline doses in anaphylaxis by age (1:1000)', back: '<6 mo: 100–150 mcg; 6 mo–6 yr: 150 mcg; 6–12 yr: 300 mcg; >12 yr: 500 mcg. Repeat after 5 min if needed.' },
    { id: 'paeds-fc-2', topic: 'Acute Paediatrics', front: 'Croup vs epiglottitis', back: 'Croup: barking cough, stridor, viral (parainfluenza), responds to dexamethasone. Epiglottitis: drooling, toxic, tripod, NO cough — do not examine the throat; call anaesthetics.' },
    { id: 'paeds-fc-3', topic: 'Infectious Disease', front: 'Features of bronchiolitis', back: 'Usually <1 yr, RSV. Coryza → cough, wheeze, fine crackles, feeding difficulty. Supportive management; no routine antibiotics or steroids.' },
    { id: 'paeds-fc-4', topic: 'Development', front: 'Average age to walk independently (and red flag)', back: 'Most walk by ~13–15 months; refer/investigate if not walking by 18 months.' },
    { id: 'paeds-fc-5', topic: 'Neonatology', front: 'APGAR score components', back: 'Appearance (colour), Pulse, Grimace (reflex), Activity (tone), Respiration. Scored 0–2 each at 1 and 5 minutes.' },
    { id: 'paeds-fc-6', topic: 'Infectious Disease', front: 'Most important sign to act on in a febrile child', back: 'A non-blanching purpuric rash → treat as meningococcal sepsis: immediate IV/IM benzylpenicillin/ceftriaxone and urgent transfer.' },
    { id: 'paeds-fc-7', topic: 'Acute Paediatrics', front: 'Signs of dehydration in a child', back: 'Dry mucous membranes, reduced urine output, sunken eyes/fontanelle, reduced skin turgor, tachycardia; shock = prolonged cap refill, hypotension (late), reduced consciousness.' },
    { id: 'paeds-fc-8', topic: 'Respiratory', front: 'First-line management of acute asthma in a child', back: 'Oxygen to maintain sats ≥94%, inhaled salbutamol (spacer or nebuliser), oral prednisolone; escalate to ipratropium, IV magnesium, IV salbutamol/aminophylline.' },
    { id: 'paeds-fc-9', topic: 'Gastro', front: 'Pyloric stenosis classic presentation', back: 'First-born male, 2–8 weeks, projectile non-bilious vomiting, palpable “olive” mass, hypochloraemic hypokalaemic metabolic alkalosis. Treat: correct fluids then pyloromyotomy.' },
    { id: 'paeds-fc-10', topic: 'Gastro', front: 'Intussusception classic features', back: '6 mo–2 yr, paroxysmal colicky pain (drawing up legs), “redcurrant jelly” stool, sausage-shaped mass. Diagnosis/treatment: USS then air/contrast enema reduction.' },
  ],
  viva: [
    { id: 'paeds-viva-1', topic: 'Acute Paediatrics', question: 'How do you assess whether a child is seriously unwell at first glance?', answer: 'Use the paediatric assessment triangle: appearance (tone, interactivity, consolability), work of breathing (recession, grunting, flaring, noises), and circulation to skin (colour, mottling). Combine with the NICE traffic-light features and a full ABCDE. Any red feature (e.g. grunting, non-blanching rash, age <3 months with fever) triggers urgent senior input.' },
    { id: 'paeds-viva-2', topic: 'Infectious Disease', question: 'A 3-year-old has fever and a non-blanching rash. What do you do?', answer: 'Treat as meningococcal sepsis until proven otherwise. ABCDE, high-flow oxygen, IV access, fluid resuscitation, and immediate IV ceftriaxone (or IM/IV benzylpenicillin pre-hospital). Take cultures if it does not delay antibiotics, monitor closely, and escalate urgently to seniors/PICU.' },
    { id: 'paeds-viva-3', topic: 'Development', question: 'A parent is worried their 18-month-old is not yet walking. How do you approach this?', answer: 'Take a developmental history across all four domains (gross motor, fine motor/vision, speech/hearing, social), the birth and family history, and check for loss of skills. Not walking by 18 months is a red flag warranting examination (tone, hips, neurology) and onward referral. Reassure where development is otherwise normal but arrange appropriate follow-up.' },
    { id: 'paeds-viva-4', topic: 'Respiratory', question: 'Distinguish croup from epiglottitis.', answer: 'Croup is usually viral (parainfluenza), with a barking cough, stridor and a gradual onset, and responds to oral dexamethasone. Epiglottitis is now rare (Hib vaccine), rapid-onset, with a toxic, drooling child sitting forward, muffled voice and no cough — do not examine the throat or distress the child; secure the airway with senior anaesthetic/ENT support.' },
    { id: 'paeds-viva-5', topic: 'Acute Paediatrics', question: 'How do you calculate a fluid bolus and maintenance fluids for a child?', answer: 'Use the actual weight where possible (estimate with (age+4)×2 in 1–5 year-olds). A resuscitation bolus is 10 mL/kg of balanced crystalloid, reassessed after each. Maintenance uses the Holliday-Segar rule: 100 mL/kg/day for the first 10 kg, 50 for the next 10 kg, and 20 for each kg beyond, with appropriate electrolytes and glucose.' },
  ],
  mcqs: [
    {
      id: 'paeds-mcq-1', topic: 'Acute Paediatrics',
      question: 'What is the recommended initial IV/IO fluid bolus volume for a shocked child (non-trauma, non-cardiac)?',
      options: ['5 mL/kg', '10 mL/kg', '40 mL/kg', '60 mL/kg'],
      answer: 1,
      explanation: 'Current guidance favours 10 mL/kg boluses with reassessment after each, to avoid fluid overload.',
    },
    {
      id: 'paeds-mcq-2', topic: 'Gastro',
      question: 'A 5-week-old boy has projectile non-bilious vomiting and a palpable epigastric mass. What blood gas picture is expected?',
      options: ['Metabolic acidosis with high anion gap', 'Hypochloraemic hypokalaemic metabolic alkalosis', 'Respiratory alkalosis', 'Normal anion gap acidosis'],
      answer: 1,
      explanation: 'Pyloric stenosis causes loss of gastric HCl → hypochloraemic, hypokalaemic metabolic alkalosis. Correct fluids/electrolytes before pyloromyotomy.',
    },
    {
      id: 'paeds-mcq-3', topic: 'Respiratory',
      question: 'A 10-month-old has coryza, wheeze, fine crackles and mild feeding difficulty. Most likely diagnosis?',
      options: ['Bacterial pneumonia', 'Bronchiolitis', 'Asthma', 'Epiglottitis'],
      answer: 1,
      explanation: 'Bronchiolitis (usually RSV) is typical under 1 year. Management is supportive; antibiotics and steroids are not routinely indicated.',
    },
    {
      id: 'paeds-mcq-4', topic: 'Infectious Disease',
      question: 'Which feature in a febrile child most urgently mandates empirical antibiotics for sepsis?',
      options: ['Runny nose', 'Non-blanching purpuric rash', 'Mild dry cough', 'A single temperature of 38°C in a well 4-year-old'],
      answer: 1,
      explanation: 'A non-blanching rash suggests meningococcal sepsis — give immediate antibiotics and resuscitate.',
    },
    {
      id: 'paeds-mcq-5', topic: 'Development',
      question: 'By what age should you investigate a child who is not yet walking independently?',
      options: ['12 months', '15 months', '18 months', '24 months'],
      answer: 2,
      explanation: 'Failure to walk by 18 months is a recognised red flag warranting assessment.',
    },
  ],
}
