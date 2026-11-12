// NASA Space Medicine & Human Research Program (HRP) Evidence-Based Dataset
// Configured for Deep Space Exploration (Artemis IV & Mars Transit Vehicle MTV-1)

export const MISSION_METADATA = {
  missionName: "ARES-V / Mars Transit Vehicle (MTV-1)",
  trajectory: "Earth-Mars Hohmann Transfer Orbit",
  currentDistanceKm: 78_450_200, // ~78.4 Million km from Earth
  oneWayLightSpeedDelaySeconds: 261, // ~4m 21s one-way radio latency
  missionDay: 142,
  totalMissionDays: 520,
  cabinEnvironment: {
    o2Percentage: 21.2, // Nominal: 21.0%
    co2Percentage: 0.38, // Nominal: < 0.5% (Elevated triggers headaches/fatigue)
    pressureKPa: 101.3, // 1 Atmosphere
    cabinTempC: 22.4,
    humidityPercent: 44,
  },
  radiationDosimetry: {
    instantaneousDoseRateMicroSvHr: 62.4, // Deep space galactic cosmic ray background
    cumulativeMissionDoseMSv: 148.6,
    nasaCareerLimitMSv: 600.0,
    solarParticleEventRisk: "LOW (Quiet Heliosphere)",
  }
};

