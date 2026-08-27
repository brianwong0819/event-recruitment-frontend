# 🚀 Intelligent Event Recruitment Platform (Frontend)

![Vue.js](https://img.shields.io/badge/Vue.js-3.X-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PrimeVue](https://img.shields.io/badge/PrimeVue-UI-2196F3?style=for-the-badge&logo=primefaces&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-State-FFDE57?style=for-the-badge&logo=pinia&logoColor=black)

## 📌 Project Overview

This repository houses the Frontend architecture of the Intelligent Event Recruitment Platform, a modern web application engineered to bridge the gap between event organizers and freelance event professionals. The platform streamlines the end-to-end recruitment lifecycle by providing tailored, role-based workflows for Candidates, Recruiters, and Administrators. By integrating with an AI-driven backend, the application facilitates smart talent matching, dynamic scheduling, and automated reputation tracking, ultimately solving the high-friction, manual processes traditionally associated with short-term event staffing.

## 🏗️ System Architecture & Tech Stack

The application is built with a focus on component reusability, strict separation of concerns, and highly responsive UI/UX.

*   **Core Framework**: Vue 3 utilizing the Composition API (`<script setup>`) for highly readable and reactive component logic.
*   **Build Tool**: Vite, chosen for its lightning-fast Hot Module Replacement (HMR) and optimized production builds.
*   **State Management**: Pinia is implemented for modular, type-safe global state handling (e.g., authentication status, user profiles).
*   **UI & Styling**: A hybrid approach utilizing Tailwind CSS for rapid utility-first styling and PrimeVue for complex, accessible data components (DataTables, Dialogs, Advanced Calendars).
*   **API Communication**: Axios is abstracted into a dedicated service layer (`src/services/api.service.js`) with configured interceptors for automated JWT token attachment and expiration handling.

## ✨ Key Features

### 🎯 For Candidates
*   **Comprehensive Profile Management**: Dedicated views for uploading standard resumes alongside industry-specific "Comp-cards" (Composite Cards) and working photos.
*   **Granular Availability Engine**: Interactive calendar interfaces allowing candidates to define specific working dates and visibility toggles for the Recruiter Talent Pool.
*   **Smart Application Tracking**: A consolidated dashboard tracking application statuses across multiple stages (Pending, Hired, Completed, Withdrawn), coupled with a system to monitor their automated Reputation Score.

### 🏢 For Recruiters
*   **Advanced Talent Pool Search**: A dynamic filtering interface enabling recruiters to search candidates by availability, experience, languages, demographics, and AI-computed match scores.
*   **Complex Job & Schedule Creation**: Robust forms capable of handling multi-day, multi-location event schedules with specific role requirements per location.
*   **AI-Enhanced Applicant Tracking**: Interfaces designed to consume and display Gemini AI-generated evaluation scores and feedback for incoming applications.

### ⚙️ Technical Highlights
*   **Role-Based Layout Routing**: The application dynamically injects contextual layouts (`CandidateLayout.vue`, `RecruiterLayout.vue`, `AdminLayout.vue`) at the router level based on the authenticated user's JWT payload.
*   **Robust Token Lifecycle Management**: Implemented `token-handler.js` to proactively decode JWTs, check expiration thresholds, and trigger seamless refresh flows or graceful logouts.
*   **Modular Service Pattern**: Strict architectural boundary separating UI components from network logic. All HTTP requests are encapsulated in domain-specific services (`job.service.js`, `auth.service.js`, `location.service.js`) ensuring high maintainability and testability.

## 🚀 Getting Started (Developer Guide)

### Prerequisites
*   **Node.js**: v18.0.0 or higher.
*   **Package Manager**: `npm` (or `yarn`/`pnpm`).
*   **Backend**: The Spring Boot backend service must be running locally or accessible via network.

### Installation

1.  Clone the repository and install dependencies:
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root directory based on the provided configuration.

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | The base URL for the Spring Boot REST API | `http://localhost:8080/api` |
| `VITE_APP_TITLE` | The application title for browser tabs | `Event Recruitment Platform` |

### Running the App

To spin up the local Vite development server:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

## 📁 Project Structure (Abridged)

```text
src/
├── assets/             # Static assets, SVGs, and global CSS (Tailwind directives)
├── components/         # Reusable, atomic Vue components
│   ├── auth/           # Authentication toggles and wrappers
│   ├── candidate/      # Candidate-specific UI blocks (e.g., TalentPoolVisibility)
│   └── shared/         # Cross-domain components (ConfirmTrashDialog, LocationSearch)
├── layouts/            # Role-specific layout wrappers (Admin, Candidate, Recruiter)
├── router/             # Vue Router configuration and navigation guards
├── services/           # Axios API client abstracts and domain services
├── stores/             # Pinia state management (auth.js, profile.js)
├── utils/              # Helper functions (token-handler.js)
├── views/              # Page-level components
│   ├── admin/          # Admin Dashboard and Recruiter Management
│   ├── auth/           # Login, Registration, and Success views
│   ├── candidate/      # Job Search, My Applications, Profile configurations
│   └── recruiter/      # Job Creation, Talent Pool, Applicant Tracking
├── App.vue             # Root component
└── main.js             # Application entry point, plugin initialization
```

## 🗺️ Core Views & Routing

The application utilizes Vue Router with strict navigation guards to ensure data security and proper access control across three main domains:

*   **Authentication Flow (`/auth`)**: Handles unified logins, split registrations via `RegistrationToggle.vue`, and JWT storage.
*   **Candidate Portal (`/candidate/*`)**: Defaults to a tailored dashboard. Key routes include `/candidate/jobs` for the map/list job search and `/candidate/availability` for scheduling.
*   **Recruiter Portal (`/recruiter/*`)**: Features complex nested routes like `/recruiter/jobs/new` containing the multi-step `JobLocationScheduler.vue`, and `/recruiter/talent-pool` for querying the candidate database.

## 🔮 Future Improvements

Based on the current architectural state, the following technical enhancements are recommended:

1.  **State Caching & Optimistic UI**: Integrate a data-fetching library like *TanStack Query (Vue Query)*. This would significantly reduce redundant API calls in heavily trafficked views like the Recruiter Talent Pool and provide instant UI feedback during job application state changes.
2.  **Comprehensive E2E and Unit Testing**: Introduce *Vitest* for unit testing the isolated logic inside `src/services/` and `src/utils/`, alongside *Cypress* or *Playwright* to automate end-to-end testing for critical paths (e.g., the multi-step job creation flow).
3.  **Progressive Web App (PWA) Capabilities**: Given that candidates (event staff) will frequently access the platform on mobile devices in low-connectivity event environments, implementing Service Workers via `vite-plugin-pwa` would allow for offline schedule viewing and background syncing.
