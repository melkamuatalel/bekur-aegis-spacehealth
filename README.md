# 🚀 BEKUR-AEGIS: Autonomous Edge-AI Astronaut Health Intelligence System
### NASA Space Apps Challenge 2026 // Team BEKUR (Addis Ababa, Ethiopia)
**Challenge:** *Create Health Monitoring Software for Astronauts on Space Missions*

---

## 🌌 Overview
During deep space missions (such as NASA's Artemis Lunar Base and the journey to Mars), astronauts are isolated from Earth by distances exceeding **78+ million kilometers**, resulting in speed-of-light radio delays of **4 to 22 minutes one-way**. In an acute medical emergency, a round-trip transmission to Earth Flight Surgeons in Houston takes over **40 minutes**. Furthermore, physical crew evacuation to Earth is impossible.

**BEKUR-Aegis** is an autonomous, mission-critical health intelligence cockpit engineered to operate **100% offline** on the spacecraft's local computing avionics. It synthesizes real-time physiological telemetry, predicts acute microgravity pathologies (such as SANS, cardiac deconditioning, and cosmic radiation exposure), and delivers step-by-step clinical triage protocols to non-physician crewmembers.

---

## 🧬 Core Capabilities & Innovations

```
                                  +-------------------------------------------------+
                                  |   ARES-V / MARS TRANSIT VEHICLE (MTV-1)         |
                                  +-------------------------------------------------+
                                                           |
           +-----------------------------------------------+-------------------------------+
           |                                               |                               |
           v                                               v                               v
+-----------------------+                      +-----------------------+       +-----------------------+
|  Real-time Biometrics |                      |   Space Environment   |       |  3D Anatomical Wire   |
|  - Lead-II ECG Sweep  |                      |  - Cosmic Radiation   |       |  - SANS Optic Pressure|
|  - SpO2 & Respiration |                      |  - Cabin O2 & CO2     |       |  - Left Ventricular   |
|  - Blood Pressure     |                      |  - Microgravity BMD   |       |  - Bone Demineralized |
+-----------------------+                      +-----------------------+       +-----------------------+
           |                                               |                               |
           +-----------------------------------------------+-------------------------------+
                                                           |
                                                           v
                                         +-----------------------------------+
                                         |    BEKUR-MED OFFLINE EDGE AI      |
                                         |    - Real-Time Anomaly Detection  |
                                         |    - NASA HRP Diagnostic Matching |
                                         |    - Step-by-Step Clinical Triage |
                                         +-----------------------------------+
                                                           |
                                      +--------------------+--------------------+
                                      |                                         |
                                      v                                         v
                      +-------------------------------+         +-------------------------------+
                      |   Instant Crew Intervention   |         |   Deep Space Network (DSN)    |
                      |   - Ultrasound Sweep Protocol |         |   - AES-256 Telemetry Buffer  |
                      |   - LBNP Negative Pressure    |         |   - Store-and-Forward to      |
                      |   - Space Formulary Dosages   |         |     Earth Mission Control     |
                      +-------------------------------+         +-------------------------------+
```

1. **Lead-II Real-time Electrocardiogram (ECG) Sweep**:
   - Interactive medical-grade canvas displaying cardiac wave morphology (P-Q-R-S-T complexes).
   - Instant arrhythmia and premature ventricular contraction (PVC) anomaly detection.

2. **3D Interactive Anatomical Hologram**:
   - High-tech holographic wireframe with clickable physiological hotspots:
     - **Central Nervous System**: Cognitive fatigue & circadian rhythm misalignment.
     - **Optic Sheath (SANS)**: Papilledema and intraocular pressure monitoring.
     - **Cardiovascular Complex**: Orthostatic intolerance & ventricular remodeling.
     - **Musculoskeletal Matrix**: Monthly bone mineral density (BMD) demineralization & hypercalciuria nephrolithiasis risk.

3. **BEKUR-MED: Autonomous Chief Medical Officer**:
   - 100% offline edge-native clinical decision support.
   - Clinical symptom investigator & natural language diagnostic triage.
   - Direct execution of NASA space emergency protocols with interactive checklists.

4. **Deep Space Network (DSN) Store-and-Forward Telemetry Buffer**:
   - Demonstrates how the system queues encrypted, compressed health packets during communication blackouts, guaranteeing zero telemetry loss without needing live internet.

5. **Judge Demo "Simulate Emergency" Trigger**:
   - A single-click anomaly simulator that demonstrates how BEKUR-Aegis instantly detects a combined Solar Particle Event (SPE) radiation spike and crew tachycardia, alerting the spacecraft and providing clinical countermeasures.

---

## 🔬 Alignment with NASA Standards & Science
BEKUR-Aegis is built around documented standards from the **NASA Human Research Program (HRP)**:
- **NASA-STD-3001**: Space Flight Human-System Standard (Volume 1: Crew Health).
- **NASA HRP Evidence Books**: Risks of SANS, Radiation Carcinogenesis, Cardiac Dysrhythmias, and Renal Stone Formation.
- **NASA Space Medicine Formulary**: Standardized onboard pharmaceuticals and ultrasound diagnostic workflows.

---

## 💻 Tech Stack
- **Framework**: React 19 & Vite 6
- **Styling**: TailwindCSS with custom HUD glassmorphism & aerospace colorimetry
- **Audio Synthesizer**: Pure Web Audio API (zero external sound file latency)
- **Visuals & Icons**: Lucide-React & Canvas 2D Vector Rendering
- **Data Architecture**: Structured JSON Telemetry based on NASA Human Research Program parameters

---

## 🚀 Running the Project Locally
```bash
# 1. Clone repository
git clone https://github.com/melkamu/bekur-aegis-spacehealth.git

# 2. Install dependencies
cd bekur-aegis-spacehealth
npm install

# 3. Launch the development HUD cockpit
npm run dev
```
Open `http://localhost:3333` in your browser.

---
**Team BEKUR // NASA Space Apps Challenge 2026**
