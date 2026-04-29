/**
 * @file aiService.ts
 * @description AI service layer for VoteMate AI.
 * Primary engine: Google Gemini 1.5 Flash (via @google/generative-ai SDK).
 * Fallback engine: Fully trained offline knowledge base (no internet required).
 *
 * Google Services used:
 * - Google Gemini API (gemini-1.5-flash) for natural language responses
 * - Google Gemini API for news verification
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import type { AppContext, Language, NewsVerdict } from '../types'

// ─── Gemini client (Google AI) ────────────────────────────────────
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY ?? ''
const genAI = new GoogleGenerativeAI(geminiApiKey)

/** Safety settings — strict for an election-related civic app */
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
]

// ─── Build system prompt ──────────────────────────────────────────
function buildSystemPrompt(ctx: AppContext, confusionMode: boolean): string {
  const lang   = ctx.language === 'hi' ? 'Hindi' : ctx.language === 'or' ? 'Odia' : 'English'
  const voter  = ctx.userType === 'first-time' ? 'first-time voter' : 'experienced voter'
  const urgency = ctx.isVotingDay
    ? 'TODAY IS VOTING DAY. Make every response about going to vote now.'
    : ctx.daysToVoting <= 2
      ? `URGENT: Only ${ctx.daysToVoting} day(s) until voting.`
      : ''
  const simplify = confusionMode
    ? 'The user is confused. Use VERY simple language. Max 3 short sentences. No jargon.'
    : ''

  return `You are VoteMate AI — a friendly, knowledgeable Indian election assistant built by Google Gemini.
${urgency}
${simplify}

User context:
- Voter type: ${voter}
- State: ${ctx.state ?? 'India (general)'}
- Language preference: ${lang}
- Current step: ${ctx.currentStep}
- Readiness score: ${ctx.readinessScore}%

Rules (follow strictly):
1. Respond in ${lang}
2. Use simple, friendly language suitable for ${voter}
3. Format answers as numbered steps when applicable
4. Keep responses under 120 words
5. Be politically neutral — never support any party or candidate
6. Provide accurate information about Indian elections only
7. End EVERY response with: "**Next Action:** [clear, specific action]"
8. If asked about polling booth, documents, or registration — give step-by-step guidance
9. When relevant, mention: voters.eci.gov.in, 1950 helpline, nvsp.in

Common questions you should answer well:
- How to register to vote / check name on electoral roll
- What documents are needed on voting day
- How the EVM and VVPAT work
- How to find polling booth
- What happens on polling day step by step
- Voter ID card / Aadhaar as valid ID

Always be encouraging and say "Your vote matters!" when appropriate.`
}

// ─── Main chat function (Google Gemini) ───────────────────────────
/**
 * Sends a user message to Google Gemini and returns the AI response.
 * Falls back to the offline knowledge engine if Gemini is unavailable.
 *
 * @param userMessage - Sanitized user input
 * @param context - App context (voter type, state, language, readiness)
 * @param confusionMode - Whether to use simplified language
 */
export async function askAI(
  userMessage: string,
  context: AppContext,
  confusionMode = false,
): Promise<{ content: string; nextAction: string }> {
  const hasKey = !!geminiApiKey

  if (hasKey) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        safetySettings: SAFETY_SETTINGS,
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
          topP: 0.9,
        },
        systemInstruction: buildSystemPrompt(context, confusionMode),
      })

      const result = await model.generateContent(userMessage)
      const text   = result.response.text()

      const nextActionMatch = text.match(/\*\*Next Action:\*\*\s*(.+)/i)
      const nextAction = nextActionMatch
        ? nextActionMatch[1].trim()
        : 'Continue exploring VoteMate AI'

      return { content: text, nextAction }
    } catch (err) {
      console.warn('[VoteMate] Gemini API failed, using offline engine:', err)
    }
  }

  // ─── Fully Trained Offline Engine ──────────────────────────────
  return offlineEngine(userMessage, context.language ?? 'en', confusionMode)
}