export const CREW_MEMBERS = [
  {
    id: "crew-01",
    callsign: "ARES-CDR",
    name: "Dr. Sarah Lindqvist",
    role: "Commander & Mission Commander",
    age: 42,
    gender: "Female",
    bloodType: "O+",
    cumulativeEvaHours: 38.5,
    status: "NOMINAL",
    overallHealthScore: 94,
    sansScore: 32,
    vo2Max: 88,
    vitals: {
      heartRate: 68,
      bpm: 68,
      hrUnit: "BPM",
      bloodPressureSys: 118,
      bloodPressureDia: 76,
      bpUnit: "mmHg",
      spo2: 98.6,
      spo2Unit: "%",
      respirationRate: 14,
      respUnit: "br/min",
      coreTemperature: 36.8,
      tempUnit: "°C",
      hrvMs: 64, // Heart Rate Variability (ms) - lower means stress
      cognitiveLoadIndex: 28, // 0-100%
      sleepQualityIndex: 88, // 0-100%
      bmdLossRatePercentPerMonth: -1.0, // Bone Mineral Density loss rate
    },
    organAlerts: {
      brain: { status: "NOMINAL", note: "Alpha rhythm synchronized. Cognitive score optimal." },
      eyes: { status: "MONITOR", note: "Mild optic sheath dilation (+0.2mm) consistent with early microgravity cephalad fluid shift." },
      heart: { status: "NOMINAL", note: "Left ventricular mass stable. Normal sinus rhythm." },
      lungs: { status: "NOMINAL", note: "Clear alveolar exchange, VO2 max 44 mL/kg/min." },
      bones: { status: "NOMINAL", note: "Countermeasure treadmill ARED routine active (95% adherence)." },
    }
  },
  {
    id: "crew-02",
    callsign: "ARES-PLT",
    name: "Abebe Worku",
    role: "Flight Pilot & Systems Engineer",
    age: 38,
    gender: "Male",
    bloodType: "A+",
    cumulativeEvaHours: 24.0,
    status: "ELEVATED_RISK",
    overallHealthScore: 78,
    sansScore: 78,
    vo2Max: 74,
    vitals: {
      heartRate: 94,
      bpm: 94,
      hrUnit: "BPM",
      bloodPressureSys: 138,
      bloodPressureDia: 92,
      bpUnit: "mmHg",
      spo2: 96.2,
      spo2Unit: "%",
      respirationRate: 19,
      respUnit: "br/min",
      coreTemperature: 37.4,
      tempUnit: "°C",
      hrvMs: 38, // Lower HRV indicates acute physiological or circadian stress
      cognitiveLoadIndex: 74,
      sleepQualityIndex: 45,
      bmdLossRatePercentPerMonth: -1.3,
    },
    organAlerts: {
      brain: { status: "WARNING", note: "High circadian rhythm desynchronosis. Prefrontal cortex fatigue indicated." },
      eyes: { status: "WARNING", note: "SANS Stage-2: Papilledema detected. Intraocular pressure (IOP) elevated to 24 mmHg." },
      heart: { status: "MONITOR", note: "Tachycardia tendency. Premature ventricular contraction (PVC) detected 4x/hr." },
      lungs: { status: "NOMINAL", note: "Ventilation normal; mild hyperventilation during task spikes." },
      bones: { status: "MONITOR", note: "Urinary calcium excretion increased (+18%). Kidney stone hydration protocol recommended." },
    }
  },
  {
    id: "crew-03",
    callsign: "ARES-MS1",
    name: "Dr. Elena Rossi",
    role: "Chief Medical Officer & Astrobiologist",
    age: 39,
    gender: "Female",
    bloodType: "B+",
    cumulativeEvaHours: 16.2,
    status: "NOMINAL",
    overallHealthScore: 96,
    sansScore: 18,
    vo2Max: 92,
    vitals: {
      heartRate: 64,
      bpm: 64,
      hrUnit: "BPM",
      bloodPressureSys: 114,
      bloodPressureDia: 74,
      bpUnit: "mmHg",
      spo2: 99.1,
      spo2Unit: "%",
      respirationRate: 13,
      respUnit: "br/min",
      coreTemperature: 36.7,
      tempUnit: "°C",
      hrvMs: 72,
      cognitiveLoadIndex: 32,
      sleepQualityIndex: 92,
      bmdLossRatePercentPerMonth: -0.9,
    },
    organAlerts: {
      brain: { status: "NOMINAL", note: "High cognitive clarity. REM sleep cycles balanced." },
      eyes: { status: "NOMINAL", note: "Optic nerve sheath diameter normal (4.6 mm)." },
      heart: { status: "NOMINAL", note: "Resting bradycardia, high cardiovascular reserve." },
      lungs: { status: "NOMINAL", note: "Gas diffusion normal." },
      bones: { status: "NOMINAL", note: "Bisphosphonate prophylactic adherence complete." },
    }
  },
  {
    id: "crew-04",
    callsign: "ARES-MS2",
    name: "Kenji Sato",
    role: "Robotics & EVA Specialist",
    age: 44,
    gender: "Male",
    bloodType: "AB-",
    cumulativeEvaHours: 42.1,
    status: "NOMINAL",
    overallHealthScore: 91,
    sansScore: 41,
    vo2Max: 81,
    vitals: {
      heartRate: 72,
      bpm: 72,
      hrUnit: "BPM",
      bloodPressureSys: 122,
      bloodPressureDia: 80,
      bpUnit: "mmHg",
      spo2: 98.2,
      spo2Unit: "%",
      respirationRate: 15,
      respUnit: "br/min",
      coreTemperature: 36.9,
      tempUnit: "°C",
      hrvMs: 58,
      cognitiveLoadIndex: 40,
      sleepQualityIndex: 82,
      bmdLossRatePercentPerMonth: -1.1,
    },
    organAlerts: {
      brain: { status: "NOMINAL", note: "Vigilance test 98% accuracy." },
      eyes: { status: "MONITOR", note: "Mild hyperopic globe flattening." },
      heart: { status: "NOMINAL", note: "Cardiac output 5.2 L/min." },
      lungs: { status: "NOMINAL", note: "Normal thoracic impedance." },
      bones: { status: "NOMINAL", note: "ARED resistance training nominal." },
    }
  }
];

