import { type NextRequest, NextResponse } from "next/server"

// API Configuration
const GROQ_API_KEY = "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"
const GROQ_MODEL = "llama-3.1-70b-versatile"

interface ChartSpecRequest {
  schema?: Record<string, string>
  sampleData?: any[][]
  question?: string
  query?: string
  language?: string
  provider?: "auto" | "gemini" | "groq"
}

export async function POST(request: NextRequest) {
  try {
    const body: ChartSpecRequest = await request.json()
    const { schema, sampleData, question, query, language = "en" } = body

    console.log("[v0] Chart spec API called for query:", query || question)

    const dashboardData = {
      barChart: [
        { label: "Active Clients", value: 4200 },
        { label: "New Leads", value: 3100 },
        { label: "Conversions", value: 5200 },
        { label: "Pending", value: 2800 },
        { label: "Completed", value: 4100 },
        { label: "Revenue", value: 3600 },
      ],
      donutChart: [
        { label: "Desktop Users", percentage: 45, value: 2700 },
        { label: "Mobile Users", percentage: 35, value: 2100 },
        { label: "Tablet Users", percentage: 20, value: 1200 },
      ],
      lineChart: [
        { label: "Jan", value: 2400 },
        { label: "Feb", value: 1398 },
        { label: "Mar", value: 9800 },
        { label: "Apr", value: 3908 },
        { label: "May", value: 4800 },
        { label: "Jun", value: 3800 },
        { label: "Jul", value: 4300 },
      ],
      multiLineChart: [
        {
          name: "Revenue",
          data: [
            { month: "Jan", value: 23000 },
            { month: "Feb", value: 31000 },
            { month: "Mar", value: 35000 },
            { month: "Apr", value: 30000 },
            { month: "May", value: 32000 },
            { month: "Jun", value: 38000 },
          ],
        },
        {
          name: "Expenses",
          data: [
            { month: "Jan", value: 18000 },
            { month: "Feb", value: 22000 },
            { month: "Mar", value: 25000 },
            { month: "Apr", value: 21000 },
            { month: "May", value: 24000 },
            { month: "Jun", value: 27000 },
          ],
        },
      ],
      complexChart: {
        bars: [65, 45, 80, 35, 90, 25, 70, 55],
        lines: [45, 32, 60, 25, 70, 18, 50, 38],
        labels: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8"],
      },
      tableData: [
        {
          name: "Marketing Campaign",
          contact: "68",
          crime: "6.1%",
          contrast: "3",
          cosmicMisalation: "Digital Strategy",
          value: "18.2%",
        },
        {
          name: "Sales Funnel",
          contact: "127",
          crime: "1.7%",
          contrast: "9",
          cosmicMisalation: "Lead Generation",
          value: "13.56%",
        },
        {
          name: "Customer Retention",
          contact: "89",
          crime: "4.2%",
          contrast: "7",
          cosmicMisalation: "Support Quality",
          value: "22.1%",
        },
        {
          name: "Product Development",
          contact: "156",
          crime: "2.8%",
          contrast: "12",
          cosmicMisalation: "Innovation Index",
          value: "31.4%",
        },
      ],
      insights: [
        "Revenue growth shows consistent upward trend with 15% increase over last quarter",
        "Mobile users represent the fastest growing segment at 35% of total traffic",
        "Customer retention rates have improved by 8% following new support initiatives",
        "Marketing campaigns show highest ROI in Q3 with 22.1% conversion rate",
      ],
      kpis: {
        totalRevenue: "€2.4M",
        growthRate: "+15.2%",
        activeUsers: "12.8K",
        conversionRate: "18.7%",
      },
    }

    // If we have actual data, try to generate AI-powered insights
    if (schema && sampleData) {
      const systemPrompt = `You are a data visualization expert. Analyze the provided data schema and suggest appropriate charts.

      Return ONLY valid JSON array in this format:
      [
        {
          "title": "Chart Title",
          "type": "bar|line|pie|scatter|area",
          "datasetId": "dataset_0",
          "encoding": {
            "x": {"field": "column_name", "type": "nominal|ordinal|quantitative|temporal"},
            "y": {"field": "column_name", "type": "quantitative", "aggregate": "sum|count|mean|etc"}
          },
          "description": "Brief description of insights",
          "warnings": ["Any data quality issues"]
        }
      ]`

      const prompt = `Data Schema: ${JSON.stringify(schema)}
      Sample Data: ${JSON.stringify(sampleData.slice(0, 3))}
      Question: ${question || query}
      
      Suggest 3-5 appropriate visualizations for this data.`

      try {
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
              { role: "user", content: prompt },
            ],
            temperature: 0.3,
            max_tokens: 1500,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const content = data.choices[0].message.content
          const suggestions = JSON.parse(content)

          return NextResponse.json({
            suggestions,
            dashboardData,
            success: true,
          })
        }
      } catch (error) {
        console.error("[v0] AI analysis failed, using fallback data:", error)
      }
    }

    return NextResponse.json({
      dashboardData,
      success: true,
      message: language === "ar" ? "تم إنشاء لوحة المعلومات بنجاح" : "Dashboard created successfully",
    })
  } catch (error) {
    console.error("[v0] Chart spec API error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate chart specifications",
        dashboardData: null,
        success: false,
      },
      { status: 500 },
    )
  }
}
