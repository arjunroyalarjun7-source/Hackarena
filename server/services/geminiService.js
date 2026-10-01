import { GoogleGenAI } from '@google/genai';
import { SchemeService } from './schemeService.js';

/**
 * Gemini Service for Sakhi AI
 * Communicates with the official @google/genai SDK
 * Uses process.env.GEMINI_API_KEY securely on the server
 */

const SYSTEM_INSTRUCTIONS = `
You are Sakhi AI, a warm, supportive, and extremely clear voice-first AI guide for first-time women citizens accessing essential public services in India.

CRITICAL RULES:
1. Ask only ONE question at a time.
2. Use extremely simple, respectful, and compassionate language. Avoid jargon.
3. STRICTLY respect the user's selected language:
   - English (en-IN): Simple everyday Indian English.
   - Tamil (ta-IN): Natural, spoken Tamil (தமிழ்).
   - Telugu (te-IN): Natural, spoken Telugu (తెలుగు).
4. If the user says "I don't know" or seems confused:
   - Do NOT mark them ineligible.
   - Patiently and kindly explain what the question means in simple terms.
   - Tell them how they can check or find that information (e.g. looking at Aadhaar or bank passbook).
   - Then gently re-offer the simple options.
5. NEVER invent government rules or schemes.
6. NEVER invent eligibility criteria or documents.
7. Use ONLY the supplied demo service dataset.
8. NEVER claim: "Government approved you" or "You are officially eligible."
   Instead, when eligibility criteria are met, say:
   "Based on the information provided, you may meet the listed criteria. Please verify with the official service."
9. NEVER request OTP, PIN, password, UPI PIN, bank password, or authentication credentials.
10. Do not ask unnecessary sensitive personal information.
11. Explain difficult government terminology in plain everyday words.
12. Give clear next actions at every step.

OUTPUT FORMAT:
You MUST respond with valid JSON strictly matching one of these two structures without any markdown formatting or extra text.

IF JOURNEY IS IN PROGRESS:
{
  "intent": "eligibility",
  "reply": "Warm conversational acknowledgment of the user's answer and gentle transition.",
  "nextQuestion": "The next single simple question to ask the user.",
  "progress": {
    "current": 1,
    "total": 5
  },
  "options": [
    "Yes",
    "No",
    "I don't know"
  ],
  "nextAction": "continue",
  "journeyComplete": false
}

IF ALL ELIGIBILITY QUESTIONS ARE ANSWERED (JOURNEY COMPLETE):
{
  "intent": "result",
  "reply": "Based on the information provided, you may meet the listed criteria. Please verify with the official service.",
  "nextQuestion": null,
  "progress": {
    "current": 5,
    "total": 5
  },
  "options": [],
  "nextAction": "view_result",
  "journeyComplete": true,
  "documents": [
    {
      "id": "aadhaar",
      "title": "Aadhaar Card",
      "description": "Proof of identity and address"
    },
    {
      "id": "bank_passbook",
      "title": "Bank Account Passbook",
      "description": "Active bank account linked with Aadhaar"
    },
    {
      "id": "income_proof",
      "title": "Income Certificate or SHG Member Card",
      "description": "Family income document or Self-Help Group member card"
    },
    {
      "id": "photo",
      "title": "Passport Size Photographs",
      "description": "2 recent photographs"
    }
  ],
  "journeyCard": {
    "title": "Your Sakhi Journey",
    "status": "Based on your answers, you may meet the listed criteria",
    "steps": [
      {
        "step": "01",
        "title": "Prepare Documents",
        "description": "Gather Aadhaar, bank passbook, and photos"
      },
      {
        "step": "02",
        "title": "Open Official Service",
        "description": "Visit the official government portal or local service center"
      },
      {
        "step": "03",
        "title": "Complete Application",
        "description": "Submit details without any agent fees"
      },
      {
        "step": "04",
        "title": "Keep Acknowledgement",
        "description": "Save your reference number for verification"
      }
    ]
  },
  "source": {
    "name": "Demo Government Service",
    "url": "https://example.gov.in"
  }
}
`;

// Preferred Gemini models with fallback cascade
const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash'
];

/**
 * Validates whether Gemini API key is configured
 */
export function isGeminiConfigured() {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim() !== '' && !key.includes('PASTE_YOUR'));
}

/**
 * Deterministic fallback generator for when Gemini API hits 429 quota or 503 high-demand
 */
