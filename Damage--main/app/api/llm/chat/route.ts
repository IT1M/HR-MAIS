import { type NextRequest, NextResponse } from "next/server"

// API Configuration
const GROQ_API_KEY = "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"
const GROQ_MODEL = "llama-3.1-70b-versatile" // Using a stable model
const GEMINI_API_KEY = "AIzaSyCV3Kb2rHMQoyAiYkrAFA82UlcGbYAAC0M"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"

interface ChatMessage {
  role: string
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  provider?: "auto" | "gemini" | "groq"
}

async function callGroqAPI(messages: ChatMessage[], systemPrompt: string, temperature: number, maxTokens: number) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature,
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function callGeminiAPI(messages: ChatMessage[], systemPrompt: string, temperature: number) {
  const prompt = `${systemPrompt}\n\n${messages.map((m) => `${m.role}: ${m.content}`).join("\n")}`

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: 2000,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const {
      messages,
      systemPrompt = "You are a helpful AI assistant.",
      temperature = 0.7,
      maxTokens = 2000,
      provider = "auto",
    } = body

    console.log("[v0] Chat API called with provider:", provider)

    let response: string

    // Provider selection logic
    if (provider === "groq") {
      response = await callGroqAPI(messages, systemPrompt, temperature, maxTokens)
    } else if (provider === "gemini") {
      response = await callGeminiAPI(messages, systemPrompt, temperature)
    } else {
      // Auto selection - try Groq first, fallback to Gemini
      try {
        response = await callGroqAPI(messages, systemPrompt, temperature, maxTokens)
      } catch (error) {
        console.log("[v0] Groq failed, falling back to Gemini:", error)
        response = await callGeminiAPI(messages, systemPrompt, temperature)
      }
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
