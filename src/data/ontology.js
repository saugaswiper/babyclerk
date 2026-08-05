// Clerkship concept ontology.
//
// The decks' `topic` strings are *lecture-section labels*, not concepts: 190
// cards say "Urology", 172 say "Peds", 73 say "Toronto Notes". Rolling mastery
// up by those strings can only ever tell a student "you're weak at... Peds",
// which is useless for targeting. This file gives the app a real vocabulary.
//
// Two mechanisms, deliberately deterministic (no API call, works offline):
//   TOPIC_ALIASES — raw topic string → concept, for topics that already are one
//                   (and to merge duplicates like "Pain Meds" / "Pain Medication Dosing")
//   CONCEPTS      — clinical concepts matched against the card's own text, used to
//                   split the broad buckets into something actionable
//
// See vault/Improvement-Proposals.md (P2) and vault/Decisions.md D13.

// Topics that are pure source labels — they carry no clinical signal at all,
// so a card tagged with one must be classified from its text or not at all.
export const OPAQUE_TOPICS = new Set([
  'Toronto Notes',
  'Toronto Notes+',
  'Peds',
  'Psychiatry',
  'Surgery',
  'Medicine',
])

// Real domains, but far too broad to be a "weak topic" — try the text first,
// and fall back to the label only if nothing matches.
export const BROAD_TOPICS = new Set([
  'Urology',
  'Anesthesia',
  'Pediatrics',
  'Internal Medicine',
  'Obstetrics',
  'Gynaecology',
  'Gynecology',
])

// Topic strings that are already good concepts, plus merges of near-duplicates.
export const TOPIC_ALIASES = {
  'ECG Bootcamp': 'ecg',
  'ECG Review': 'ecg',
  'Pain Meds': 'pain-management',
  'Pain Medication Dosing': 'pain-management',
  'Acute and Chronic Pain': 'pain-management',
  'Bugs + Drugs': 'antimicrobials',
  'Mechanisms of Resistance': 'antimicrobials',
  'Fluid and Lytes': 'fluids-electrolytes',
  'Diuretics Crash Course': 'diuretics',
  'The Acute Abdomen': 'acute-abdomen',
  'Acute Abdomen': 'acute-abdomen',
  'Altered LOC and Hypotension': 'shock-altered-loc',
  'Consent, Capacity and Ethics': 'consent-capacity',
  'Hand Ortho': 'hand-injuries',
  'Knee Pain': 'knee',
  'Neurosx Critical Care': 'neurocritical-care',
  'Thoracic Trauma': 'thoracic-trauma',
  Burns: 'burns',
  Transfusion: 'transfusion',
  Anemia: 'anemia',
  'Fetal Growth': 'fetal-growth',
  'Pregnancy and Antenatal Care': 'antenatal-care',
  'Infections in Pregnancy': 'infections-in-pregnancy',
  'Maternal Physiology': 'maternal-physiology',
  'Hypertensive Disorders in Pregnancy': 'hypertensive-pregnancy',
  'Diabetes and Pregnancy': 'diabetes-pregnancy',
  '<20 Wk Bleeding in Obstetrics': 'early-pregnancy-bleeding',
  'Abnormal Labour and Delivery': 'abnormal-labour',
  'Normal Labour and Delivery': 'normal-labour',
}