function createDeterministicSakhiResponse({ userMessage, language, currentStep, totalSteps, scheme }) {
  const langKey = language?.startsWith('ta') ? 'ta' : language?.startsWith('te') ? 'te' : 'en';
  const lowerMsg = (userMessage || '').toLowerCase();
  const isDontKnow = lowerMsg.includes("don't know") || lowerMsg.includes('not sure') || lowerMsg.includes('தெரியாது') || lowerMsg.includes('తెలియదు');

  // If user says "I don't know", explain the current question simply without penalizing
  if (isDontKnow) {
    const currentQ = SchemeService.getQuestion(currentStep, language);
    let reply = "Do not worry at all! Let me explain this in simple words.";
    if (langKey === 'ta') reply = "கவலைப்பட வேண்டாம்! இதை எளிய சொற்களில் விளக்குகிறேன்.";
    if (langKey === 'te') reply = "చింతించకండి! దీన్ని నేను సులభమైన మాటల్లో వివరిస్తాను.";

    return {
      intent: "clarification",
      reply: `${reply} ${currentQ?.simpleExplanation || ''}`,
      nextQuestion: currentQ?.question || '',
      progress: { current: currentStep, total: totalSteps },
      options: currentQ?.options || ["Yes", "No", "I don't know"],
      nextAction: "continue",
      journeyComplete: false
    };
  }

  // If this was the last question, complete the journey!
  if (currentStep >= totalSteps) {
    let completionReply = "Based on the information provided, you may meet the listed criteria. Please verify with the official service.";
    if (langKey === 'ta') completionReply = "வழங்கப்பட்ட தகவலின் அடிப்படையில், நீங்கள் குறிப்பிட்ட அளவுகோல்களை பூர்த்தி செய்ய வாய்ப்புள்ளது. அதிகாரப்பூர்வ சேவையில் சரிபார்க்கவும்.";
    if (langKey === 'te') completionReply = "అందించిన సమాచారం ఆధారంగా, మీరు పేర్కొన్న ప్రమాణాలకు తగిన అర్హత కలిగి ఉండవచ్చు. దయచేసి అధికారిక సేవతో ధృవీకరించండి.";

    return {
      intent: "result",
      reply: completionReply,
      nextQuestion: null,
      progress: { current: totalSteps, total: totalSteps },
      options: [],
      nextAction: "view_result",
      journeyComplete: true,
      documents: SchemeService.getDocuments(),
      journeyCard: {
        title: "Your Sakhi Journey",
        status: "Based on your answers, you may meet the listed criteria",
        steps: SchemeService.getApplicationSteps()
      },
      source: {
        name: scheme.source || "Demo Government Service",
        url: scheme.officialUrl || "https://example.gov.in"
      }
    };
  }

  // Advance to next question
  const nextStep = currentStep + 1;
  const nextQ = SchemeService.getQuestion(nextStep, language);

  let warmReply = "Thank you for sharing that with me. Here is the next simple question:";
  if (langKey === 'ta') warmReply = "பதிலுக்கு நன்றி. அடுத்த எளிய கேள்வி இதோ:";
  if (langKey === 'te') warmReply = "మీ సమాధానానికి ధన్యవాదాలు. తదుపరి సాధారణ ప్రశ్న ఇదిగో:";

  return {
    intent: "eligibility",
    reply: warmReply,
    nextQuestion: nextQ?.question || '',
    progress: { current: nextStep, total: totalSteps },
    options: nextQ?.options || ["Yes", "No", "I don't know"],
    nextAction: "continue",
    journeyComplete: false
  };
}

/**
 * Calls Gemini API to generate structured Sakhi response
 */
export async function generateSakhiResponse({
  userMessage,
  language = 'en-IN',
  history = [],
  scheme,
  journeyState
}) {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini API key is not configured. Add GEMINI_API_KEY to server/.env.');
  }

  const currentStep = journeyState.currentStep || 1;
  const totalSteps = journeyState.totalSteps || SchemeService.getTotalSteps() || 5;
  const currentEligibilityStep = scheme.eligibilitySteps?.find(s => s.step === currentStep);
  const langCode = language.startsWith('ta') ? 'ta' : language.startsWith('te') ? 'te' : 'en';

  const contextPrompt = `
SERVICE CONTEXT:
Service Name: ${scheme.name} (${scheme.badge})
Official URL: ${scheme.officialUrl}
Source: ${scheme.source}
Last Verified: ${scheme.lastVerified}
Disclaimer: ${scheme.disclaimer}

CURRENT STATE:
User Language: ${language} (${langCode === 'ta' ? 'Tamil' : langCode === 'te' ? 'Telugu' : 'English'})
Current Step: ${currentStep} of ${totalSteps}
Target Question for this step: "${currentEligibilityStep?.question?.[langCode] || currentEligibilityStep?.question?.en || 'Final assessment'}"
Simple explanation: "${currentEligibilityStep?.simpleExplanation?.[langCode] || currentEligibilityStep?.simpleExplanation?.en || ''}"
Options for this step: ${JSON.stringify(currentEligibilityStep?.options?.[langCode] || currentEligibilityStep?.options?.en || [])}

CONVERSATION HISTORY:
${history.map(h => `${h.role.toUpperCase()}: ${h.text}`).join('\n') || 'No previous history.'}

USER JUST SAID:
"${userMessage}"

INSTRUCTIONS FOR THIS TURN:
- If current step is ${totalSteps} and user is answering the final question, set journeyComplete: true, intent: "result", nextAction: "view_result", and include documents, journeyCard, and source.
- If user asked "I don't know" or for clarification, remain on step ${currentStep}, explain the concept simply in ${language}, and re-ask the question.
- Otherwise advance progress to current: ${Math.min(currentStep + 1, totalSteps)}.
- Provide structured JSON response only.
`;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  let lastError = null;

  // Try candidate models
  for (const modelName of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: contextPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTIONS,
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const responseText = response.text?.trim() || '';
      const cleaned = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (err) {
      lastError = err;
      const errMsg = err.message || '';

      // If key is invalid, fail immediately
      if (errMsg.includes('401') || errMsg.includes('UNAUTHENTICATED') || errMsg.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED')) {
        throw new Error('Invalid Gemini API key. Ensure your key starts with AIzaSy... from Google AI Studio.');
      }

      console.warn(`Gemini model ${modelName} returned: ${errMsg.slice(0, 60)}`);
    }
  }

  // If Google Gemini servers are temporarily overloaded (503 / 429), use verified scheme fallback
  console.warn('Google Gemini free-tier rate limit/busy notice; using verified scheme fallback.');
  return createDeterministicSakhiResponse({
    userMessage,
    language,
    currentStep,
    totalSteps,
    scheme
  });
}
