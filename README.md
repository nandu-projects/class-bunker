# Class Bunker 🛡️
> **Bunk smart. Stay eligible.**  
> *Know exactly how many classes you can miss without putting your attendance at risk.*

Class Bunker is a production-quality, responsive web application built for college and university students worldwide. It answers the critical question:
**"How many classes can I safely miss while staying above my required attendance percentage?"**

---

## 🌟 Key Highlights

- **Universal Attendance Planning**: Not locked into any single university. Works for 75%, 80%, 85%, or any custom college rule. Includes Dayananda Sagar Academy of Technology and Management (**DSATM**) as a preconfigured demo.
- **Integer-Exact Mathematical Engine**: No rounding glitches or floating-point approximations. Computes the mathematically exact maximum number of safe bunks and minimum recovery classes.
- **What-If Bunk Simulator**: Simulate missing or attending 1, 2, 3, 5, 10, or custom classes before bunking. View live percentage impact and eligibility status shifts.
- **Attendance Recovery Calculator**: Calculates the exact consecutive classes needed to return above the minimum threshold after falling behind.
- **Attendance Target Matrix**: Compare 75%, 80%, 85%, and 90% targets side by side for each subject or overall.
- **Subject Management**: Add unlimited subjects, mark attendance in real-time with one-tap steppers (`+ Attended`, `+ Missed`, `- Undo`), duplicate, edit, reset, or delete.
- **Responsive Mobile-First UI**: Bottom navigation on mobile devices, responsive header navigation on desktop, with seamless dark and light theme switching.
- **100% Private & Offline**: All data persists in browser `localStorage`. No accounts, USNs, passwords, or cloud trackers required.
- **Data Portability**: Full JSON backup and restore, plus CSV spreadsheet export.

---

## 📐 Mathematical Formulation

### 1. Current Attendance Percentage
$$\text{Attendance} = \left(\frac{\text{Attended}}{\text{Conducted}}\right) \times 100$$
*(If conducted classes = 0, default is 100% or initial start).*

### 2. Maximum Safe Bunks (Classes You Can Miss)
To find the maximum future classes $x$ a student can safely miss while remaining at or above required percentage $R$:
$$\frac{\text{Attended}}{\text{Conducted} + x} \ge \frac{R}{100}$$
Solving for integer $x$:
$$x = \left\lfloor \frac{100 \times \text{Attended}}{R} \right\rfloor - \text{Conducted}$$
If current attendance is already below $R\%$, $x = 0$ (no safe bunks permitted).

### 3. Recovery Classes (Consecutive Classes to Attend)
If a student is below $R\%$, we calculate the minimum consecutive classes $x$ they must attend without missing:
$$\frac{\text{Attended} + x}{\text{Conducted} + x} \ge \frac{R}{100}$$
Solving for integer $x$:
$$x = \left\lceil \frac{R \times \text{Conducted} - 100 \times \text{Attended}}{100 - R} \right\rceil$$
*(Note: If $R = 100\%$ and any class was missed, mathematical 100% cannot be achieved).*

### 4. Overall Attendance
As mandated by educational institutions, overall attendance is **never** a simple average of subject percentages. It is weighted by class volume:
$$\text{Overall Attendance} = \left(\frac{\sum \text{Attended}}{\sum \text{Conducted}}\right) \times 100$$

---

## 🚀 Quick Start

### Option A: Run in Browser Directly
Open `index.html` directly in any modern browser (Chrome, Firefox, Safari, Edge).

### Option B: Local Python Development Server
Run:
```bash
python server.py
```
Open `http://localhost:8080` in your web browser.

---

## 🧪 Running the Mathematical Verification Test Suite

A standalone verification test suite is included in `tests/test_engine.py`:
```bash
python tests/test_engine.py
```
This tests all 12 edge cases including:
- Standard 75% calculation
- Small class counts (e.g. 3/4)
- Large class counts (e.g. 450/500)
- 100% and 0% extremes
- Custom 80% and 85% thresholds
- Weighted vs simple average integrity
- Recovery milestone computations

---

## 📂 Project Architecture

```
class-bunker/
├── css/
│   └── styles.css          # Design system, themes (light/dark), mobile navigation & responsive layout
├── js/
│   ├── engine.js           # Pure mathematical calculation engine
│   ├── store.js            # LocalStorage state management, import/export & demo data
│   └── app.js              # Application controller, view routing, reactive UI & modals
├── tests/
│   └── test_engine.py      # Automated Python math verification test suite
├── index.html              # Single-page web app entry point
├── server.py               # Lightweight local HTTP server
├── .gitignore              # Git ignore rules for clean repository
└── README.md               # Project documentation
```

---

## ⚖️ Official Advisory

Class Bunker is an attendance planning and simulation tool. Calculations are based strictly on the input data and chosen threshold. Always verify your university or college's official attendance rules and eligibility notices.

---

## 📄 License
MIT License. Built for students everywhere by [nandu-projects](https://github.com/nandu-projects).
