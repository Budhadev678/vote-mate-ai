import Anthropic from '@anthropic-ai/sdk'
import type { AppContext, Language, NewsVerdict } from '../types'

// ─── Client (uses env var via Vite) ──────────────────────────────
const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY ?? '',
  dangerouslyAllowBrowser: true,
})

// ─── Build system prompt ──────────────────────────────────────────
function buildSystemPrompt(ctx: AppContext, confusionMode: boolean): string {
  const lang = ctx.language === 'hi' ? 'Hindi' : 'English'
  const voter = ctx.userType === 'first-time' ? 'first-time voter' : 'experienced voter'
  const urgency = ctx.isVotingDay
    ? 'TODAY IS VOTING DAY. Make every response about going to vote now.'
    : ctx.daysToVoting <= 2
      ? `URGENT: Only ${ctx.daysToVoting} day(s) until voting.`
      : ''

  const simplify = confusionMode
    ? 'The user is confused. Use VERY simple language. Max 3 short sentences. No jargon.'
    : ''

  return `You are VoteMate AI — a friendly, knowledgeable Indian election assistant.
${urgency}
${simplify}

User context:
- Voter type: ${voter}
- State: ${ctx.state || 'India (general)'}
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

// ─── Main chat function ────────────────────────────────────────────
export async function askAI(
  userMessage: string,
  context: AppContext,
  confusionMode = false,
): Promise<{ content: string; nextAction: string }> {
  const systemPrompt = buildSystemPrompt(context, confusionMode)

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    // Extract "Next Action:" from response
    const nextActionMatch = text.match(/\*\*Next Action:\*\*\s*(.+)/i)
    const nextAction = nextActionMatch
      ? nextActionMatch[1].trim()
      : 'Continue exploring VoteMate AI'

    // Clean content (remove the Next Action line from display if desired)
    const content = text

    return { content, nextAction }
  } catch (err) {
    console.error('AI error:', err)
    throw new Error('AI_ERROR')
  }
}

// ─── News verification ─────────────────────────────────────────────
export async function verifyNews(
  text: string,
  language: Language,
): Promise<{ verdict: NewsVerdict; reasons: string[]; suggestion: string; confidence: number }> {
  const lang = language === 'hi' ? 'Hindi' : 'English'

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

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Parse error')

    return JSON.parse(jsonMatch[0])
  } catch {
    return {
      verdict: 'uncertain',
      confidence: 0,
      reasons: ['Unable to analyze at this time'],
      suggestion: 'Please verify with official sources like eci.gov.in',
    }
  }
}

// ─── AI Onboarding greeting ────────────────────────────────────────
export function getGreetingMessage(language: Language): string {
  if (language === 'hi') {
    return 'नमस्ते! 👋 मैं VoteMate AI हूँ — आपका व्यक्तिगत चुनाव साथी। मैं आपको वोट देने की पूरी प्रक्रिया में मार्गदर्शन करूँगा।'
  }
  return "Hi there! 👋 I'm VoteMate AI — your personal election companion. I'll guide you step by step through everything you need to know to vote confidently."
}

// ─── Fallback response ─────────────────────────────────────────────
export function getFallbackResponse(language: Language): string {
  if (language === 'hi') {
    return 'माफ़ करें, मैं अभी जानकारी प्राप्त नहीं कर सका। कृपया दोबारा पूछें या अलग तरीके से पूछें।\n\n**Next Action:** पुनः प्रयास करें या सहायता के लिए 1950 पर कॉल करें।'
  }
  return "Oops, I couldn't fetch that info right now. Please try again or rephrase your question.\n\n**Next Action:** Try again or call the helpline at 1950."
}