// Concepts matched against card text. `terms` are lowercase; a term matches on a
// word boundary, so "bph" doesn't fire inside another word. Order doesn't matter
// — the concept with the most distinct term hits wins, ties broken by specificity
// (a longer matched term beats a shorter one).
//
// `rotations: null` means cross-rotation (fluids, sepsis, ECG…), which is the
// whole point of having an ontology: the same weakness can follow you between
// blocks and the app should say so.
export const CONCEPTS = [
  // ---- Urology (the 190-card bucket) ----
  { id: 'bph-luts', label: 'BPH & LUTS', rotations: ['surgery'], terms: ['bph', 'luts', 'benign prostatic', 'lower urinary tract symptoms', 'transition zone'] },
  { id: 'prostate-cancer', label: 'Prostate cancer', rotations: ['surgery'], terms: ['prostate ca', 'prostate cancer', 'psa', 'gleason', 'transrectal'] },
  { id: 'urolithiasis', label: 'Kidney stones', rotations: ['surgery'], terms: ['renal colic', 'urolithiasis', 'kidney stone', 'ureteric stone', 'staghorn', 'nephrolithiasis'] },
  { id: 'hematuria', label: 'Hematuria', rotations: ['surgery'], terms: ['hematuria', 'haematuria'] },
  { id: 'bladder-cancer', label: 'Bladder cancer', rotations: ['surgery'], terms: ['bladder cancer', 'bladder tumour', 'bladder tumor', 'urothelial', 'tcc'] },
  { id: 'testicular', label: 'Testicular & scrotal', rotations: ['surgery'], terms: ['testicular torsion', 'testicular cancer', 'varicocele', 'hydrocele', 'epididymitis', 'scrotal'] },
  { id: 'urinary-retention', label: 'Urinary retention & catheters', rotations: ['surgery'], terms: ['urinary retention', 'foley', 'catheter', 'suprapubic'] },
  { id: 'uti', label: 'Urinary tract infection', rotations: null, terms: ['uti', 'cystitis', 'pyelonephritis', 'urinary tract infection'] },
  { id: 'erectile-dysfunction', label: 'Erectile dysfunction', rotations: ['surgery'], terms: ['erectile dysfunction', 'priapism'] },
  { id: 'renal-failure', label: 'Renal failure', rotations: null, terms: ['aki', 'acute kidney injury', 'renal failure', 'ckd', 'chronic kidney disease', 'dialysis'] },

  // ---- Anesthesia (the 127-card bucket) ----
  { id: 'asa-classification', label: 'ASA classification', rotations: ['surgery'], terms: ['asa class', 'asa classification'] },
  { id: 'airway-management', label: 'Airway management', rotations: null, terms: ['mallampati', 'intubation', 'laryngoscopy', 'bag mask', 'lma', 'difficult airway', 'rsi', 'rapid sequence'] },
  // No bare "last" for Local Anesthetic Systemic Toxicity: it matched 14 cards
  // in the corpus and every one of them was the English word ("how long does it
  // last", "headache lasts 4-72h").
  { id: 'local-anesthetics', label: 'Local anesthetics', rotations: ['surgery'], terms: ['lidocaine', 'bupivacaine', 'local anesthetic', 'anesthetic systemic toxicity', 'ropivacaine'] },
  { id: 'general-anesthesia', label: 'Induction & maintenance agents', rotations: ['surgery'], terms: ['propofol', 'ketamine', 'sevoflurane', 'etomidate', 'induction agent', 'volatile'] },
  { id: 'neuromuscular-blockade', label: 'Neuromuscular blockade', rotations: ['surgery'], terms: ['succinylcholine', 'rocuronium', 'neuromuscular block', 'sugammadex', 'paralytic'] },
  { id: 'regional-anesthesia', label: 'Regional & neuraxial', rotations: null, terms: ['spinal anesthe', 'epidural', 'nerve block', 'neuraxial'] },
  { id: 'preop-assessment', label: 'Pre-op assessment', rotations: ['surgery'], terms: ['preoperative', 'pre-op', 'npo', 'fasting guideline', 'preop'] },
  { id: 'malignant-hyperthermia', label: 'Malignant hyperthermia', rotations: ['surgery'], terms: ['malignant hyperthermia', 'dantrolene'] },
  { id: 'ponv', label: 'Post-op nausea & vomiting', rotations: ['surgery'], terms: ['ponv', 'post-operative nausea', 'postoperative nausea'] },

  // ---- Psychiatry (the 147-card bucket) ----
  { id: 'depression', label: 'Depression', rotations: ['psychiatry'], terms: ['mdd', 'major depress', 'msigecaps', 'depressive episode', 'dysthymi'] },
  { id: 'bipolar', label: 'Bipolar & mania', rotations: ['psychiatry'], terms: ['bipolar', 'manic episode', 'mania', 'hypomanic', 'digfast'] },
  { id: 'psychosis', label: 'Psychosis & schizophrenia', rotations: ['psychiatry'], terms: ['schizophreni', 'psychosis', 'delusion', 'hallucination', 'positive symptom', 'negative symptom'] },
  { id: 'anxiety-disorders', label: 'Anxiety disorders', rotations: ['psychiatry'], terms: ['gad', 'panic disorder', 'panic attack', 'anxiety disorder', 'ocd', 'phobia', 'ptsd'] },
  { id: 'suicide-risk', label: 'Suicide & risk assessment', rotations: ['psychiatry'], terms: ['suicid', 'self-harm', 'risk assessment', 'sadpersons'] },
  { id: 'mental-status-exam', label: 'Mental status exam', rotations: ['psychiatry'], terms: ['mental status exam', 'mse', 'affect vs mood', 'thought form', 'thought content'] },
  // "eps" is dropped: in this corpus it hits migraine "5 eps w the following
  // criteria" (episodes) more often than extrapyramidal symptoms, and the real
  // EPS cards are already caught by "antipsychotic" / "tardive" / "risperidone".
  { id: 'antipsychotics', label: 'Antipsychotics', rotations: ['psychiatry'], terms: ['antipsychotic', 'clozapine', 'olanzapine', 'risperidone', 'haloperidol', 'extrapyramidal', 'tardive', 'nms', 'neuroleptic malignant'] },
  { id: 'antidepressants', label: 'Antidepressants', rotations: ['psychiatry'], terms: ['ssri', 'snri', 'antidepressant', 'sertraline', 'fluoxetine', 'serotonin syndrome', 'mao'] },
  { id: 'mood-stabilizers', label: 'Mood stabilizers', rotations: ['psychiatry'], terms: ['lithium', 'valproate', 'lamotrigine', 'mood stabili'] },
  { id: 'substance-use', label: 'Substance use & withdrawal', rotations: null, terms: ['withdrawal', 'alcohol use disorder', 'opioid use', 'substance use', 'ciwa', 'delirium tremens', 'naloxone'] },
  { id: 'mental-health-act', label: 'Mental Health Act & capacity', rotations: ['psychiatry'], terms: ['mental health act', 'form 1', 'involuntary', 'certif'] },
  { id: 'eating-disorders', label: 'Eating disorders', rotations: ['psychiatry'], terms: ['anorexia nervosa', 'bulimia', 'eating disorder', 'refeeding'] },
  { id: 'delirium-dementia', label: 'Delirium & dementia', rotations: null, terms: ['delirium', 'dementia', 'confusion assessment', 'mmse', 'moca'] },

  // ---- Pediatrics (the 172-card bucket) ----
  { id: 'growth-failure', label: 'Growth & failure to thrive', rotations: ['pediatrics'], terms: ['failure to thrive', 'faltering growth', 'growth chart', 'growth rate', 'birth weight'] },
  { id: 'development', label: 'Developmental milestones', rotations: ['pediatrics'], terms: ['milestone', 'developmental delay', 'gross motor', 'fine motor'] },
  { id: 'immunization', label: 'Immunization', rotations: ['pediatrics'], terms: ['immuniz', 'vaccin'] },
  { id: 'neonatal', label: 'Neonatal care & jaundice', rotations: ['pediatrics'], terms: ['neonat', 'newborn', 'apgar', 'jaundice', 'hyperbilirubin', 'meconium'] },
  { id: 'peds-respiratory', label: 'Paediatric respiratory', rotations: ['pediatrics'], terms: ['bronchiolitis', 'croup', 'stridor', 'epiglottitis', 'rsv', 'wheeze'] },
  { id: 'asthma', label: 'Asthma', rotations: null, terms: ['asthma', 'salbutamol', 'inhaled corticosteroid'] },
  { id: 'peds-fever', label: 'Fever & the sick child', rotations: ['pediatrics'], terms: ['febrile', 'fever without', 'sick child', 'toxic appearing', 'febrile seizure'] },
  { id: 'dehydration', label: 'Dehydration & rehydration', rotations: null, terms: ['dehydrat', 'oral rehydration', 'ors', 'maintenance fluid'] },
  { id: 'child-protection', label: 'Child protection', rotations: ['pediatrics'], terms: ['non-accidental', 'child abuse', 'child protection', 'shaken baby', 'neglect'] },
  { id: 'congenital-heart', label: 'Congenital heart disease', rotations: ['pediatrics'], terms: ['congenital heart', 'vsd', 'asd', 'tetralogy', 'pda', 'coarctation', 'innocent murmur'] },
  { id: 'adhd', label: 'ADHD', rotations: null, terms: ['adhd', 'stimulant', 'methylphenidate', 'inattent', 'hyperactiv'] },
  { id: 'kawasaki', label: 'Kawasaki disease', rotations: ['pediatrics'], terms: ['kawasaki', 'strawberry tongue', 'coronary aneurysm'] },
  { id: 'peds-exanthems', label: 'Rashes & exanthems', rotations: ['pediatrics'], terms: ['fever and rash', 'exanthem', 'measles', 'roseola', 'scarlet fever', 'hand foot and mouth', 'varicella'] },
  { id: 'pharyngitis', label: 'Pharyngitis & sore throat', rotations: null, terms: ['pharyngitis', 'strep throat', 'gas strep', 'gab strep', 'tonsill', 'centor'] },
  { id: 'peds-vitals', label: 'Paediatric vitals & norms', rotations: ['pediatrics'], terms: ['systolic bp of kids', 'lln of the systolic', 'mid parental height', 'normal vitals', 'weight estimation'] },
  { id: 'school-behaviour', label: 'School & behavioural difficulties', rotations: ['pediatrics'], terms: ['school difficult', 'learning disability', 'odd', 'oppositional defiant', 'conduct disorder'] },
  { id: 'celiac', label: 'Celiac disease', rotations: null, terms: ['celiac', 'coeliac', 'gluten'] },
  { id: 'peds-capacity', label: 'Capacity & consent in children', rotations: ['pediatrics'], terms: ['4 cs of capacity', 'mature minor', 'assent'] },
  { id: 'peds-vasculitis', label: 'IgA vasculitis & ITP', rotations: ['pediatrics'], terms: ['iga vasculitis', 'henoch', 'itp', 'palpable purpura', 'immune thrombocytopen'] },
  { id: 'intussusception', label: 'Intussusception', rotations: null, terms: ['intussuception', 'intussusception', 'currant jelly'] },
  { id: 'peds-neuro', label: 'Headache, ataxia & brain tumours', rotations: ['pediatrics'], terms: ['headache in children', 'cerebellitis', 'ataxia', 'brain tumour', 'brain tumor', 'hydrocephalus'] },
  { id: 'cystic-fibrosis', label: 'Cystic fibrosis', rotations: null, terms: ['cystic fibrosis', 'sweat chloride', 'cf'] },
  { id: 'sickle-cell', label: 'Sickle cell disease', rotations: null, terms: ['sickle cell', 'sickling', 'acute chest syndrome'] },
  { id: 'nephrotic', label: 'Nephrotic syndrome', rotations: null, terms: ['nephrotic', 'minimal change', 'hypoalbumin', 'proteinuria'] },
  { id: 'genetic-syndromes', label: 'Genetic syndromes', rotations: null, terms: ['turner syndrome', 'down syndrome', 'fragile x', 'trisomy', 'intellectual disability', 'inheritance pattern'] },
  { id: 'cyanosis-screening', label: 'Cyanosis & newborn screening', rotations: ['pediatrics'], terms: ['cyanosis', 'pulse ox', 'cchd', 'ductus arteriosus', 'hypoplastic', 'anomalous pulm'] },
  { id: 'infant-feeding', label: 'Infant feeding & colic', rotations: ['pediatrics'], terms: ['breastfed', 'breast/bottle', 'bottle fed', 'colic', 'cals/day', 'formula'] },
  { id: 'brue', label: 'BRUE', rotations: ['pediatrics'], terms: ['brue', 'brief, resolved', 'brief resolved'] },
  { id: 'conjunctivitis', label: 'Conjunctivitis', rotations: null, terms: ['conjunctivitis', 'red eye'] },
  { id: 'peds-hypertension', label: 'Hypertension in children', rotations: ['pediatrics'], terms: ['children w htn', 'hypertension in child', 'paediatric hypertension'] },

  // ---- Gynaecology ----
  { id: 'endometriosis', label: 'Endometriosis & adenomyosis', rotations: ['obgyn'], terms: ['endometriosis', 'adenomyosis', 'dysmenorrhea', 'dyspareunia'] },
  { id: 'fibroids', label: 'Fibroids', rotations: ['obgyn'], terms: ['fibroid', 'leiomyoma', 'myomectomy'] },
  { id: 'pcos', label: 'PCOS', rotations: ['obgyn'], terms: ['pcos', 'polycystic ovar', 'hirsutism'] },
  { id: 'infertility', label: 'Infertility', rotations: ['obgyn'], terms: ['infertility', 'ivf', 'ovulation induction', 'clomiphene', 'letrozole'] },
  { id: 'vaginitis-sti', label: 'Vaginitis & STIs', rotations: null, terms: ['vulvovaginal candidiasis', 'bacterial vaginosis', 'trichomonas', 'chlamydia', 'gonorrhea', 'gonorrhoea', 'pid', 'pelvic inflammatory'] },
  { id: 'amenorrhea', label: 'Amenorrhea & ovarian failure', rotations: ['obgyn'], terms: ['amenorrhea', 'prolactinoma', 'premature ovarian', 'menopause'] },
  { id: 'termination', label: 'Termination of pregnancy', rotations: ['obgyn'], terms: ['medical abortion', 'termination of pregnancy', 'mifepristone', 'misoprostol'] },
  { id: 'hysterectomy', label: 'Hysterectomy & gynae surgery', rotations: ['obgyn'], terms: ['hysterectomy', 'oophorectomy', 'ablation'] },

  // ---- Psychiatry (continued) ----
  { id: 'adjustment-stress', label: 'Adjustment & stress disorders', rotations: ['psychiatry'], terms: ['adjustment disorder', 'acute stress disorder', 'stress response'] },
  { id: 'psychotherapy', label: 'Psychotherapy', rotations: ['psychiatry'], terms: ['cbt', 'ipt', 'psychotherapy', 'dbt', 'behavioural activation'] },
  { id: 'benzodiazepines', label: 'Benzodiazepines', rotations: null, terms: ['benzo', 'lorazepam', 'diazepam', 'midazolam'] },
  { id: 'catatonia', label: 'Catatonia', rotations: ['psychiatry'], terms: ['catatonia', 'catatonic'] },
  { id: 'sleep-disorders', label: 'Sleep disorders', rotations: null, terms: ['insomnia', 'sleep disorder', 'sleep apnea', 'narcolepsy', 'sleep hygiene'] },
  { id: 'agitation', label: 'Agitation & de-escalation', rotations: ['psychiatry'], terms: ['de-escalation', 'agitation', 'restraint', 'violence in the ed'] },

  // ---- Surgery (continued) ----
  { id: 'esophageal', label: 'Esophageal disorders', rotations: ['surgery'], terms: ['achalasia', 'zenker', 'esophagitis', 'dysphagia', 'esophageal'] },
  { id: 'ibd', label: 'Inflammatory bowel disease', rotations: null, terms: ['ulcerative colitis', 'crohn', 'ibd', 'uc vs cd'] },
  { id: 'diverticular', label: 'Diverticular disease', rotations: ['surgery'], terms: ['diverticulitis', 'diverticulosis', 'diverticulum', 'diverticular'] },
  // "abi" removed — it only ever matched "ability" / "abilify", never an
  // ankle-brachial index.
  { id: 'pvd', label: 'Peripheral vascular disease', rotations: ['surgery'], terms: ['pvd', 'peripheral vascular', 'claudication', 'ankle-brachial', 'critical limb'] },
  { id: 'thyroid-neck', label: 'Thyroid & neck masses', rotations: ['surgery'], terms: ['thyroid nodule', 'neck mass', 'hot vs cold nodule', 'goitre', 'goiter'] },
  { id: 'fractures', label: 'Fractures', rotations: null, terms: ['fracture', 'salter-harris', 'salter harris', 'compartment syndrome', 'cast'] },
  { id: 'hip-dysplasia', label: 'Developmental dysplasia of the hip', rotations: null, terms: ['dysplasia of the hip', 'ddh', 'ortolani', 'barlow'] },
  { id: 'hemorrhagic-shock', label: 'Hemorrhagic shock', rotations: null, terms: ['hypotension in trauma', 'hemorrhagic shock', 'haemorrhagic shock', 'class of shock', 'massive transfusion'] },
  { id: 'hit', label: 'Heparin-induced thrombocytopenia', rotations: null, terms: ['heparin-induced', 'hit', 'thrombocytopenia'] },

  // ---- Obstetrics & gynaecology ----
  { id: 'preeclampsia', label: 'Pre-eclampsia & HELLP', rotations: ['obgyn'], terms: ['pre-eclampsia', 'preeclampsia', 'eclampsia', 'hellp', 'magnesium sulfate'] },
  { id: 'postpartum-hemorrhage', label: 'Postpartum hemorrhage', rotations: ['obgyn'], terms: ['postpartum hemorrhage', 'pph', 'uterine atony'] },
  { id: 'antenatal-screening', label: 'Antenatal screening', rotations: ['obgyn'], terms: ['nipt', 'amniocentesis', 'cvs', 'chorionic villus', 'prenatal screen', 'ips', 'mss'] },
  { id: 'hyperemesis', label: 'Nausea & hyperemesis', rotations: ['obgyn'], terms: ['hyperemesis', 'diclectin', 'doxylamine', 'morning sickness'] },
  { id: 'isoimmunization', label: 'Rh isoimmunization', rotations: ['obgyn'], terms: ['isoimmuniz', 'rhogam', 'coombs', 'kleihauer', 'rh negative'] },
  { id: 'contraception', label: 'Contraception', rotations: ['obgyn'], terms: ['contracept', 'iud', 'ocp', 'oral contraceptive'] },
  { id: 'abnormal-uterine-bleeding', label: 'Abnormal uterine bleeding', rotations: ['obgyn'], terms: ['abnormal uterine bleeding', 'aub', 'menorrhagia', 'palm-coein'] },
  { id: 'ectopic', label: 'Ectopic pregnancy', rotations: ['obgyn'], terms: ['ectopic'] },
  { id: 'fetal-monitoring', label: 'Fetal monitoring', rotations: ['obgyn'], terms: ['fetal heart', 'deceleration', 'ctg', 'nst', 'non-stress', 'variability'] },

  // ---- Internal medicine / cross-rotation ----
  { id: 'sepsis', label: 'Sepsis', rotations: null, terms: ['sepsis', 'septic shock', 'qsofa', 'sirs'] },
  { id: 'heart-failure', label: 'Heart failure', rotations: null, terms: ['heart failure', 'chf', 'pulmonary edema', 'ejection fraction', 'bnp'] },
  { id: 'acs', label: 'Acute coronary syndrome', rotations: null, terms: ['stemi', 'nstemi', 'acute coronary', 'unstable angina', 'troponin'] },
  { id: 'arrhythmia', label: 'Arrhythmias', rotations: null, terms: ['atrial fibrillation', 'afib', 'svt', 'ventricular tachycardia', 'bradycardi', 'heart block'] },
  { id: 'copd', label: 'COPD', rotations: null, terms: ['copd', 'chronic obstructive'] },
  { id: 'pe-dvt', label: 'VTE — PE & DVT', rotations: null, terms: ['pulmonary embolism', 'dvt', 'deep vein', 'wells score', 'd-dimer', 'anticoagulat'] },
  { id: 'diabetes', label: 'Diabetes', rotations: null, terms: ['diabetes', 'dka', 'hypoglycemi', 'hba1c', 'insulin'] },
  { id: 'stroke', label: 'Stroke & TIA', rotations: null, terms: ['stroke', 'tia', 'thrombolysis', 'tpa', 'nihss'] },
  { id: 'gi-bleed', label: 'GI bleeding', rotations: null, terms: ['gi bleed', 'melena', 'hematemesis', 'variceal', 'peptic ulcer'] },
  { id: 'acid-base', label: 'Acid-base', rotations: null, terms: ['acidosis', 'alkalosis', 'anion gap', 'acid-base', 'abg'] },

  // ---- Surgery ----
  { id: 'appendicitis', label: 'Appendicitis', rotations: ['surgery'], terms: ['appendicitis', 'appendix', 'mcburney'] },
  { id: 'bowel-obstruction', label: 'Bowel obstruction', rotations: ['surgery'], terms: ['bowel obstruction', 'sbo', 'ileus', 'volvulus'] },
  { id: 'hernia', label: 'Hernias', rotations: ['surgery'], terms: ['hernia'] },
  { id: 'biliary', label: 'Gallbladder & biliary', rotations: ['surgery'], terms: ['cholecystitis', 'cholangitis', 'gallstone', 'biliary', 'murphy'] },
  { id: 'trauma-primary-survey', label: 'Trauma primary survey', rotations: ['surgery'], terms: ['primary survey', 'atls', 'abcde', 'fast scan', 'secondary survey'] },
  { id: 'wound-care', label: 'Wounds & healing', rotations: ['surgery'], terms: ['wound heal', 'suture', 'dehiscence', 'surgical site infection'] },
]

