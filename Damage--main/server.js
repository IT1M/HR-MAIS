const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs").promises
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const xlsx = require("xlsx")
const pdfParse = require("pdf-parse")
const mammoth = require("mammoth")
const { GoogleGenerativeAI } = require("@google/generative-ai")
const Groq = require("groq-sdk")

require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: ["'self'"],
      },
    },
  }),
)

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? false : true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use("/api/", limiter)

app.use(express.json({ limit: "50mb" }))
app.use(express.static("public"))

// Initialize AI providers
const gemini = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null

// File upload configuration
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    cb(null, allowedTypes.includes(file.mimetype))
  },
})

// Utility functions
function sanitizePII(text) {
  // Remove common PII patterns
  return text
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL]")
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN]")
    .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, "[CARD]")
    .replace(/\b\+?1?[-.\s]?$$?[0-9]{3}$$?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g, "[PHONE]")
}

async function callLLM(provider, model, messages, options = {}) {
  const { temperature = 0.7, maxTokens = 2000, stream = false } = options

  try {
    if (provider === "gemini" && gemini) {
      const genModel = gemini.getGenerativeModel({ model: model || process.env.GEMINI_MODEL || "gemini-1.5-flash" })
      const result = await genModel.generateContent({
        contents: messages.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })),
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      })
      return result.response.text()
    } else if (provider === "groq" && groq) {
      const completion = await groq.chat.completions.create({
        messages,
        model: model || process.env.GROQ_MODEL || "llama3-70b-8192",
        temperature,
        max_tokens: maxTokens,
        stream,
      })
      return completion.choices[0].message.content
    }
    throw new Error("No available LLM provider")
  } catch (error) {
    console.error("LLM Error:", error.message)
    throw error
  }
}

// API Routes

