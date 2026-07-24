# Front-End UI Specification: RAM-IRROPS Dashboard
**Target System:** Antigravity / v0 Generation Engine  
**Project Context:** Airline Passenger Redirection & Corporate Profitability (Morocco Hubs)  
**Theme:** Operations Control Center (OCC) Enterprise Dashboard (Dark Mode)

---

## 🎨 Theme & Styling System (Tailwind CSS)
* **Background:** Deep Navy / Slate (`bg-slate-950`, `bg-slate-900`)
* **Text:** Crisp White (`text-slate-50`), Muted Grey (`text-slate-400`)
* **Brand/Profit Accent (Green):** Emerald (`text-emerald-400`, `bg-emerald-500/10`)
* **Risk/Warning Accent (Amber):** Amber (`text-amber-400`, `bg-amber-500/10`)
* **Crisis/Critical Accent (Red):** Rose/Crimson (`text-rose-500`, `bg-rose-500/10`)
* **Icons:** Lucide Icons (Clean, geometric, thin-line stroke)

---

## 🛠️ Dashboard Layout Structure

### 1. Header & Global Controls (Top Navigation)
* **Application Title:** `RAM-IRROPS` with a sub-label `Predictive Passenger Redirection Engine`.
* **Hub Selector Dropdown:** Default value: `Casablanca Hub (CMN)`. Other items: `Marrakech (RAK)`, `Agadir (AGA)`.
* **System Metrics Bar:** Four cards stretching horizontally across the screen:
  * **Card 1 (Predictive Analytics):** Title: `Active Disruption Alerts` | Value: `14 Flights` | Sub-text: `Flagged by Stage 1 XGBoost`.
  * **Card 2 (Logistics Scope):** Title: `Impacted Moroccan Pax` | Value: `1,842 Passengers` | Sub-text: `Manifests in jeopardy`.
  * **Card 3 (Financial Protection):** Title: `Protected Profit Margin` | Value: `+34.2%` | Sub-text: `Saved via optimization vs baseline` (Color: Emerald).
  * **Card 4 (Automation Engine):** Title: `Automated Rebookings` | Value: `92.4%` | Sub-text: `Stage 2 PuLP solver success rate`.

---

### 2. Main Workspace Grid Layout
Split the remaining viewport space using a multi-pane grid layout (`grid grid-cols-12 gap-6 h-[calc(100vh-180px)]`):

#### Pane A: Stage 1 - Machine Learning Flight Prediction Panel (`col-span-4`)
* **Header:** Title `Stage 1: XGBoost Delay Tracking`. Includes a text input search bar with a search icon for filtering Flight IDs.
* **Scrollable Flight Queue List:** A vertical list showing tomorrow's upcoming scheduled flights.
* **Row Fields per Flight:**
  * Flight Code (e.g., `AT 780`, `AT 204`)
  * Route Badge (e.g., `CMN ➔ JFK`, `RAK ➔ CDG`)
  * Scheduled Departure Time (e.g., `14:30`)
  * **AI Output Metric:** A stylized, high-contrast probability percentage badge representing the delay risk output (`predict_proba`).
    * *Example High Risk Item:* `87% Risk` (Badge color: Crimson text, pulsing red border).
    * *Example Medium Risk Item:* `48% Risk` (Badge color: Amber text, solid amber border).
* **Interactivity:** Clicking a row marks it as active (`border-l-4 border-emerald-500 bg-slate-900`).

#### Pane B: Stage 2 - Affected Passenger Manifest View (`col-span-4`)
* **Header:** Title `Stage 2: Active Flight Manifest`. Sub-label shows currently inspected flight (e.g., `Selected: AT 780 to JFK`).
* **Relational Passenger Table:** Extracted structural manifest rows mapped via the flight index.
* **Columns:**
  * `Pax ID` (e.g., `PAX-004821`)
  * `Cabin Class` (Badges for `First` [Purple], `Business` [Blue], `Economy` [Grey])
  * `Loyalty Tier` (Text colors matching status: `Platinum` [Metallic Sparkle/Silver], `Gold` [Gold], `Silver` [Bronze], `None` [Muted])
  * `Status` (Icon showing if they are a `Connecting` passenger or `Final Destination`).

#### Pane C: Financial Cost & Redirection Matrix (`col-span-4`)
* **Header:** Title `Profit Optimization Analysis`. Features a prominent primary button labeled `EXECUTE STAGE 2 REDIRECTION` with a lightning bolt icon.
* **Module 1: Disruption Cost Penalties Component**
  * Displays a breakdown of estimated corporate expenses if standard operations fail:
    * *Regulatory Fines (EU261 Calculation):* `$42,600` (Calculated using flight distance parameters).
    * *Care & Accommodations:* `$12,300` (Hotel room allocations and meal voucher tracking).
    * *Customer Churn Value:* `$22,000` (Weighted penalty based on stranded Platinum/Gold tier flyers).
    * *Total Baseline Loss:* `$76,900` (Bold text).
* **Module 2: AI Optimization Solution Box (Emerald Green Theme)**
  * A box element wrapped in a thin border (`border-emerald-500/30 bg-emerald-950/20`).
  * **Optimized Loss Result:** `$24,100` (Large bold emerald text).
  * **Net Savings Metric:** `+$52,800 Retained Profit` (Accompanied by an up-trend arrow icon).
  * **Allocation Target Sub-list:** A breakdown showing where the PuLP solver mapped the displaced passengers:
    * *RAM AT 782 (Open Seats Used):* `45 Passengers allocated`
    * *Partner Carrier (Codeshare):* `82 Passengers allocated`
    * *Hotel + Next Day Route:* `23 Passengers allocated` (Minimized tier priority).

---

## 🚀 Execution Instructions for Code Generation
* Generate clean, production-ready React/Next.js functional components using standard Tailwind CSS classes.
* Ensure all text labels, metrics, variables, and code comments are written completely in **English**.
* Do not hide components behind placeholders; render complete dummy mock data structures inside the tables so the entire operational control center layout is fully populated and inspectable immediately.