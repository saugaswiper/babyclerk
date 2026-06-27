// High-yield starter content for Psychiatry.
export default {
  id: 'psychiatry',
  name: 'Psychiatry',
  emoji: '🧠',
  blurb: 'Risk assessment, the mental state exam, and the Mental Health Act.',
  checklist: [
    'Be fluent in the Mental State Examination (MSE) structure',
    'Always perform and document a risk assessment (self/others)',
    'Know the core sections of the Mental Health Act (your jurisdiction)',
    'Understand first-line pharmacology for depression, psychosis, bipolar',
    'Be able to screen for suicide risk safely and directly',
    'Know the key drug side-effects and monitoring (lithium, clozapine)',
  ],
  notes: [
    {
      id: 'psych-note-mse',
      title: 'Mental State Examination',
      topic: 'Assessment',
      sections: [
        {
          heading: 'Structure (ASEPTIC)',
          points: [
            'Appearance & behaviour',
            'Speech (rate, volume, form)',
            'Emotion (mood — subjective; affect — objective)',
            'Perception (hallucinations, illusions)',
            'Thought (form & content — delusions, obsessions)',
            'Insight & Judgement',
            'Cognition',
          ],
        },
      ],
    },
    {
      id: 'psych-note-risk',
      title: 'Risk & the Mental Health Act',
      topic: 'Core',
      sections: [
        {
          heading: 'Risk assessment',
          points: ['Risk to self (suicide, self-harm, self-neglect)', 'Risk to others', 'Risk from others (vulnerability/safeguarding)', 'Static vs dynamic/modifiable factors'],
        },
        {
          heading: 'MHA (England & Wales — adapt to your setting)',
          points: ['Section 2: assessment, up to 28 days', 'Section 3: treatment, up to 6 months', 'Section 5(2): doctor’s holding power, 72 hours', 'Section 136: police, place of safety'],
        },
      ],
    },
    {
      id: 'psych-note-pharm',
      title: 'Core Pharmacology',
      topic: 'Management',
      sections: [
        {
          heading: 'First-line agents',
          points: ['Depression: SSRI (e.g. sertraline)', 'Generalised anxiety: SSRI/SNRI', 'Schizophrenia: atypical antipsychotic', 'Bipolar (mood stabiliser): lithium'],
        },
        {
          heading: 'Monitoring',
          points: ['Lithium: levels (narrow therapeutic index), U&E, TFTs', 'Clozapine: FBC (agranulocytosis risk) via mandatory monitoring', 'Antipsychotics: weight, glucose/lipids, ECG (QTc), prolactin'],
        },
      ],
    },
  ],
  flashcards: [
    { id: 'psych-fc-1', topic: 'Psychosis', front: 'Schneider’s first-rank symptoms of schizophrenia', back: 'Auditory hallucinations (running commentary, voices discussing, thought echo), thought interference (insertion/withdrawal/broadcast), passivity phenomena, and delusional perception.' },
    { id: 'psych-fc-2', topic: 'Mood', front: 'Core symptoms of depression', back: 'Low mood, anhedonia, and low energy (≥2 weeks), plus biological (sleep, appetite, libido, concentration) and cognitive (guilt, worthlessness, hopelessness) symptoms.' },
    { id: 'psych-fc-3', topic: 'Pharmacology', front: 'Signs of lithium toxicity', back: 'Coarse tremor, ataxia, dysarthria, vomiting/diarrhoea, confusion, seizures. Precipitated by dehydration, NSAIDs, ACEi, diuretics. Check levels urgently.' },
    { id: 'psych-fc-4', topic: 'Pharmacology', front: 'Serotonin syndrome triad', back: 'Neuromuscular excitation (clonus, hyperreflexia, rigidity), autonomic instability (hyperthermia, tachycardia), and altered mental state. Stop the agent; supportive care ± cyproheptadine.' },
    { id: 'psych-fc-5', topic: 'Pharmacology', front: 'Neuroleptic malignant syndrome features', back: 'Fever, “lead-pipe” rigidity, autonomic instability, altered consciousness, raised CK. Caused by antipsychotics. Stop drug; supportive care ± dantrolene/bromocriptine.' },
    { id: 'psych-fc-6', topic: 'Pharmacology', front: 'Mandatory monitoring for clozapine and why', back: 'Regular FBC for neutrophil count due to risk of agranulocytosis. Reserved for treatment-resistant schizophrenia.' },
    { id: 'psych-fc-7', topic: 'Risk', front: 'Static risk factors for suicide', back: 'Male sex, older age, previous attempts, chronic illness, psychiatric history, family history. Combine with dynamic factors (current intent, plan, hopelessness, access to means).' },
    { id: 'psych-fc-8', topic: 'Assessment', front: 'Mood vs affect', back: 'Mood is the patient’s subjective, sustained emotional state (“how have you been feeling?”). Affect is the examiner’s objective observation of expressed emotion (range, reactivity, congruence).' },
  ],
  viva: [
    { id: 'psych-viva-1', topic: 'Risk', question: 'How do you assess suicide risk in a patient who expresses low mood?', answer: 'Ask directly and empathically — asking does not plant the idea. Explore thoughts, intent, specific plans, preparatory acts, access to means, and protective factors. Combine current (dynamic) factors with static risk factors and any history of attempts. Document clearly, ensure immediate safety, and escalate to senior/psychiatric review when risk is significant.' },
    { id: 'psych-viva-2', topic: 'Assessment', question: 'Walk me through the components of a Mental State Examination.', answer: 'Appearance and behaviour; Speech (rate, volume, form); Emotion split into mood (subjective) and affect (objective); Perception (hallucinations/illusions); Thought form and content (including delusions and obsessions); Insight and judgement; and Cognition. It is a structured snapshot of the patient at the time of assessment.' },
    { id: 'psych-viva-3', topic: 'Pharmacology', question: 'A patient on lithium presents with a coarse tremor and confusion. What are you worried about?', answer: 'Lithium toxicity. Lithium has a narrow therapeutic index, and toxicity causes coarse tremor, ataxia, dysarthria, GI upset, confusion and seizures, often precipitated by dehydration or interacting drugs (NSAIDs, ACEi, diuretics). Check the lithium level and renal function urgently, stop lithium, rehydrate, and consider dialysis in severe cases.' },
    { id: 'psych-viva-4', topic: 'Core', question: 'When might you use the Mental Health Act, and which sections are most relevant on the wards?', answer: 'When a patient with a mental disorder needs assessment or treatment and lacks the willingness to stay voluntarily while posing a risk to themselves or others. Common sections (England & Wales) are Section 2 (assessment, 28 days), Section 3 (treatment, 6 months), Section 5(2) (doctor’s holding power, 72 hours), and Section 136 (police, place of safety). Always use the least restrictive option and follow local protocol.' },
  ],
  mcqs: [
    {
      id: 'psych-mcq-1', topic: 'Pharmacology',
      question: 'A patient is started on a new antipsychotic and develops fever, rigidity, autonomic instability and a raised creatine kinase. Most likely diagnosis?',
      options: ['Serotonin syndrome', 'Neuroleptic malignant syndrome', 'Malignant hyperthermia', 'Anticholinergic toxicity'],
      answer: 1,
      explanation: 'NMS is associated with antipsychotics and features fever, lead-pipe rigidity, autonomic instability and raised CK. Stop the drug and give supportive care.',
    },
    {
      id: 'psych-mcq-2', topic: 'Pharmacology',
      question: 'Which medication requires mandatory regular full blood count monitoring due to agranulocytosis risk?',
      options: ['Olanzapine', 'Clozapine', 'Risperidone', 'Haloperidol'],
      answer: 1,
      explanation: 'Clozapine carries a risk of agranulocytosis and requires registration with a monitoring service and regular FBCs.',
    },
    {
      id: 'psych-mcq-3', topic: 'Core',
      question: 'Under the Mental Health Act (England & Wales), which section allows detention for assessment for up to 28 days?',
      options: ['Section 2', 'Section 3', 'Section 5(2)', 'Section 136'],
      answer: 0,
      explanation: 'Section 2 is for assessment (up to 28 days); Section 3 is for treatment (up to 6 months).',
    },
    {
      id: 'psych-mcq-4', topic: 'Mood',
      question: 'What is the typical first-line pharmacological treatment for moderate depression?',
      options: ['Tricyclic antidepressant', 'SSRI', 'Antipsychotic', 'Benzodiazepine'],
      answer: 1,
      explanation: 'An SSRI (e.g. sertraline) is first-line, usually alongside psychological therapy.',
    },
  ],
}