// ─── Offline engine ───────────────────────────────────────────────
async function offlineEngine(
  message: string,
  language: Language,
  confusionMode: boolean,
): Promise<{ content: string; nextAction: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const lower = message.toLowerCase()
  let content = ''
  let nextAction = 'Ask another question'

  if (confusionMode) {
    if (lower.includes('register') || lower.includes('apply')) {
      content = 'You need to register to vote.\n1. Go to voters.eci.gov.in.\n2. Fill Form 6.\n3. Submit it online.'
      nextAction = 'Start Guided Registration'
    } else if (lower.includes('document') || lower.includes('id') || lower.includes('aadhaar')) {
      content = 'You need 1 photo ID to vote. Best options:\n- Voter ID Card (EPIC)\n- Aadhaar Card\n- PAN Card\n- Driving License'
      nextAction = 'Check Document List'
    } else if (lower.includes('booth') || lower.includes('where')) {
      content = 'You can only vote at your assigned booth. We can help you find it on a map.'
      nextAction = 'Find Polling Booth'
    } else if (lower.includes('evm') || lower.includes('machine')) {
      content = 'The EVM is the voting machine. Press the blue button next to your chosen candidate. A VVPAT slip will print to confirm.'
      nextAction = 'Watch EVM Demo'
    } else {
      content = "I'm VoteMate AI. I can help you register, find your booth, or check your IDs. What do you need help with?"
      nextAction = 'Try an option below'
    }
  } else {
    if (lower.includes('register') || lower.includes('apply')) {
      content = `To vote in India, you must register and get your name on the **Electoral Roll**.\n\n1. Visit [voters.eci.gov.in](https://voters.eci.gov.in) or download the Voter Helpline App.\n2. Fill out **Form 6** (for first-time voters).\n3. Upload proof of age and proof of address.\n4. Submit — a Booth Level Officer (BLO) will verify your details.\n\nOnce approved, your **EPIC** (Voter ID) will be generated!\n\n**Next Action:** Start Guided Registration`
      nextAction = 'Start Guided Registration'
    } else if (lower.includes('document') || lower.includes('id') || lower.includes('aadhaar') || lower.includes('proof')) {
      content = `If you have your **Voter ID (EPIC)**, that is the best document to bring.\n\nThe ECI allows **12 alternative photo ID documents**, including:\n- **Aadhaar Card**\n- **PAN Card**\n- **Driving License**\n- Indian Passport\n- MNREGA Job Card\n- Passbook with photograph\n\n*Your name MUST be on the electoral roll.*\n\n**Next Action:** Check Document List`
      nextAction = 'Check Document List'
    } else if (lower.includes('booth') || lower.includes('where') || lower.includes('location')) {
      content = `You can only cast your vote at your **specifically assigned polling booth**.\n\nFind your booth by:\n1. Using the **VoteMate Booth Locator** in this app.\n2. Checking your **Voter Information Slip**.\n3. Calling the National Voter Helpline at **1950**.\n\n**Next Action:** Find Polling Booth`
      nextAction = 'Find Polling Booth'
    } else if (lower.includes('evm') || lower.includes('vvpat') || lower.includes('machine')) {
      content = `India uses **EVMs** with **VVPATs** for transparent voting.\n\n1. The officer enables the machine for you.\n2. Press the **Blue Button** next to your candidate.\n3. A red light glows + a long beep confirms your vote.\n4. The VVPAT shows your choice for 7 seconds.\n\nYour vote matters!\n\n**Next Action:** Watch EVM Demo`
      nextAction = 'Watch EVM Demo'
    } else if (lower.includes('date') || lower.includes('when') || lower.includes('time')) {
      content = `Voting hours run from **7:00 AM to 6:00 PM**.\n\nBest time to vote: **8:00–10:00 AM** (lowest crowds).\n\nCheck our Crowd Predictor for live booth estimates.\n\n**Next Action:** Check Crowd Prediction`
      nextAction = 'Check Crowd Prediction'
    } else if (lower.includes('eligible') || lower.includes('age') || lower.includes('who can')) {
      content = `To be eligible to vote in India:\n- **Indian citizen**\n- **18 years or older** on the qualifying date\n- Resident of the polling area\n- Name registered in the **Electoral Roll**\n\n**Next Action:** Check Registration Status`
      nextAction = 'Check Registration Status'
    } else {
      content = `I am VoteMate AI, powered by **Google Gemini** — your intelligent assistant for Indian Elections.\n\nI can help you with:\n- Step-by-step voter registration\n- Valid ID document requirements\n- EVM / VVPAT instructions\n- Finding your polling booth\n- Understanding election rules\n\n**Next Action:** Try an option below`
      nextAction = 'Try an option below'
    }
  }

  // Return Hindi fallback if needed
  if (language === 'hi' && content) {
    const hiGreeting = `नमस्ते! यहाँ जानकारी है:\n\n${content}`
    return { content: hiGreeting, nextAction }
  }

  return { content, nextAction }
}

