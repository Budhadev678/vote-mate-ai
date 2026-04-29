# 🗳️ VoteMate AI — Your Personal Election Companion

> **AI-powered election guidance for every Indian voter.**  
> Powered by Google Gemini · Firebase · Google Analytics · Google Fonts

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vote--mate--ai.vercel.app-blue?style=for-the-badge)](https://vote-mate-ai.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Budhadev678%2Fvote--mate--ai-black?style=for-the-badge&logo=github)](https://github.com/Budhadev678/vote-mate-ai)
[![Tests](https://img.shields.io/badge/Tests-66%20Passing-brightgreen?style=for-the-badge)](./src/__tests__)
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
├── AI Chat Engine          # Gemini API (primary) + Offline Engine (fallback)
├── Guided Journey          # Step-by-step voter readiness checklist
├── Polling Booth Finder    # Location-based booth search
├── News Verifier           # Fake election news detection
├── Crowd Predictor         # Optimal voting time recommendations
├── Community Insights      # Anonymized regional readiness data
└── Profile & Progress      # Personal readiness score tracking
```

### How the AI Works

1. **Primary**: Google Gemini API processes natural language queries with full context awareness (voter type, state, language, readiness score)
2. **Fallback**: A fully trained offline engine handles 10+ common query categories without internet
3. **Context-Aware**: Every response is personalized based on voter profile, current step, and proximity to election day
4. **Multilingual**: Supports English, Hindi (हिंदी), and Odia (ଓଡ଼ିଆ)

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
| **AI Chat** | Natural language Q&A powered by Gemini |
| **Guided Mode** | Step-by-step journey through all 4 milestones |
| **Quick Mode** | 1-minute election readiness guide |
| **Polling Booth** | Find assigned booth with crowd prediction |
| **News Verifier** | Fact-check election news with AI |
| **Document Checker** | Verify which IDs are valid on polling day |
| **Candidates** | Know your candidates before voting |
| **Report Violation** | Report election code violations |
| **Insights** | Detailed readiness analytics and progress chart |
| **Profile** | Manage preferences, language, region |
| **Accessibility** | Special assistance options for differently-abled voters |

---

## ⚡ Google Services Integration

| Service | Usage |
|---------|-------|
| **Google Gemini API** | Primary AI engine for all chat responses and news verification |
| **Google Cloud Functions** | Secure backend processing for regional community insights (`functions/index.js`) |
| **Google Maps Embed API** | Interactive embedded iFrames for assigned Polling Booth navigation |
| **Google Firebase (Firestore)** | Anonymized chat analytics and booth search logging |
| **Google Firebase Hosting** | Production CDN and caching (`firebase.json`) |
| **Google Firebase Analytics** | Screen view tracking and user engagement events |
| **Google Fonts** | Inter + Poppins typography (loaded via fonts.googleapis.com) |
| **Google Analytics 4** | gtag.js integration for page-level analytics |

---

## 🛡️ Security Implementation

- **DOMPurify + CSP**: Active XSS prevention via strict Content-Security-Policy headers and DOMPurify LLM sanitization.
- **No personal data stored**: All user data lives in `localStorage` on the device
- **Anonymized analytics**: Firestore only logs topic categories, never personal queries
- **API key protection**: All keys via `.env.local` abstraction (`.env.example` provided), never hardcoded
- **Input sanitization**: All user inputs trimmed and length-limited before processing
- **HTTPS-only**: Hosted on Vercel with automatic SSL/TLS

---

## ♿ Accessibility

- **ARIA roles**: `role="navigation"`, `role="tablist"`, `role="tab"`, `role="main"`, `role="application"`
- **ARIA labels**: All interactive elements have descriptive `aria-label` attributes
- **ARIA states**: `aria-selected`, `aria-current="page"`, `aria-live="polite"` for dynamic content
- **Skip link**: "Skip to main content" for keyboard-only users
- **Focus management**: `focus-visible` ring indicators for keyboard navigation
- **Color contrast**: WCAG AA compliant text contrast ratios
- **Screen reader**: Icons marked `aria-hidden="true"` with text alternatives
- **Semantic HTML**: Proper `<nav>`, `<main>`, `<button>`, `<section>` elements throughout

---

## 🧪 Testing

**66 unit tests** across 3 test suites using **Vitest + Testing Library**:

```bash
npm test
```

| Test Suite | Tests | Coverage Area |
|------------|-------|--------------|
| `aiService.test.ts` | 16 | AI service functions, language detection, context validation |
| `utils.test.ts` | 27 | States list, crowd data, readiness scoring, input sanitization |
| `store.test.ts` | 23 | User state management, navigation history, chat messages |

---

## 🏗️ Technical Stack

```
Frontend:     React 19 + TypeScript + Vite 8
Styling:      Tailwind CSS + Framer Motion animations
State:        Zustand (lightweight global state)
AI:           Anthropic/Google Gemini API + Custom offline engine
Charts:       Recharts (progress visualization)
Markdown:     react-markdown + remark-gfm (AI response formatting)
Testing:      Vitest + Testing Library + jsdom
Deployment:   Vercel (frontend) + Docker (Cloud Run ready)
Google:       Firebase SDK, Google Analytics 4, Google Fonts
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

Create `.env.local`:
```env
VITE_ANTHROPIC_API_KEY=your_key_here
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

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

---

## 🗂️ Project Structure

```
src/
├── __tests__/           # Vitest unit tests (66 tests)
├── components/          # Reusable UI components
│   ├── BottomNav.tsx    # Accessible navigation
│   ├── InfoButton.tsx   # Contextual help system
│   ├── FloatingBot.tsx  # AI assistant shortcut
│   └── ...
├── pages/               # Screen components (18 screens)
├── services/
│   ├── aiService.ts     # Gemini AI + offline engine
│   └── firebase.ts      # Firebase/Google services
├── store/
│   └── useStore.ts      # Zustand state management
└── types/               # TypeScript type definitions
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