export const NASA_HRP_RISKS = [
  {
    code: "HRP-SANS",
    title: "Spaceflight-Associated Neuro-ocular Syndrome (SANS)",
    category: "Sensory & Neurovestibular",
    nasaEvidenceLink: "NASA HRP Evidence Report - Risk of SANS",
    description: "Cephalad fluid shift caused by prolonged microgravity increases venous pressure in the head, causing optic disc swelling (papilledema), globe flattening, choroidal folds, and hyperopic refractive shifts.",
    countermeasures: ["Lower Body Negative Pressure (LBNP)", "Choke collar (IJV compression)", "Targeted veno-dilation therapies"]
  },
  {
    code: "HRP-CARDIO",
    title: "Cardiovascular Deconditioning & Arrhythmias",
    category: "Cardiovascular",
    nasaEvidenceLink: "NASA HRP Evidence Report - Cardiac Rhythm & Atrophy",
    description: "Loss of left ventricular mass, carotid arterial stiffness, autonomic orthostatic intolerance upon gravity re-entry, and risk of ventricular dysrhythmias induced by electrolyte shifts and radiation.",
    countermeasures: ["High-intensity interval cycle ergometry", "Saline volume loading prior to gravitational transitions", "Beta-blocker/antiarrhythmic formulary"]
  },
  {
    code: "HRP-OSTEOPOROSIS",
    title: "Bone Mineral Demineralization & Renal Stones",
    category: "Musculoskeletal",
    nasaEvidenceLink: "NASA HRP Evidence Report - Bone Loss in Microgravity",
    description: "Loss of 1-1.5% bone density per month in cancellous weight-bearing bones (femur, spine, pelvis). Excess resorbed calcium is excreted in urine, creating high risk for acute nephrolithiasis (kidney stones).",
    countermeasures: ["ARED resistive exercise (600 lbs loading)", "Bisphosphonates / RANKL inhibitors", "Forced hydration (>2.5L/day) + potassium citrate"]
  },
  {
    code: "HRP-RAD",
    title: "Space Radiation Carcinogenesis & CNS Tissue Damage",
    category: "Radiation Health",
    nasaEvidenceLink: "NASA HRP Evidence Report - Galactic Cosmic Rays",
    description: "High-Z and high-energy (HZE) cosmic ions cross spacecraft shielding, inducing double-strand DNA breaks, central nervous system neuro-inflammation, and acute radiation syndrome risks during Solar Particle Events.",
    countermeasures: ["Water wall / Polyethylene storm shelter", "Radioprotective dietary antioxidants", "Autonomous active dosimeter telemetry"]
  }
];

export const EMERGENCY_CLINICAL_PROTOCOLS = [
  {
    id: "proto-sans",
    title: "SANS Intraocular Pressure & Papilledema Triage",
    severity: "HIGH",
    condition: "Elevated Optic Nerve Sheath Diameter (>5.0mm) + IOP > 22 mmHg",
    steps: [
      "Position patient in Lower Body Negative Pressure (LBNP) device at -25 mmHg for 45 minutes to draw venous fluids caudally.",
      "Conduct Butterfly iQ handheld ultrasound sweep across right and left optic globes (transverse and sagittal planes).",
      "Administer Acetazolamide 250 mg orally to reduce cerebrospinal fluid production rate.",
      "Re-measure Intraocular Pressure (IOP) using Tono-Pen every 2 hours.",
      "Queue encrypted ultrasound video slice to Earth Mission Control DSN telemetry buffer."
    ]
  },
  {
    id: "proto-arrhythmia",
    title: "Acute Cardiac Dysrhythmia & PVC Protocol",
    severity: "CRITICAL",
    condition: "Frequent Premature Ventricular Contractions (>6/min) or Non-sustained VT",
    steps: [
      "Direct crewmember to immediate supine/neutral microgravity restraint; apply 12-lead bio-harness.",
      "Verify cabin O2 and CO2 levels immediately (confirm CO2 < 0.5% to rule out hypercapnic dysrhythmia).",
      "Draw blood sample using onboard i-STAT cartridge: check potassium (K+) and magnesium (Mg2+) electrolyte levels.",
      "If hypokalemia present: Administer oral Potassium Chloride 20 mEq.",
      "If ventricular tachycardia with hemodynamic instability: Prepare Zoll AED defibrillator and Metoprolol 5mg IV."
    ]
  },
  {
    id: "proto-spe-radiation",
    title: "Solar Particle Event (SPE) Radiation Storm Protocol",
    severity: "EMERGENCY",
    condition: "Dosimeter alert > 150 µSv/hr (Active Solar Proton Event detected)",
    steps: [
      "Sound cabin alarm and direct all 4 crewmembers to central radiation storm shelter (Water-shielded core).",
      "Distribute oral radioprotective countermeasure cocktail (N-acetylcysteine + Filgrastim if indicated).",
      "Power down non-essential avionics; orient spacecraft propulsion block towards sunward vector.",
      "Monitor crew for acute radiation prodromal signs (nausea, lymphocyte depletion).",
      "Log cumulative crew dosimetry and transmit priority beacon via Deep Space Network."
    ]
  }
];
