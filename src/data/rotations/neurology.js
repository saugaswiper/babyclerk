// High-yield starter content for Neurology.
export default {
  id: 'neurology',
  name: 'Neurology',
  emoji: '⚡',
  blurb: 'Localise the lesion, the time-critical stroke pathway, and the neuro exam.',
  checklist: [
    'Be slick and systematic at the cranial nerve & peripheral neuro exam',
    'Always localise: cortex, brainstem, cord, root, nerve, NMJ, or muscle?',
    'Know the acute stroke pathway and thrombolysis window',
    'Recognise status epilepticus and its stepwise management',
    'Distinguish UMN from LMN signs instantly',
    'Know red flags for headache and back/cord pathology',
  ],
  notes: [
    {
      id: 'neuro-note-umnlmn',
      title: 'UMN vs LMN Signs',
      topic: 'Examination',
      sections: [
        {
          heading: 'Upper motor neuron',
          points: ['Increased tone (spasticity)', 'Hyperreflexia', 'Upgoing plantars (Babinski)', 'No wasting/fasciculation (disuse atrophy late)', 'Pyramidal weakness pattern'],
        },
        {
          heading: 'Lower motor neuron',
          points: ['Reduced tone', 'Hyporeflexia/areflexia', 'Wasting and fasciculations', 'Marked weakness'],
        },
      ],
    },
    {
      id: 'neuro-note-stroke',
      title: 'Acute Stroke Pathway',
      topic: 'Vascular',
      sections: [
        {
          heading: 'Recognise',
          points: ['FAST: Face, Arm, Speech, Time', 'ROSIER score in the ED', 'Sudden focal neurological deficit'],
        },
        {
          heading: 'Act',
          points: [
            'Immediate non-contrast CT head to exclude haemorrhage',
            'Thrombolysis (alteplase/tenecteplase) within 4.5 hours if no contraindication',
            'Mechanical thrombectomy for large-vessel occlusion (extended windows with imaging)',
            'Aspirin 300 mg once haemorrhage excluded',
          ],
        },
      ],
    },
    {
      id: 'neuro-note-status',
      title: 'Status Epilepticus',
      topic: 'Emergency',
      sections: [
        {
          heading: 'Definition',
          points: ['A seizure ≥5 minutes, or repeated seizures without recovery in between'],
        },
        {
          heading: 'Stepwise management',
          points: [
            'ABCDE, oxygen, glucose, time the seizure',
            'Step 1: IV lorazepam (or buccal midazolam / rectal diazepam) — repeat once after 5–10 min',
            'Step 2: IV levetiracetam, phenytoin or valproate',
            'Step 3: general anaesthesia (e.g. propofol) + ICU',
          ],
        },
      ],
    },
  ],
  flashcards: [
    { id: 'neuro-fc-1', topic: 'Vascular', front: 'Thrombolysis window for ischaemic stroke', back: 'Within 4.5 hours of symptom onset (with no contraindications) after CT excludes haemorrhage. Thrombectomy may extend the window for large-vessel occlusion using imaging selection.' },
    { id: 'neuro-fc-2', topic: 'Examination', front: 'Key differences between UMN and LMN lesions', back: 'UMN: increased tone, hyperreflexia, upgoing plantars, no fasciculations. LMN: reduced tone, hyporeflexia, wasting and fasciculations.' },
    { id: 'neuro-fc-3', topic: 'Peripheral', front: 'Features of Guillain-Barré syndrome', back: 'Ascending symmetrical weakness with areflexia, often post-infective (Campylobacter). LP shows albuminocytological dissociation. Monitor FVC (respiratory failure); treat with IVIG or plasma exchange.' },
    { id: 'neuro-fc-4', topic: 'Headache', front: 'Features of subarachnoid haemorrhage', back: 'Sudden “thunderclap” worst-ever headache, neck stiffness, photophobia, ± reduced consciousness. CT head first; if negative and suspicion high, LP after 12h for xanthochromia.' },
    { id: 'neuro-fc-5', topic: 'Movement', front: 'Cardinal features of Parkinson’s disease', back: 'Bradykinesia plus resting tremor (pill-rolling), rigidity (cogwheel), and postural instability — typically asymmetrical onset.' },
    { id: 'neuro-fc-6', topic: 'NMJ', front: 'Myasthenia gravis hallmark', back: 'Fatigable weakness worse with activity/end of day (ptosis, diplopia, bulbar). Anti-AChR antibodies; treat with pyridostigmine ± immunosuppression. Myasthenic crisis = respiratory failure.' },
    { id: 'neuro-fc-7', topic: 'Headache', front: 'Distinguish migraine, tension and cluster headache', back: 'Migraine: unilateral throbbing, photophobia, nausea, ± aura. Tension: bilateral band-like, no nausea. Cluster: severe unilateral periorbital pain with autonomic features, in clusters.' },
    { id: 'neuro-fc-8', topic: 'Vascular', front: 'What is the ROSIER score used for?', back: 'Recognition Of Stroke In the Emergency Room — helps identify likely stroke; a score >0 suggests stroke is likely.' },
  ],
  viva: [
    { id: 'neuro-viva-1', topic: 'Vascular', question: 'A patient presents with sudden right-sided weakness and slurred speech 1 hour ago. What do you do?', answer: 'Treat as acute stroke. ABCDE, check glucose, and use FAST/ROSIER. Arrange an immediate non-contrast CT head to exclude haemorrhage. If ischaemic and within 4.5 hours with no contraindications, offer thrombolysis, and consider thrombectomy for large-vessel occlusion. Give aspirin 300 mg once haemorrhage is excluded, and admit to a stroke unit.' },
    { id: 'neuro-viva-2', topic: 'Examination', question: 'How do you distinguish an upper from a lower motor neuron lesion on examination?', answer: 'Upper motor neuron lesions cause increased tone (spasticity), hyperreflexia, upgoing plantars and a pyramidal pattern of weakness without wasting or fasciculations. Lower motor neuron lesions cause reduced tone, hyporeflexia or areflexia, wasting and fasciculations. This helps localise the lesion within the nervous system.' },
    { id: 'neuro-viva-3', topic: 'Emergency', question: 'How do you manage a patient in status epilepticus?', answer: 'ABCDE with oxygen, check glucose, and time the seizure. First-line is a benzodiazepine — IV lorazepam (or buccal midazolam/rectal diazepam), repeated once after 5–10 minutes. If it continues, give a second-line agent such as levetiracetam, phenytoin or valproate. Refractory seizures need general anaesthesia and ICU. Throughout, look for and treat the underlying cause.' },
    { id: 'neuro-viva-4', topic: 'Headache', question: 'A patient describes a sudden “worst headache of my life.” What is your concern and approach?', answer: 'Subarachnoid haemorrhage. Assess with ABCDE and a neurological exam, and arrange an urgent non-contrast CT head. If the CT is negative but suspicion remains, perform a lumbar puncture after 12 hours looking for xanthochromia. Involve neurosurgery/neurology early, control blood pressure and pain, and treat the cause (e.g. aneurysm coiling/clipping).' },
  ],
  mcqs: [
    {
      id: 'neuro-mcq-1', topic: 'Vascular',
      question: 'A patient with suspected acute ischaemic stroke arrives 2 hours after symptom onset. What is the essential FIRST investigation before treatment?',
      options: ['MRI spine', 'Non-contrast CT head', 'Carotid Doppler', 'Lumbar puncture'],
      answer: 1,
      explanation: 'A non-contrast CT head is performed first to exclude haemorrhage before considering thrombolysis.',
    },
    {
      id: 'neuro-mcq-2', topic: 'Examination',
      question: 'Which set of findings is characteristic of a lower motor neuron lesion?',
      options: ['Increased tone, hyperreflexia, upgoing plantars', 'Reduced tone, hyporeflexia, fasciculations', 'Normal tone, brisk reflexes, no weakness', 'Increased tone, wasting, downgoing plantars'],
      answer: 1,
      explanation: 'LMN lesions cause reduced tone, hyporeflexia/areflexia, wasting and fasciculations. UMN lesions cause spasticity, hyperreflexia and upgoing plantars.',
    },
    {
      id: 'neuro-mcq-3', topic: 'Emergency',
      question: 'What is the first-line drug for a patient in convulsive status epilepticus with IV access?',
      options: ['IV phenytoin', 'IV lorazepam', 'IV levetiracetam', 'IV propofol'],
      answer: 1,
      explanation: 'A benzodiazepine (IV lorazepam) is first-line, repeated once if needed before second-line agents like levetiracetam or phenytoin.',
    },
    {
      id: 'neuro-mcq-4', topic: 'Peripheral',
      question: 'A patient develops ascending symmetrical weakness with areflexia two weeks after a diarrhoeal illness. Most likely diagnosis?',
      options: ['Myasthenia gravis', 'Guillain-Barré syndrome', 'Multiple sclerosis', 'Motor neurone disease'],
      answer: 1,
      explanation: 'Post-infective ascending weakness with areflexia suggests Guillain-Barré syndrome. Monitor respiratory function (FVC) and treat with IVIG or plasma exchange.',
    },
  ],
}
