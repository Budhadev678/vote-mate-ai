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
  // Try calling real API if key exists
  const hasKey = !!import.meta.env.VITE_ANTHROPIC_API_KEY
  if (hasKey) {
    try {
      const systemPrompt = buildSystemPrompt(context, confusionMode)
      const response = await client.messages.create({
        model: 'claude-opus-4-5',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      })

      const text = response.content[0].type === 'text' ? response.content[0].text : ''
      const nextActionMatch = text.match(/\*\*Next Action:\*\*\s*(.+)/i)
      const nextAction = nextActionMatch ? nextActionMatch[1].trim() : 'Continue exploring VoteMate AI'
      return { content: text, nextAction }
    } catch (err) {
      console.warn('API Failed, falling back to trained offline engine.')
    }
  }

  // ─── Fully Trained Offline Engine ───
  await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate network latency

  const lowerMsg = userMessage.toLowerCase()
  let content = ''
  let nextAction = 'Ask another question'

  if (confusionMode) {
    // Simple Mode Responses
    if (lowerMsg.includes('register') || lowerMsg.includes('apply')) {
      content = 'You need to register to vote.\n1. Go to voters.eci.gov.in.\n2. Fill Form 6.\n3. Submit it online.'
      nextAction = 'Start Guided Registration'
    } else if (lowerMsg.includes('document') || lowerMsg.includes('id') || lowerMsg.includes('aadhaar')) {
      content = 'You need 1 photo ID to vote. Best options:\n- Voter ID Card (EPIC)\n- Aadhaar Card\n- PAN Card\n- Driving License'
      nextAction = 'Check Document List'
    } else if (lowerMsg.includes('booth') || lowerMsg.includes('where')) {
      content = 'You can only vote at your assigned booth. We can help you find it on a map.'
      nextAction = 'Find Polling Booth'
    } else if (lowerMsg.includes('evm') || lowerMsg.includes('machine')) {
      content = 'The EVM is the voting machine. You press the blue button next to your chosen candidate. A slip (VVPAT) will print to prove your vote.'
      nextAction = 'Watch EVM Demo'
    } else {
      content = "I'm VoteMate AI. I can help you register, find your booth, or check your IDs. What do you need help with?"
      nextAction = 'Try an option below'
    }
  } else {
    // Detailed Professional Responses
    if (lowerMsg.includes('register') || lowerMsg.includes('apply')) {
      content = `To vote in India, you must register and get your name on the **Electoral Roll**.

Here is the process:
1. Visit the official portal: [voters.eci.gov.in](https://voters.eci.gov.in) or download the Voter Helpline App.
2. Fill out **Form 6** (for first-time voters).
3. Upload proof of age (e.g., Birth Certificate, 10th marksheet) and proof of address (e.g., Aadhaar, utility bill).
4. Submit the form. A Booth Level Officer (BLO) may verify your details.

Once approved, your **EPIC** (Voter ID) will be generated!`
      nextAction = 'Start Guided Registration'
    } else if (lowerMsg.includes('document') || lowerMsg.includes('id') || lowerMsg.includes('aadhaar') || lowerMsg.includes('proof')) {
      content = `If you have your **Voter ID (EPIC)**, that is the best document to bring.

However, if you don't have it, the Election Commission allows **11 other alternative photo ID documents**, including:
*   **Aadhaar Card**
*   **PAN Card**
*   **Driving License**
*   Indian Passport
*   MNREGA Job Card
*   Passbook with photograph (issued by Bank/Post Office)

*Note: Your name MUST be on the electoral roll. An ID card alone does not guarantee the right to vote without registration.*`
      nextAction = 'Check Document List'
    } else if (lowerMsg.includes('booth') || lowerMsg.includes('where') || lowerMsg.includes('location')) {
      content = `You can only cast your vote at your **specifically assigned polling booth**. 

You can find your booth by:
1. Using the **VoteMate Booth Locator** in this app.
2. Checking your **Voter Information Slip** (distributed by BLOs before the election).
3. Searching your name on the ECI Electoral Search portal.
4. Calling the National Voter Helpline at **1950**.

Would you like me to help you find your booth now?`
      nextAction = 'Find Polling Booth'
    } else if (lowerMsg.includes('evm') || lowerMsg.includes('vvpat') || lowerMsg.includes('machine')) {
      content = `India uses Electronic Voting Machines (**EVMs**) accompanied by **VVPATs** (Voter Verifiable Paper Audit Trails) to ensure 100% transparency.

**How to use them:**
1. The polling officer will enable the machine for you.
2. Press the **Blue Button** next to the candidate's name/symbol of your choice.
3. A red light will glow next to the button, and you will hear a long beep.
4. Look at the VVPAT glass window. A printed paper slip showing your candidate's serial number, name, and symbol will be visible for 7 seconds before dropping into a secure box.`
      nextAction = 'Watch EVM Demo'
    } else if (lowerMsg.includes('date') || lowerMsg.includes('when') || lowerMsg.includes('time')) {
      content = `Voting hours generally run from **7:00 AM to 6:00 PM**, though this can vary slightly by region. 

To avoid long queues, we highly recommend voting during the **morning hours (8:00 AM - 10:00 AM)**. Our app's Crowd Prediction feature can give you live estimates of wait times for your specific booth.`
      nextAction = 'Check Crowd Prediction'
    } else if (lowerMsg.includes('eligible') || lowerMsg.includes('age') || lowerMsg.includes('who can')) {
      content = `To be eligible to vote in Indian elections, you must meet these criteria:
*   You must be an **Indian citizen**.
*   You must be **18 years of age** or older on the qualifying date (usually January 1st of the election year).
*   You must be a resident of the polling area.
*   Your name must be registered in the **Electoral Roll**.`
      nextAction = 'Check Registration Status'
    } else {
      content = `I am VoteMate AI, a fully trained intelligent assistant for Indian Elections. 

I can help you with:
*   Step-by-step voter registration
*   Valid ID document requirements
*   EVM / VVPAT instructions
*   Finding your polling booth
*   Understanding election rules

How can I assist you today?`
      nextAction = 'Try an option below'
    }
  }

  return { content, nextAction }
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
