// High-yield starter content for Family Medicine / General Practice.
export default {
  id: 'family-medicine',
  name: 'Family Medicine',
  emoji: '🏠',
  blurb: 'Undifferentiated presentations, chronic disease, prevention, and safety-netting.',
  checklist: [
    'Master the consultation structure (e.g. Calgary-Cambridge)',
    'Always elicit ideas, concerns and expectations (ICE)',
    'Know your “red flags” to safety-net for common presentations',
    'Understand chronic disease management targets (BP, HbA1c, lipids)',
    'Be familiar with the cancer 2-week-wait referral criteria',
    'Know routine screening and vaccination programmes',
  ],
  notes: [
    {
      id: 'fm-note-consult',
      title: 'The Consultation & ICE',
      topic: 'Consultation',
      sections: [
        {
          heading: 'Calgary-Cambridge essentials',
          points: ['Initiate (rapport, opening question)', 'Gather information (history + ICE)', 'Examination', 'Explain & plan (shared decision-making)', 'Close (safety-net, follow-up)'],
        },
        {
          heading: 'ICE',
          points: ['Ideas: what does the patient think is going on?', 'Concerns: what are they worried about?', 'Expectations: what are they hoping for?'],
        },
      ],
    },
    {
      id: 'fm-note-redflags',
      title: 'Common Red Flags',
      topic: 'Safety-netting',
      sections: [
        {
          heading: 'Back pain (cauda equina)',
          points: ['Saddle anaesthesia, bladder/bowel dysfunction, bilateral leg symptoms → emergency MRI'],
        },
        {
          heading: 'Headache',
          points: ['Thunderclap (SAH), early-morning/worse on lying, focal signs, new headache >50, systemic features (GCA)'],
        },
        {
          heading: 'Cancer 2-week-wait triggers',
          points: ['Unexplained weight loss, rectal bleeding with change in bowel habit, post-menopausal bleeding, haematuria, persistent dysphagia, new breast lump'],
        },
      ],
    },
    {
      id: 'fm-note-chronic',
      title: 'Chronic Disease Targets',
      topic: 'Chronic Disease',
      sections: [
        {
          heading: 'Common targets (adapt to local guidance)',
          points: ['BP: generally <140/90 in clinic (<150/90 if ≥80)', 'Type 2 diabetes HbA1c: often 48–58 mmol/mol depending on regimen', 'QRISK ≥10% → offer a statin for primary prevention'],
        },
      ],
    },
  ],
  flashcards: [
    { id: 'fm-fc-1', topic: 'Consultation', front: 'What does ICE stand for?', back: 'Ideas, Concerns, Expectations — the patient’s own perspective, central to a patient-centred consultation.' },
    { id: 'fm-fc-2', topic: 'Cardiovascular', front: 'When is a statin offered for primary prevention?', back: 'When 10-year cardiovascular risk (e.g. QRISK) is ≥10%, after lifestyle advice — typically atorvastatin 20 mg.' },
    { id: 'fm-fc-3', topic: 'Red flags', front: 'Cauda equina syndrome red flags', back: 'Saddle anaesthesia, urinary retention/incontinence, faecal incontinence, bilateral sciatica, reduced anal tone — needs emergency MRI and surgical referral.' },
    { id: 'fm-fc-4', topic: 'Respiratory', front: 'First-line inhaled therapy in asthma (adults, current approach)', back: 'Low-dose ICS (often as ICS/formoterol combination, MART) rather than a SABA alone — reflecting the shift away from SABA-only treatment.' },
    { id: 'fm-fc-5', topic: 'Cardiovascular', front: 'Step 1 antihypertensives (under vs over 55 / type 2 diabetes)', back: 'ACE inhibitor/ARB if <55 or type 2 diabetes; calcium-channel blocker if ≥55 or of Black African/Caribbean origin without diabetes.' },
    { id: 'fm-fc-6', topic: 'Red flags', front: 'Features prompting urgent headache referral', back: 'Thunderclap onset, focal neurology, papilloedema, new headache in over-50s, headache worse on lying/coughing, systemic symptoms (fever, weight loss, jaw claudication).' },
    { id: 'fm-fc-7', topic: 'Endocrine', front: 'Diagnosis of type 2 diabetes thresholds', back: 'HbA1c ≥48 mmol/mol (6.5%) or fasting glucose ≥7.0 mmol/L; confirm with a repeat test if asymptomatic.' },
    { id: 'fm-fc-8', topic: 'Prevention', front: 'What is safety-netting?', back: 'Telling the patient what to expect, which warning symptoms should prompt re-presentation, and how/when to seek further help — and documenting it.' },
  ],
  viva: [
    { id: 'fm-viva-1', topic: 'Consultation', question: 'Why is eliciting a patient’s ideas, concerns and expectations important?', answer: 'It uncovers the patient’s own understanding and worries, which shapes a shared, realistic management plan and improves satisfaction and adherence. A patient attending with a cough may really fear cancer; addressing that concern directly is often the key to a successful consultation.' },
    { id: 'fm-viva-2', topic: 'Red flags', question: 'A 40-year-old presents with lower back pain. What red flags would you screen for?', answer: 'Cauda equina features (saddle anaesthesia, bladder/bowel dysfunction, bilateral leg symptoms), features of malignancy or infection (age <20 or >50, weight loss, fever, night pain, history of cancer), and fracture (trauma, steroids, osteoporosis). Any red flag warrants urgent investigation; otherwise manage as mechanical back pain with analgesia, activity and safety-netting.' },
    { id: 'fm-viva-3', topic: 'Chronic Disease', question: 'How would you approach starting antihypertensive treatment in primary care?', answer: 'Confirm the diagnosis (ambulatory or home readings), assess cardiovascular risk and end-organ damage, and give lifestyle advice. Step 1 is an ACE inhibitor/ARB for those under 55 or with type 2 diabetes, or a calcium-channel blocker for those 55 and over or of Black African/Caribbean origin. Titrate to target with monitoring of renal function and electrolytes.' },
    { id: 'fm-viva-4', topic: 'Prevention', question: 'What is safety-netting and why does it matter in general practice?', answer: 'Safety-netting is explaining the expected course, the specific symptoms that should prompt re-attendance, and how to access help, then documenting it. In primary care many presentations are early and undifferentiated, so it manages diagnostic uncertainty safely and empowers the patient to return if things worsen.' },
  ],
  mcqs: [
    {
      id: 'fm-mcq-1', topic: 'Cardiovascular',
      question: 'A healthy 58-year-old of white European origin needs first-line antihypertensive treatment. Which class is recommended?',
      options: ['ACE inhibitor', 'Calcium-channel blocker', 'Thiazide-like diuretic', 'Beta-blocker'],
      answer: 1,
      explanation: 'For patients aged 55 or over (without type 2 diabetes), a calcium-channel blocker is step 1. ACEi/ARB is first-line for under-55s or those with type 2 diabetes.',
    },
    {
      id: 'fm-mcq-2', topic: 'Cardiovascular',
      question: 'At what 10-year cardiovascular risk threshold is a statin typically offered for primary prevention?',
      options: ['≥5%', '≥10%', '≥20%', '≥30%'],
      answer: 1,
      explanation: 'A QRISK of ≥10% prompts offering atorvastatin 20 mg for primary prevention, after lifestyle measures.',
    },
    {
      id: 'fm-mcq-3', topic: 'Red flags',
      question: 'Which symptom in a patient with back pain most urgently suggests cauda equina syndrome?',
      options: ['Unilateral calf ache', 'New urinary retention with saddle anaesthesia', 'Pain worse on movement', 'Morning stiffness'],
      answer: 1,
      explanation: 'Urinary retention with saddle anaesthesia is a classic cauda equina red flag requiring emergency MRI and surgical referral.',
    },
    {
      id: 'fm-mcq-4', topic: 'Consultation',
      question: 'What does the “E” in ICE stand for?',
      options: ['Examination', 'Expectations', 'Evidence', 'Empathy'],
      answer: 1,
      explanation: 'ICE = Ideas, Concerns, Expectations.',
    },
  ],
}