// Chat endpoint
app.post("/api/llm/chat", async (req, res) => {
  try {
    const { messages, systemPrompt, temperature, maxTokens, provider } = req.body

    const fullMessages = systemPrompt ? [{ role: "system", content: systemPrompt }, ...messages] : messages

    const selectedProvider = provider || process.env.PROVIDER || "auto"
    const actualProvider = selectedProvider === "auto" ? "gemini" : selectedProvider

    const response = await callLLM(actualProvider, null, fullMessages, { temperature, maxTokens })

    res.json({ response, provider: actualProvider })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Slides generation endpoint
app.post("/api/llm/slides", async (req, res) => {
  try {
    const { topic, language, requirements } = req.body

    const systemPrompt = `You are an expert presentation designer. Create a comprehensive slide deck structure in JSON format.
    
    Language: ${language || "en"}
    Topic: ${topic}
    Requirements: ${requirements || "Professional presentation"}
    
    Return ONLY valid JSON with this structure:
    {
      "title": "Presentation Title",
      "language": "${language || "en"}",
      "theme": {
        "preset": "Modern",
        "primary": "#0ea5e9",
        "accent": "#f59e0b",
        "font": "${language === "ar" ? "Cairo" : "Inter"}"
      },
      "slides": [
        {
          "type": "title",
          "title": "Main Title",
          "subtitle": "Subtitle",
          "background": "gradient"
        },
        {
          "type": "bullets",
          "title": "Key Points",
          "bullets": ["Point 1", "Point 2", "Point 3"],
          "icon": "lightbulb"
        }
      ],
      "executiveSummary": true
    }
    
    Include 5-8 slides with varied types: title, bullets, two-col, data, summary.
    Use appropriate ${language === "ar" ? "Arabic" : "English"} content and consider RTL layout for Arabic.`

    const messages = [{ role: "user", content: `Create a presentation about: ${topic}` }]

    const response = await callLLM("gemini", null, [{ role: "system", content: systemPrompt }, ...messages])

    try {
      const slideData = JSON.parse(response)
      res.json(slideData)
    } catch (parseError) {
      // If JSON parsing fails, return a basic structure
      res.json({
        title: topic,
        language: language || "en",
        theme: {
          preset: "Modern",
          primary: "#0ea5e9",
          accent: "#f59e0b",
          font: language === "ar" ? "Cairo" : "Inter",
        },
        slides: [
          {
            type: "title",
            title: topic,
            subtitle: "Generated Presentation",
            background: "gradient",
          },
        ],
        executiveSummary: true,
      })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Chart specification endpoint
app.post("/api/llm/chart-spec", async (req, res) => {
  try {
    const { schema, sampleData, question } = req.body

    const systemPrompt = `You are a data visualization expert. Based on the provided data schema and sample, suggest 3-5 appropriate chart specifications.
    
    Return ONLY valid JSON array with this ChartSpec format:
    [
      {
        "title": "Chart Title",
        "type": "bar|line|area|pie|scatter|heatmap|map",
        "datasetId": "auto",
        "encoding": {
          "x": {"field": "fieldname", "type": "nominal|ordinal|quantitative|temporal"},
          "y": {"field": "fieldname", "type": "quantitative", "aggregate": "sum|count|mean|etc"},
          "color": {"field": "fieldname", "type": "nominal|ordinal"},
          "size": {"field": "fieldname", "type": "quantitative"}
        },
        "filters": [],
        "sort": {"by": "x|y", "order": "asc|desc"},
        "options": {"stack": "normal", "smooth": true, "legend": true, "tooltip": "rich"},
        "description": "Why this chart is useful",
        "warnings": ["Potential issues or limitations"]
      }
    ]
    
    Consider the question: ${question || "General analysis"}
    Match field names exactly from the schema.
    Suggest diverse chart types appropriate for the data.`

    const sanitizedSample = sanitizePII(JSON.stringify(sampleData).substring(0, 1000))
    const prompt = `Schema: ${JSON.stringify(schema)}\nSample Data: ${sanitizedSample}\nQuestion: ${question || "What insights can we derive?"}`

    const response = await callLLM("groq", null, [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ])

    try {
      const chartSpecs = JSON.parse(response)
      res.json(Array.isArray(chartSpecs) ? chartSpecs : [chartSpecs])
    } catch (parseError) {
      res.json([
        {
          title: "Basic Chart",
          type: "bar",
          datasetId: "auto",
          encoding: {
            x: { field: Object.keys(schema)[0] || "category", type: "nominal" },
            y: { field: Object.keys(schema)[1] || "value", type: "quantitative" },
          },
          filters: [],
          sort: { by: "y", order: "desc" },
          options: { legend: true, tooltip: "rich" },
          description: "Basic visualization of the data",
          warnings: ["Chart generated with limited analysis"],
        },
      ])
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// File upload endpoint
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const fileInfo = {
      id: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    }

    res.json(fileInfo)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Data parsing endpoint
app.post("/api/data/parse", async (req, res) => {
  try {
    const { fileId } = req.body
    const filePath = path.join("uploads", fileId)

    const fileBuffer = await fs.readFile(filePath)
    const fileStats = await fs.stat(filePath)

    const datasets = []
    let fields = []
    let summary = {}
    const issues = []

    // Determine file type and parse accordingly
    const fileName = (await fs.readdir("uploads")).find((f) => f === fileId)
    if (!fileName) {
      throw new Error("File not found")
    }

    // Get original filename from upload
    const originalName = req.body.originalName || fileName
    const ext = path.extname(originalName).toLowerCase()

    if (ext === ".xlsx" || ext === ".xls") {
      // Parse Excel file
      const workbook = xlsx.read(fileBuffer)
      const sheetNames = workbook.SheetNames

      for (const sheetName of sheetNames) {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length > 0) {
          const headers = jsonData[0]
          const rows = jsonData.slice(1)

          datasets.push({
            id: sheetName,
            name: sheetName,
            headers,
            data: rows.slice(0, 1000), // Limit to first 1000 rows
            totalRows: rows.length,
          })

          // Analyze field types
          const fieldAnalysis = headers.map((header, index) => {
            const values = rows
              .slice(0, 100)
              .map((row) => row[index])
              .filter((v) => v != null)
            const isNumeric = values.every((v) => !isNaN(v) && v !== "")
            const isDate = values.some((v) => !isNaN(Date.parse(v)))

            return {
              name: header,
              type: isNumeric ? "quantitative" : isDate ? "temporal" : "nominal",
              samples: values.slice(0, 5),
            }
          })

          fields.push(...fieldAnalysis)
        }
      }
    } else if (ext === ".csv") {
      // Parse CSV file
      const csvText = fileBuffer.toString("utf-8")
      const lines = csvText.split("\n").filter((line) => line.trim())

      if (lines.length > 0) {
        const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
        const rows = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim().replace(/"/g, "")))

        datasets.push({
          id: "csv_data",
          name: "CSV Data",
          headers,
          data: rows.slice(0, 1000),
          totalRows: rows.length,
        })

        // Analyze fields
        const fieldAnalysis = headers.map((header, index) => {
          const values = rows
            .slice(0, 100)
            .map((row) => row[index])
            .filter((v) => v != null && v !== "")
          const isNumeric = values.every((v) => !isNaN(v))
          const isDate = values.some((v) => !isNaN(Date.parse(v)))

          return {
            name: header,
            type: isNumeric ? "quantitative" : isDate ? "temporal" : "nominal",
            samples: values.slice(0, 5),
          }
        })

        fields = fieldAnalysis
      }
    } else if (ext === ".pdf") {
      // Parse PDF file
      const pdfData = await pdfParse(fileBuffer)
      const text = pdfData.text

      // Try to extract tables (basic approach)
      const lines = text.split("\n").filter((line) => line.trim())
      const potentialTableLines = lines.filter((line) => line.includes("\t") || line.split(/\s+/).length > 3)

      if (potentialTableLines.length > 0) {
        datasets.push({
          id: "pdf_text",
          name: "PDF Content",
          headers: ["Content"],
          data: potentialTableLines.slice(0, 100).map((line) => [line]),
          totalRows: potentialTableLines.length,
        })

        fields.push({
          name: "Content",
          type: "nominal",
          samples: potentialTableLines.slice(0, 5),
        })

        issues.push("PDF parsing is basic. For better table extraction, consider converting to Excel first.")
      }
    } else if (ext === ".docx") {
      // Parse DOCX file
      const docxData = await mammoth.extractRawText({ buffer: fileBuffer })
      const text = docxData.value

      // Try to extract structured content
      const lines = text.split("\n").filter((line) => line.trim())

      datasets.push({
        id: "docx_content",
        name: "Document Content",
        headers: ["Content"],
        data: lines.slice(0, 100).map((line) => [line]),
        totalRows: lines.length,
      })

      fields.push({
        name: "Content",
        type: "nominal",
        samples: lines.slice(0, 5),
      })

      issues.push("DOCX parsing extracts text content. For structured data, use Excel format.")
    }

    // Generate summary
    summary = {
      totalDatasets: datasets.length,
      totalFields: fields.length,
      fileSize: fileStats.size,
      parsedAt: new Date().toISOString(),
    }

    // Clean up file after processing
    setTimeout(async () => {
      try {
        await fs.unlink(filePath)
      } catch (err) {
        console.error("Error cleaning up file:", err)
      }
    }, 60000) // Clean up after 1 minute

    res.json({
      datasets,
      fields,
      summary,
      issues,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Serve static files
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Provider: ${process.env.PROVIDER || "auto"}`)
  console.log(`Gemini: ${process.env.GEMINI_API_KEY ? "configured" : "not configured"}`)
  console.log(`Groq: ${process.env.GROQ_API_KEY ? "configured" : "not configured"}`)
})