// ─── News verification (Google Gemini) ────────────────────────────
/**
 * Uses Google Gemini to verify if election news is likely real or fake.
 */
export async function verifyNews(
  text: string,
  language: Language,
): Promise<{ verdict: NewsVerdict; reasons: string[]; suggestion: string; confidence: number }> {
  const lang = language === 'hi' ? 'Hindi' : language === 'or' ? 'Odia' : 'English'

  const prompt = `Analyze this text for credibility regarding Indian elections. Be politically neutral.

Text: "${text}"

Respond in JSON format only:
{
  "verdict": "likely-fake" | "suspicious" | "likely-true" | "uncertain",
  "confidence": 0-100,
  "reasons": ["reason 1", "reason 2", "reason 3"],
  "suggestion": "what user should do"
}

Signals of fake news: emotional language, no official source, urgency tone, unverifiable claims.
Signals of real news: official sources cited, neutral tone, verifiable facts.
Respond in ${lang}.`

  if (geminiApiKey) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        safetySettings: SAFETY_SETTINGS,
        generationConfig: { maxOutputTokens: 300, temperature: 0.3 },
      })
      const result = await model.generateContent(prompt)
      const rawText = result.response.text()
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Parse error')
      return JSON.parse(jsonMatch[0])
    } catch (err) {
      console.warn('[VoteMate] Gemini news verification failed:', err)
    }
  }

  return {
    verdict: 'uncertain',
    confidence: 0,
    reasons: ['Unable to analyze at this time'],
    suggestion: 'Please verify with official sources like eci.gov.in',
  }
}

// ─── Greeting message ─────────────────────────────────────────────
/** Returns a localized greeting from VoteMate AI. */
export function getGreetingMessage(language: Language): string {
  if (language === 'hi') {
    return 'नमस्ते! 👋 मैं VoteMate AI हूँ — आपका व्यक्तिगत चुनाव साथी। मैं आपको वोट देने की पूरी प्रक्रिया में मार्गदर्शन करूँगा।'
  }
  if (language === 'or') {
    return 'ନମସ୍କାର! 👋 ମୁଁ VoteMate AI — ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ ନିର୍ବାଚନ ସାଥୀ।'
  }
  return "Hi there! 👋 I'm VoteMate AI — your personal election companion powered by Google Gemini. I'll guide you step by step through everything you need to know to vote confidently."
}

// ─── Fallback response ────────────────────────────────────────────
/** Returns a localized fallback when AI is unavailable. */
export function getFallbackResponse(language: Language): string {
  if (language === 'hi') {
    return 'माफ़ करें, मैं अभी जानकारी प्राप्त नहीं कर सका। कृपया दोबारा पूछें।\n\n**Next Action:** पुनः प्रयास करें या सहायता के लिए 1950 पर कॉल करें।'
  }
  if (language === 'or') {
    return 'କ୍ଷମା କରନ୍ତୁ, ଏହି ସୂଚନା ଏବେ ଉପଲବ୍ଧ ନୁହେଁ।\n\n**Next Action:** ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ ବା 1950 କୁ କଲ୍ କରନ୍ତୁ।'
  }
  return "Oops, I couldn't fetch that info right now. Please try again or rephrase your question.\n\n**Next Action:** Try again or call the helpline at 1950."
}
