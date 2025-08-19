import { type NextRequest, NextResponse } from "next/server"

// API Configuration
const GROQ_API_KEY = "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"
const GROQ_MODEL = "llama-3.1-70b-versatile"
const GEMINI_API_KEY = "AIzaSyCV3Kb2rHMQoyAiYkrAFA82UlcGbYAAC0M"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"

interface SlidesRequest {
  topic: string
  language: string
  requirements?: string
  provider?: "auto" | "gemini" | "groq"
}

async function generateSlidesWithGroq(topic: string, language: string, requirements: string) {
  const systemPrompt = `You are an expert presentation designer following a comprehensive presentation builder guide. Create a professional presentation structure in JSON format.

Language: ${language === "ar" ? "Arabic (RTL)" : "English (LTR)"}

Follow this structured approach:
1. Core Presentation Info: Define clear title, objective, target audience, key message
2. Slide Content Structure: Detailed slides with content and visual descriptions
3. Design & Branding: Professional theme with appropriate colors and fonts
4. Technical Requirements: Optimized for digital presentation
5. Additional Assets: Include chart descriptions, image needs, speaker notes

Return ONLY valid JSON in this exact format:
{
  "coreInfo": {
    "title": "Presentation Title",
    "objective": "inform/persuade/train",
    "targetAudience": "specific audience description",
    "keyMessage": "main conclusion/takeaway"
  },
  "language": "${language}",
  "theme": {
    "preset": "modern_corporate/minimalist/creative",
    "primary": "#color",
    "accent": "#color",
    "background": "#color",
    "font": "${language === "ar" ? "Cairo" : "Inter"}",
    "direction": "${language === "ar" ? "rtl" : "ltr"}"
  },
  "slides": [
    {
      "type": "title",
      "title": "Main Title",
      "subtitle": "Compelling subtitle",
      "visuals": "description of title slide visual",
      "speakerNotes": "opening remarks"
    },
    {
      "type": "content",
      "title": "Section Title",
      "bullets": ["Detailed point 1", "Detailed point 2", "Detailed point 3"],
      "visuals": "chart/image/diagram description",
      "speakerNotes": "key talking points"
    },
    {
      "type": "data",
      "title": "Data Insights",
      "chartType": "bar/line/pie",
      "dataDescription": "what the chart shows",
      "keyInsights": ["insight 1", "insight 2"],
      "visuals": "chart visualization description",
      "speakerNotes": "data interpretation notes"
    }
  ],
  "designElements": {
    "animations": "subtle_transitions/none",
    "slideRatio": "16:9",
    "logoPlacement": "top-right"
  },
  "executiveSummary": "brief presentation overview"
}`

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Create a comprehensive presentation about: ${topic}. 
          Requirements: ${requirements}
          
          Generate 5-8 slides with:
          - Clear objective and target audience
          - Detailed content with visual descriptions
          - Professional design recommendations
          - Speaker notes for each slide
          - Data visualizations where appropriate
          
          Make it engaging and professional.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    }),
  })

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  try {
    return JSON.parse(content)
  } catch (error) {
    return {
      coreInfo: {
        title: topic,
        objective: "inform",
        targetAudience: language === "ar" ? "الجمهور المستهدف" : "Target audience",
        keyMessage: language === "ar" ? "الرسالة الرئيسية" : "Key message",
      },
      language,
      theme: {
        preset: "modern_corporate",
        primary: "#2563eb",
        accent: "#0ea5e9",
        background: "#ffffff",
        font: language === "ar" ? "Cairo" : "Inter",
        direction: language === "ar" ? "rtl" : "ltr",
      },
      slides: [
        {
          type: "title",
          title: topic,
          subtitle: language === "ar" ? "عرض تقديمي شامل" : "Comprehensive Presentation",
          visuals: language === "ar" ? "خلفية احترافية مع الشعار" : "Professional background with logo",
          speakerNotes: language === "ar" ? "مقدمة ترحيبية" : "Welcome introduction",
        },
        {
          type: "content",
          title: language === "ar" ? "المحتوى الرئيسي" : "Main Content",
          bullets: [
            language === "ar" ? "النقطة الأولى المفصلة" : "Detailed first point",
            language === "ar" ? "النقطة الثانية المفصلة" : "Detailed second point",
            language === "ar" ? "النقطة الثالثة المفصلة" : "Detailed third point",
          ],
          visuals: language === "ar" ? "رسم بياني أو مخطط توضيحي" : "Chart or infographic",
          speakerNotes: language === "ar" ? "نقاط الحديث الرئيسية" : "Key talking points",
        },
      ],
      designElements: {
        animations: "subtle_transitions",
        slideRatio: "16:9",
        logoPlacement: "top-right",
      },
      executiveSummary: language === "ar" ? "ملخص تنفيذي للعرض التقديمي" : "Executive summary of the presentation",
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SlidesRequest = await request.json()
    const { topic, language, requirements = "Professional presentation", provider = "auto" } = body

    console.log("[v0] Slides API called for topic:", topic, "language:", language)

    const slides = await generateSlidesWithGroq(topic, language, requirements)

    return NextResponse.json(slides)
  } catch (error) {
    console.error("[v0] Slides API error:", error)
    return NextResponse.json({ error: "Failed to generate slides" }, { status: 500 })
  }
}
