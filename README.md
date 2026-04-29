# 🗳️ VoteMate AI — Your Personal Election Companion

> **AI-powered election guidance for every Indian voter.**  
> Powered by Google Gemini · Firebase · Google Cloud · Google Analytics · Google Fonts

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vote--mate--ai.vercel.app-blue?style=for-the-badge)](https://vote-mate-ai.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Budhadev678%2Fvote--mate--ai-black?style=for-the-badge&logo=github)](https://github.com/Budhadev678/vote-mate-ai)
[![Tests](https://img.shields.io/badge/Tests-100%2B%20Passing-brightgreen?style=for-the-badge)](./src/__tests__)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

---

## 📌 Challenge Vertical

**Election Process Education**

> *"Create an assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way."*

---

## 🎯 Problem Statement

Millions of Indian voters — especially first-time voters — don't know:
- How to register on the electoral roll
- What documents they need on polling day
- Where their assigned polling booth is
- How EVM and VVPAT machines work
- Their rights as a voter

This gap leads to **voter suppression through confusion**, not deliberate disenfranchisement.

**VoteMate AI** eliminates this gap with an accessible, AI-powered mobile companion available in English, Hindi, and Odia.

---

## 🧠 Approach & Logic

### Core Architecture

```
VoteMate AI
├── AI Chat Engine          # Google Gemini 2.0 Flash (primary) + Offline Engine (fallback)
├── Guided Journey          # Step-by-step voter readiness checklist
├── Polling Booth Finder    # Google Maps integration for booth search
├── News Verifier           # Gemini AI + Google NLP sentiment analysis
├── Crowd Predictor         # Optimal voting time recommendations
├── Community Insights      # Google Cloud Functions for regional data
├── Translation Engine      # Google Translate API for multilingual support
└── Profile & Progress      # Personal readiness score tracking
```

### How the AI Works

1. **Primary**: Google Gemini 2.0 Flash API processes natural language queries with full context awareness (voter type, state, language, readiness score)
2. **Fallback**: A fully trained offline engine handles 10+ common query categories without internet
3. **Context-Aware**: Every response is personalized based on voter profile, current step, and proximity to election day
4. **Multilingual**: Supports English, Hindi (हिंदी), and Odia (ଓଡ଼ିଆ) via Google Translate API
5. **Performance Tracked**: Every AI call is traced via Firebase Performance Monitoring

### Readiness Score Algorithm

```
Registration  → +30%
Verification  → +25%
Documents     → +25%
Voting Day    → +20%
─────────────────────
Total Max     → 100%
```

---

## 🔧 How the Solution Works

### Key Screens

| Screen | Purpose |
|--------|---------|
| **Landing** | App introduction with language selection |
| **Onboarding** | Voter type detection and state selection |
| **Dashboard** | Readiness overview with next action engine |
| **AI Chat** | Natural language Q&A powered by Google Gemini |
| **Guided Mode** | Step-by-step journey through all 4 milestones |
| **Quick Mode** | 1-minute election readiness guide |
| **Polling Booth** | Find assigned booth with Google Maps + crowd prediction |
| **News Verifier** | Fact-check election news with Gemini AI + Google NLP |
| **Document Checker** | Verify which IDs are valid on polling day |
| **Candidates** | Know your candidates before voting |
| **Report Violation** | Report election code violations (reCAPTCHA protected) |
| **Insights** | Detailed readiness analytics and progress chart |
| **Profile** | Manage preferences, language, region |
| **Accessibility** | Special assistance options for differently-abled voters |

---

## ⚡ Google Services Integration

| # | Service | Usage | File(s) |
|---|---------|-------|---------|
| 1 | **Google Gemini 2.0 Flash API** | Primary AI engine for all chat responses and news verification | `src/services/aiService.ts` |
| 2 | **Google Cloud Functions** | Secure backend processing for regional community insights | `functions/index.js` |
| 3 | **Google Maps Embed API** | Interactive embedded maps for Polling Booth navigation | `src/pages/PollingBoothScreen.tsx` |
| 4 | **Google Maps Geocoding API** | Address-to-coordinates conversion for booth finding | `src/services/googleServices.ts` |
| 5 | **Google Maps Places API** | Nearby polling station search by GPS location | `src/services/googleServices.ts` |
| 6 | **Google Cloud Translation API** | Dynamic multilingual content translation (EN/HI/OR) | `src/services/googleServices.ts` |
| 7 | **Google Cloud Natural Language API** | Sentiment analysis for fake news detection | `src/services/googleServices.ts` |
| 8 | **Google Firebase Firestore** | Anonymized chat analytics and booth search logging | `src/services/firebase.ts` |
| 9 | **Google Firebase Analytics** | Screen view tracking and user engagement events | `src/services/firebase.ts` |
| 10 | **Google Firebase Performance Monitoring** | Web vitals, AI response latency tracing | `src/services/googleServices.ts` |
| 11 | **Google Firebase Remote Config** | Feature flags, dynamic voting dates, maintenance mode | `src/services/googleServices.ts` |
| 12 | **Google Firebase Hosting** | Production CDN and caching | `firebase.json` |
| 13 | **Google Fonts** | Inter + Poppins typography (fonts.googleapis.com) | `index.html` |
| 14 | **Google Analytics 4** | gtag.js page-level analytics integration | `index.html` |
| 15 | **Google reCAPTCHA v3** | Bot protection for violation reports and OTP | `src/services/googleServices.ts` |

---

## 🛡️ Security Implementation

- **Content Security Policy (CSP)**: Strict CSP headers whitelisting only Google API domains
- **HSTS**: HTTP Strict Transport Security with `max-age=31536000`
- **Referrer-Policy**: `strict-origin-when-cross-origin` prevents information leakage
- **Permissions-Policy**: Restricts geolocation, camera, and microphone access
- **DOMPurify + Input Sanitization**: Active XSS prevention with script tag removal, event handler stripping
- **Rate Limiting**: Max 10 messages/minute to prevent API abuse
- **No personal data stored**: All user data lives in `localStorage` on the device
- **Anonymized analytics**: Firestore only logs topic categories, never personal queries
- **API key protection**: All keys via `.env.local` abstraction (`.env.example` provided)
- **Phone masking**: Displayed numbers are masked (e.g., `98****3210`)
- **Safe URL validation**: Only `http:` and `https:` protocols allowed

---

## ♿ Accessibility

- **ARIA roles**: `role="navigation"`, `role="tablist"`, `role="tab"`, `role="main"`, `role="application"`, `role="alert"`, `role="status"`
- **ARIA labels**: All interactive elements have descriptive `aria-label` attributes
- **ARIA states**: `aria-selected`, `aria-current="page"`, `aria-live="polite"` for dynamic content
- **Skip link**: "Skip to main content" for keyboard-only users
- **Focus management**: `focus-visible` ring indicators for keyboard navigation
- **Color contrast**: WCAG AA compliant text contrast ratios throughout
- **Screen reader**: Icons marked `aria-hidden="true"` with text alternatives
- **Semantic HTML**: Proper `<nav>`, `<main>`, `<button>`, `<section>` elements throughout
- **Language attribute**: Document `lang` dynamically set to match user preference (`en-IN`, `hi-IN`, `or-IN`)
- **Noscript fallback**: Displays helpline number if JavaScript is disabled

---

## 🧪 Testing

**100+ unit & integration tests** across 12 test suites using **Vitest + Testing Library**:

```bash
npm test
```

| Test Suite | Tests | Coverage Area |
|------------|-------|--------------|
| `aiService.test.ts` | 16 | AI service, language detection, context validation |
| `googleServices.test.ts` | 40+ | Google Translate, Maps, NLP, Performance, Remote Config, reCAPTCHA |
| `security.test.ts` | 28 | Input sanitization, phone validation, URL safety, rate limiting |
| `constants.test.ts` | 20 | Electoral data, language labels, state lists |
| `integration.test.ts` | 20 | Onboarding flow, chat pipeline, document validation |
| `store.test.ts` | 23 | Navigation, user state, readiness scoring |
| `hooks.test.ts` | 10 | useAnalytics, useAI integration with Firebase |
| `components.test.tsx` | 15 | ErrorBoundary, DOM structure, accessibility attrs |
| `utils.test.ts` | 27 | Crowd data, readiness calculation, input validation |
| `CommunityScreen.test.tsx` | 2 | Component render, Cloud Function fetch |
| `App.test.tsx` | 1 | Root component render |

---

## 🏗️ Technical Stack

```
Frontend:     React 19 + TypeScript + Vite 8
Styling:      Tailwind CSS + Framer Motion animations
State:        Zustand (lightweight global state with persistence)
AI:           Google Gemini 2.0 Flash + Custom offline engine
Charts:       Recharts (progress visualization)
Markdown:     react-markdown + remark-gfm (AI response formatting)
Security:     DOMPurify + CSP + HSTS + rate limiting
Testing:      Vitest 4 + Testing Library + jsdom (100+ tests)
Deployment:   Vercel (frontend) + Firebase Hosting + Docker (Cloud Run ready)
Google:       Gemini, Cloud Functions, Maps, Translate, NLP, Firebase (6 services), GA4, Fonts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
git clone https://github.com/Budhadev678/vote-mate-ai
cd vote-mate-ai
npm install
```

### Environment Variables

Create `.env.local` from the provided template:
```bash
cp .env.example .env.local
```

Required keys:
```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```

Optional keys (for full Google Services integration):
```env
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
VITE_GOOGLE_TRANSLATE_API_KEY=your_translate_key
```

See `.env.example` for the complete list of all 15 configurable keys.

### Development

```bash
npm run dev
```

### Testing

```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

### Production Build

```bash
npm run build
```

### Docker (Cloud Run)

```bash
docker build -t vote-mate-ai .
docker run -p 8080:8080 vote-mate-ai
```

---

## 📊 Assumptions Made

1. **Offline-first**: Many rural Indian voters have poor connectivity; the app works fully offline with the built-in knowledge engine
2. **Hindi/Odia priority**: Language switching is prominent in the UI as these are major voter demographics
3. **First-time voter focus**: UX is optimized for users with zero prior election knowledge
4. **ECI data**: Booth finder uses mock data — production would integrate with official ECI APIs
5. **Privacy-first**: All personal data stays on-device; no accounts or sign-ups required for core functionality
6. **Google Services**: All Google service integrations degrade gracefully — the app remains fully functional without API keys

---

## 🗂️ Project Structure

```
src/
├── __tests__/           # Vitest unit & integration tests (100+ tests)
│   ├── googleServices.test.ts  # Google Services integration tests
│   ├── security.test.ts        # Security & sanitization tests
│   ├── integration.test.ts     # End-to-end flow tests
│   └── ...
├── components/          # Reusable UI components
│   ├── BottomNav.tsx    # Accessible navigation with ARIA tabs
│   ├── ErrorBoundary.tsx# Error boundary with recovery
│   ├── InfoButton.tsx   # Contextual help system
│   └── FloatingBot.tsx  # AI assistant shortcut
├── pages/               # Screen components (20 screens)
├── services/
│   ├── aiService.ts     # Google Gemini 2.0 Flash + offline engine
│   ├── firebase.ts      # Firebase Analytics + Firestore + Cloud Functions
│   └── googleServices.ts# Google Translate, Maps, NLP, Performance, Remote Config
├── hooks/
│   ├── useAI.ts         # AI interaction hook with rate limiting
│   └── useAnalytics.ts  # Google Analytics + Firebase tracking
├── store/
│   └── useStore.ts      # Zustand state management with persistence
├── utils/
│   ├── constants.ts     # App-wide configuration constants
│   └── sanitize.ts      # Input validation & XSS prevention
├── types/               # TypeScript type definitions
└── data/                # Static electoral data (phases, glossary, flows)

functions/
└── index.js             # Google Cloud Functions for community insights
```

---

## 🌐 Live Application

**https://vote-mate-ai.vercel.app**

---

## 📄 License

MIT License — see [LICENSE](./LICENSE)

---

*Made with ❤️ for Indian voters by the VoteMate AI team*  
*Built for the Google Antigravity Solution Challenge 2026*
