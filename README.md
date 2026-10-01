# Class Bunker 🛡️
> **Bunk smart. Stay eligible.**  
> *Curriculum-aware universal attendance planning for college students.*

Class Bunker is a production-quality, responsive web application built for college and university students in Karnataka and beyond. It transforms attendance tracking from manual guessing into a **curriculum-aware planning tool**:
**Student selects their academic identity → Class Bunker identifies the verified curriculum → official subjects appear automatically.**

---

## 🌟 What's New in Version 2.0 (Curriculum-Aware)

- **Zero Manual Typing Academic Setup**: Students never have to type institution, course, branch, or semester names. Structured cascading selectors and searchable comboboxes handle selection seamlessly.
- **Authoritative Institutional Registry**:
  - Official VTU Affiliated Institutes ([VTU Institute Directory](https://vtu.ac.in/affiliated-institute/))
  - Official VTU Autonomous Colleges ([VTU Autonomous Colleges](https://vtu.ac.in/en/autonomous-colleges/))
  - Dayananda Sagar Academy of Technology and Management (**DSATM**), BMSCE, RVCE, DSCE, MSRIT, BIT, AIT, etc.
  - Extensible architecture supporting Bangalore University, BCU, Mysore, Mangalore, and other state universities.
- **Curriculum Confirmation Screen**: Displays discovered official subjects with course codes, credits, category (PCC, IPCC, PEC, PCCL, RMC, NCMC), and theory/lab indicators before adding them to tracking.
- **Official Source Provenance**: Every curriculum record stores `sourceUrl`, `sourceName`, and `verifiedDate`, linking students directly to the authoritative syllabus portal.
- **Verified Institutional Attendance Rules**: Distinguishes verified regulations (e.g. VTU Section 8 regulation requiring 75% in theory and lab separately) from unverified custom inputs.
- **Seamless Academic Re-configuration**: Changing academic programs alerts the student with confirmation before loading new curricula (e.g. switching from CSE-Cyber Security to EEE).
- **Progressive Web App (PWA)**: Fully installable on Android, iOS, and Desktop with offline shell caching via Service Worker.
- **Dedicated Demo Mode**: Clearly labeled simulated dataset for testing that never masquerades as official verified curriculum.

---

## 📐 Mathematically Exact Attendance Engine

1. **Current Attendance Percentage**:
   $$\text{Attendance} = \left(\frac{\text{Attended}}{\text{Conducted}}\right) \times 100$$

2. **Maximum Future Classes That Can Be Safely Missed**:
   $$x = \left\lfloor \frac{100 \times \text{Attended}}{R} \right\rfloor - \text{Conducted}$$
   *(Exact integer arithmetic without floating-point rounding errors).*

3. **Recovery Classes (Consecutive Classes to Attend)**:
   $$x = \left\lceil \frac{R \times \text{Conducted} - 100 \times \text{Attended}}{100 - R} \right\rceil$$

4. **Weighted Overall Attendance**:
   $$\text{Overall Attendance} = \left(\frac{\sum \text{Attended}}{\sum \text{Conducted}}\right) \times 100$$
   *(Never a simple average of subject percentages).*

---

## 🚀 Quick Start

### 1. Run in Browser Directly
Open `index.html` in Chrome, Firefox, Safari, or Edge.

### 2. Run Local Server
```bash
python server.py
```
Open `http://localhost:8080` (or `http://localhost:8081`).

---

## 🧪 Automated Test Suites

Run both the mathematical engine verification tests and the curriculum flow acceptance tests:
```bash
python tests/test_engine.py
python tests/test_curriculum.py
```

### Verified Acceptance Test Flow (Requirement #30):
1. State: Karnataka
2. College: DSATM
3. Course: B.E.
4. Branch: CSE – Cyber Security
5. Scheme: 2022 Scheme
6. Year: 3rd Year
7. Semester: 5th Semester
8. Official subjects discovered: 9 verified subjects with codes, credits, and syllabus provenance.
9. Switch branch: EEE -> 9 official EEE subjects discovered and confirmed.
10. Fallback: unindexed selections show clear unverified fallback option.

---

## 📂 Project Architecture

```
class-bunker/
├── css/
│   └── styles.css                 # Responsive stylesheet, themes, combobox & confirmation styles
├── js/
│   ├── data/
│   │   ├── universities.js        # Karnataka universities directory
│   │   ├── colleges.js            # Authoritative VTU affiliated & autonomous colleges
│   │   └── curricula.js           # Verified course schemes & semester syllabi with provenance
│   ├── curriculumService.js       # Cascading selector engine & curriculum resolution
│   ├── engine.js                  # Pure mathematical calculation engine
│   ├── store.js                   # LocalStorage persistence & academic identity state
│   └── app.js                     # Application controller & PWA lifecycle
├── tests/
│   ├── test_engine.py             # Math engine verification test suite (12 tests)
│   └── test_curriculum.py         # Curriculum discovery & acceptance test suite
├── icons/
│   └── icon.svg                   # PWA application icon
├── index.html                     # Main application entry point
├── manifest.json                  # PWA Web App Manifest
├── sw.js                          # Service Worker for offline shell caching
├── server.py                      # Local development & production static server
├── .gitignore                     # Git ignore rules
└── README.md                      # Documentation
```

---

## ⚖️ Official Advisory

Class Bunker is an attendance planning tool. Calculations and syllabus data reflect official university regulations and verified academic schemes. Students must always cross-check institution-specific attendance notifications.

---

## 📄 License
MIT License. Built for students by [nandu-projects](https://github.com/nandu-projects).