// Fast lookup by id.
export const CONCEPT_BY_ID = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]))

// Labels for alias targets that aren't in CONCEPTS (topics that were already
// good concepts — they need a display name but no text matching).
export const ALIAS_LABELS = {
  ecg: 'ECG interpretation',
  'pain-management': 'Pain management',
  antimicrobials: 'Antimicrobials',
  'fluids-electrolytes': 'Fluids & electrolytes',
  diuretics: 'Diuretics',
  'acute-abdomen': 'Acute abdomen',
  'shock-altered-loc': 'Shock & altered LOC',
  'consent-capacity': 'Consent & capacity',
  'hand-injuries': 'Hand injuries',
  knee: 'Knee',
  'neurocritical-care': 'Neurocritical care',
  'thoracic-trauma': 'Thoracic trauma',
  burns: 'Burns',
  transfusion: 'Transfusion',
  anemia: 'Anemia',
  'fetal-growth': 'Fetal growth',
  'antenatal-care': 'Antenatal care',
  'infections-in-pregnancy': 'Infections in pregnancy',
  'maternal-physiology': 'Maternal physiology',
  'hypertensive-pregnancy': 'Hypertensive disorders of pregnancy',
  'diabetes-pregnancy': 'Diabetes in pregnancy',
  'early-pregnancy-bleeding': 'Early pregnancy bleeding',
  'abnormal-labour': 'Abnormal labour & delivery',
  'normal-labour': 'Normal labour & delivery',
}

export function conceptLabel(id) {
  return CONCEPT_BY_ID[id]?.label || ALIAS_LABELS[id] || id
}
