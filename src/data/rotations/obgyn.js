// High-yield starter content for Obstetrics & Gynaecology.
export default {
  id: 'obgyn',
  name: 'Obstetrics & Gynaecology',
  icon: 'heart',
  blurb: 'Two patients at once, obstetric emergencies, and the menstrual-cycle backbone.',
  checklist: [
    'Always think “could she be pregnant?” — βhCG early',
    'Know the obstetric emergencies and their immediate management',
    'Be able to interpret a basic CTG (DR C BRAVADO)',
    'Memorise normal stages of labour',
    'Understand contraception options and contraindications (UKMEC)',
    'Know the causes and red flags of post-menopausal bleeding',
  ],
  notes: [
    {
      id: 'og-note-queens',
      title: 'Queen’s Rotation Guide — Obstetrics & Gynaecology',
      topic: 'Queen’s',
      sections: [
        {
          heading: 'Format',
          points: [
            '~4 weeks (Kingston, or 2 weeks regional at Brockville/Peterborough + 2 in Kingston)',
            'Time split between obstetrics and gynaecology: labour & delivery, clinics (Armstrong 5; colposcopy Dietary 1; cancer Burr 1), and OR days (Connell 2 / HDH)',
            'Call: 1 weekend + 2 overnight shifts on L&D; schedule comes from the course admin ~1 week ahead',
          ],
        },
        {
          heading: 'Expectations',
          points: [
            'L&D: write progress notes, assess triage patients, scrub for C-sections, assist deliveries, inspect/weigh the placenta',
            'Clinics: review patients on PCS the night before, present, and complete notes/dictations (clarify who dictates)',
            'OR: look up your patients/procedures, write the admission note and start the discharge summary, introduce yourself pre-op',
          ],
        },
        {
          heading: 'Assessment & high-yield',
          points: [
            'Log encounters, preceptor forms, 1 Mini-CEX, mid + exit meetings, final exam',
            'High-yield: gestational diabetes, pre-eclampsia, endometriosis, abnormal uterine bleeding, incontinence',
            'Do the Elentra modules for urogynaecology, high-risk obstetrics, and teen obstetrics',
          ],
        },
      ],
    },
    {
      id: 'og-note-ctg',
      title: 'CTG Interpretation — DR C BRAVADO',
      topic: 'Obstetrics',
      sections: [
        {
          heading: 'Structure',
          points: [
            'DR: Define Risk (why is she monitored?)',
            'C: Contractions (number per 10 min)',
            'BRa: Baseline Rate (normal 110–160 bpm)',
            'V: Variability (normal 5–25 bpm)',
            'A: Accelerations (reassuring)',
            'D: Decelerations (early/variable/late)',
            'O: Overall impression (reassuring / non-reassuring / abnormal)',
          ],
        },
        {
          heading: 'Worrying features',
          points: ['Late decelerations (uteroplacental insufficiency)', 'Reduced variability >50 min', 'Prolonged bradycardia'],
        },
      ],
    },
    {
      id: 'og-note-emerg',
      title: 'Obstetric Emergencies',
      topic: 'Obstetrics',
      sections: [
        {
          heading: 'Cannot-miss',
          points: [
            'Ectopic pregnancy (pain + bleeding + positive βhCG, haemodynamic collapse)',
            'Pre-eclampsia/eclampsia (BP ≥140/90 + proteinuria; seizures = eclampsia)',
            'Antepartum haemorrhage: placenta praevia (painless) vs abruption (painful, woody uterus)',
            'Postpartum haemorrhage (4 T’s: Tone, Trauma, Tissue, Thrombin)',
            'Shoulder dystocia → McRoberts + suprapubic pressure',
          ],
        },
      ],
    },
    {
      id: 'og-note-cycle',
      title: 'Menstrual Cycle & Labour Stages',
      topic: 'Core',
      sections: [
        {
          heading: 'Cycle',
          points: ['Follicular phase (FSH → follicle), LH surge → ovulation ~day 14, luteal phase (progesterone from corpus luteum)'],
        },
        {
          heading: 'Stages of labour',
          points: ['1st: onset to full dilatation (10 cm)', '2nd: full dilatation to delivery of baby', '3rd: delivery of baby to delivery of placenta'],
        },
      ],
    },
  ],
  flashcards: [
    { id: 'og-fc-1', topic: 'Obstetrics', front: 'Diagnostic criteria for pre-eclampsia', back: 'New hypertension (≥140/90) after 20 weeks PLUS proteinuria or end-organ dysfunction. Definitive treatment is delivery; control BP and give magnesium sulfate for seizure prophylaxis.' },
    { id: 'og-fc-2', topic: 'Obstetrics', front: 'The 4 T’s of postpartum haemorrhage', back: 'Tone (uterine atony — most common), Trauma, Tissue (retained products), Thrombin (coagulopathy).' },
    { id: 'og-fc-3', topic: 'Obstetrics', front: 'Placenta praevia vs placental abruption', back: 'Praevia: PAINLESS bright-red bleeding, soft non-tender uterus. Abruption: PAINFUL bleeding (may be concealed), tense “woody” tender uterus, fetal distress.' },
    { id: 'og-fc-4', topic: 'Gynaecology', front: 'Management options for ectopic pregnancy', back: 'Expectant (small, falling βhCG), medical (methotrexate — stable, βhCG <1500, no fetal heartbeat), surgical (salpingectomy/salpingotomy — unstable or large).' },
    { id: 'og-fc-5', topic: 'Obstetrics', front: 'First-line for eclamptic seizures', back: 'IV magnesium sulfate (loading then maintenance). Monitor for toxicity (loss of reflexes, respiratory depression) — antidote is calcium gluconate.' },
    { id: 'og-fc-6', topic: 'Gynaecology', front: 'Post-menopausal bleeding — key concern & first investigation', back: 'Endometrial cancer until proven otherwise. First-line: transvaginal ultrasound for endometrial thickness; refer on 2-week-wait and biopsy if thickened.' },
    { id: 'og-fc-7', topic: 'Obstetrics', front: 'Steps in shoulder dystocia (HELPERR)', back: 'Help, Evaluate for episiotomy, Legs (McRoberts), Pressure (suprapubic), Enter (internal rotation), Remove posterior arm, Roll onto all fours.' },
    { id: 'og-fc-8', topic: 'Gynaecology', front: 'Diagnostic criteria for PCOS (Rotterdam)', back: 'Two of three: oligo/anovulation, clinical/biochemical hyperandrogenism, polycystic ovaries on USS — after excluding other causes.' },
  ],
  viva: [
    { id: 'og-viva-1', topic: 'Gynaecology', question: 'A woman of reproductive age has lower abdominal pain and vaginal bleeding. What is your priority?', answer: 'Exclude an ectopic pregnancy. Do a urinary βhCG immediately, assess haemodynamic stability (ABCDE) and resuscitate if shocked. Arrange a transvaginal ultrasound and serial βhCG. Management depends on stability and findings — expectant, methotrexate, or surgery. Treat any instability as a surgical emergency.' },
    { id: 'og-viva-2', topic: 'Obstetrics', question: 'How do you recognise and initially manage pre-eclampsia?', answer: 'New hypertension after 20 weeks with proteinuria or end-organ involvement (headache, visual changes, RUQ pain, hyperreflexia, deranged bloods). Monitor mother and fetus, control blood pressure (e.g. labetalol), give magnesium sulfate if severe/eclampsia for seizure prophylaxis, and plan timely delivery as the definitive treatment with senior obstetric input.' },
    { id: 'og-viva-3', topic: 'Obstetrics', question: 'Talk me through your interpretation of a CTG.', answer: 'Use DR C BRAVADO: Define risk, Contractions, Baseline Rate (110–160), Variability (5–25), Accelerations (reassuring), Decelerations (early are benign, late/variable concerning), then an Overall impression of reassuring, non-reassuring or abnormal — escalating and considering delivery when abnormal.' },
    { id: 'og-viva-4', topic: 'Obstetrics', question: 'A woman has a major postpartum haemorrhage. How do you manage it?', answer: 'Call for help and resuscitate (ABCDE, two large-bore cannulae, bloods including crossmatch, fluids and blood). Identify the cause via the 4 T’s and treat: rub up the fundus and give uterotonics (oxytocin, ergometrine, carboprost) for atony, repair trauma, remove retained tissue, and correct coagulopathy — escalating to surgical measures (balloon, brace suture, hysterectomy) if needed.' },
  ],
  mcqs: [
    {
      id: 'og-mcq-1', topic: 'Obstetrics',
      question: 'Which is the most common cause of primary postpartum haemorrhage?',
      options: ['Trauma', 'Uterine atony (tone)', 'Retained tissue', 'Coagulopathy'],
      answer: 1,
      explanation: 'Uterine atony (“tone”) accounts for the majority of primary PPH. First steps include fundal massage and uterotonics.',
    },
    {
      id: 'og-mcq-2', topic: 'Obstetrics',
      question: 'A woman at 34 weeks has painless, bright-red vaginal bleeding with a soft, non-tender uterus. Most likely diagnosis?',
      options: ['Placental abruption', 'Placenta praevia', 'Uterine rupture', 'Vasa praevia'],
      answer: 1,
      explanation: 'Painless bright-red bleeding with a soft uterus suggests placenta praevia. Abruption is typically painful with a tense, tender uterus.',
    },
    {
      id: 'og-mcq-3', topic: 'Obstetrics',
      question: 'Which drug is first-line for seizure prophylaxis and treatment in eclampsia?',
      options: ['Diazepam', 'Phenytoin', 'Magnesium sulfate', 'Labetalol'],
      answer: 2,
      explanation: 'Magnesium sulfate is first-line for eclamptic seizures; labetalol controls blood pressure but does not treat seizures.',
    },
    {
      id: 'og-mcq-4', topic: 'Gynaecology',
      question: 'A 58-year-old presents with post-menopausal bleeding. What is the most appropriate first investigation?',
      options: ['Transvaginal ultrasound', 'CA-125', 'CT abdomen/pelvis', 'Reassurance and review in 6 months'],
      answer: 0,
      explanation: 'Transvaginal ultrasound assesses endometrial thickness; a thickened endometrium prompts biopsy. PMB is endometrial cancer until proven otherwise.',
    },
  ],
}
