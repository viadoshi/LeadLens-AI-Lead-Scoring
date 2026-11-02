# LeadLens — Frontend Web Application

The LeadLens frontend is a responsive, enterprise-grade B2B lead intelligence application built with **React 19** and **Vite 8**. It connects directly to the LeadLens FastAPI backend to provide real-time lead scoring, interactive pipeline analytics, model governance dashboards, and campaign tracking for **Glitchreach**.

---

## Technology Stack

- **Framework**: React 19 (ES Modules)
- **Build Tool**: Vite 8 with Hot Module Replacement (HMR)
- **Routing**: React Router v7 (nested layouts & dynamic path parameters)
- **Data Visualizations**: Recharts (smooth line, bar, and area SVG charts)
- **Icons**: Lucide React
- **HTTP Client**: Axios with automatic fallback to `http://127.0.0.1:8000`
- **Styling**: Vanilla CSS design system with CSS custom property tokens for complete **Dark & Light theme** support
- **Code Quality**: Oxlint (Rust-based linter with 0 warnings)

---

## Pages & Modules

| Route | Page Component | Functional Overview |
| :--- | :--- | :--- |
| `/` | `Overview.jsx` | Executive KPIs, 30-day conversion velocity chart, acquisition mix, priority leads queue |
| `/leads` | `Leads.jsx` | Searchable lead directory, multi-factor tier/channel filtering, and detail drawers |
| `/leads/:leadId` | `LeadDetails.jsx` | Individual lead conversion probability, intent radar, firmographics, and activity timeline |
| `/predict` | `Predict.jsx` | Interactive scoring simulator calculating conversion probabilities and intent badges |
| `/models` | `Models.jsx` | Model tournament rankings, ROC-AUC comparison, feature weights, and calibration plots |
| `/analytics` | `Analytics.jsx` | Time-range filtered revenue analytics (`7d`, `30d`, `90d`, `all`), channel yield, score distribution |
| `/campaigns` | `Campaigns.jsx` | Campaign Intelligence (Phase 3.7): search, filters, table, create, edit, and archive modals |
| `/campaigns/:campaignId` | `CampaignDetails.jsx` | Granular campaign attribution: source mix, score buckets, and top 5 captured leads |
| `/settings` | `Settings.jsx` | Threshold calibration sliders, model sensitivity, CRM connectors, alerts, and org profile |

---

## Getting Started

From the `frontend/` directory:

### 1. Install Node Dependencies
```powershell
npm install
```

### 2. Configure Environment (Optional)
The application automatically defaults to connecting to `http://127.0.0.1:8000`. To customize the backend URL:
```powershell
cp .env.example .env
```

### 3. Run Development Server
```powershell
npm run dev
```
Visit `http://localhost:5173/` in your browser.

---

## Scripts & Verification

From the `frontend/` directory:

- **Linting** (Oxlint with 0 warnings):
  ```powershell
  npm run lint
  ```
- **Production Build**:
  ```powershell
  npm run build
  ```
- **Preview Production Bundle**:
  ```powershell
  npm run preview
  ```

---

## Documentation

For full system architecture, machine learning tournament benchmarks, and end-to-end setup instructions, refer to the [Root README](../README.md).
