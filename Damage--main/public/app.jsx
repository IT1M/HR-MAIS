// Global Application State
class AppState {
  constructor() {
    this.language = "auto"
    this.theme = "light"
    this.provider = "auto"
    this.model = ""
    this.temperature = 0.7
    this.maxTokens = 2000
    this.currentSlides = null
    this.currentDatasets = []
    this.currentCharts = []
    this.brandKit = {
      logo: null,
      primaryColor: "#0ea5e9",
      accentColor: "#f59e0b",
    }
  }
}

const appState = new AppState()

// Internationalization
const i18n = {
  en: {
    "app.title": "AI Builder",
    "language.auto": "Auto",
    "language.english": "English",
    "language.arabic": "العربية",
    "agent.presentations.title": "Presentation Builder",
    "agent.presentations.new": "New Presentation",
    "agent.dashboard.title": "Data Dashboard",
    "chat.placeholder": "Describe your presentation...",
    "slides.title": "Slides",
    "slides.brandKit": "Brand Kit",
    "slides.export": "Export",
    "dashboard.tabs.upload": "Upload",
    "dashboard.tabs.analyze": "Analyze",
    "dashboard.tabs.visualize": "Visualize",
    "dashboard.tabs.insights": "Insights",
    "upload.dragDrop": "Drag & drop files here or click to browse",
    "upload.formats": "Supports: Excel, CSV, PDF, DOCX",
    "analyze.button": "Analyze Data",
    "visualize.question": "What would you like to visualize?",
    "visualize.suggest": "Suggest Charts",
    "insights.generate": "Generate Insights",
    "command.placeholder": "Type a command...",
    "settings.title": "Settings",
    "settings.temperature": "Temperature",
    "settings.maxTokens": "Max Tokens",
    "settings.model": "Model",
    "brandKit.title": "Brand Kit",
    "brandKit.logo": "Upload Logo",
    "brandKit.colors": "Brand Colors",
    "brandKit.primary": "Primary",
    "brandKit.accent": "Accent",
    "loading.default": "Processing...",
  },
  ar: {
    "app.title": "منشئ الذكاء الاصطناعي",
    "language.auto": "تلقائي",
    "language.english": "English",
    "language.arabic": "العربية",
    "agent.presentations.title": "منشئ العروض التقديمية",
    "agent.presentations.new": "عرض جديد",
    "agent.dashboard.title": "لوحة البيانات",
    "chat.placeholder": "اوصف العرض التقديمي الذي تريده...",
    "slides.title": "الشرائح",
    "slides.brandKit": "هوية العلامة التجارية",
    "slides.export": "تصدير",
    "dashboard.tabs.upload": "رفع",
    "dashboard.tabs.analyze": "تحليل",
    "dashboard.tabs.visualize": "تصور",
    "dashboard.tabs.insights": "رؤى",
    "upload.dragDrop": "اسحب الملفات هنا أو انقر للتصفح",
    "upload.formats": "يدعم: Excel, CSV, PDF, DOCX",
    "analyze.button": "تحليل البيانات",
    "visualize.question": "ماذا تريد أن تصور؟",
    "visualize.suggest": "اقترح الرسوم البيانية",
    "insights.generate": "توليد الرؤى",
    "command.placeholder": "اكتب أمراً...",
    "settings.title": "الإعدادات",
    "settings.temperature": "درجة الحرارة",
    "settings.maxTokens": "الحد الأقصى للرموز",
    "settings.model": "النموذج",
    "brandKit.title": "هوية العلامة التجارية",
    "brandKit.logo": "رفع الشعار",
    "brandKit.colors": "ألوان العلامة التجارية",
    "brandKit.primary": "أساسي",
    "brandKit.accent": "مميز",
    "loading.default": "جاري المعالجة...",
  },
}

// Utility Functions
function detectLanguage() {
  const browserLang = navigator.language || navigator.userLanguage
  return browserLang.startsWith("ar") ? "ar" : "en"
}

function t(key) {
  const lang = appState.language === "auto" ? detectLanguage() : appState.language
  return i18n[lang]?.[key] || i18n.en[key] || key
}

function updateI18n() {
  const elements = document.querySelectorAll("[data-i18n]")
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n")
    el.textContent = t(key)
  })

  const placeholderElements = document.querySelectorAll("[data-i18n-placeholder]")
  placeholderElements.forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder")
    el.placeholder = t(key)
  })
}

function updateDirection() {
  const lang = appState.language === "auto" ? detectLanguage() : appState.language
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
  document.documentElement.lang = lang
}

function showLoading(text = null) {
  const overlay = document.getElementById("loadingOverlay")
  const loadingText = document.getElementById("loadingText")
  if (text) {
    loadingText.textContent = text
  }
  overlay.classList.remove("hidden")
}

function hideLoading() {
  document.getElementById("loadingOverlay").classList.add("hidden")
}

function showModal(modalId) {
  document.getElementById(modalId).classList.remove("hidden")
}

function hideModal(modalId) {
  document.getElementById(modalId).classList.add("hidden")
}

// API Functions
async function callAPI(endpoint, data = {}, method = "POST") {
  try {
    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: method !== "GET" ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API call failed:", error)
    throw error
  }
}

// Chat Functions
function addChatMessage(content, isUser = false) {
  const messagesContainer = document.getElementById("chatMessages")
  const messageDiv = document.createElement("div")
  messageDiv.className = `chat-message ${isUser ? "user" : "assistant"}`

  messageDiv.innerHTML = `
    <div class="message-avatar">
      ${isUser ? "👤" : "🤖"}
    </div>
    <div class="message-content">
      ${isUser ? content : formatMessageContent(content)}
    </div>
  `

  messagesContainer.appendChild(messageDiv)
  messagesContainer.scrollTop = messagesContainer.scrollHeight
}

function formatMessageContent(content) {
  // Basic markdown-like formatting
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>")
}

async function sendChatMessage() {
  const input = document.getElementById("chatInput")
  const message = input.value.trim()

  if (!message) return

  addChatMessage(message, true)
  input.value = ""

  try {
    showLoading("Generating response...")

    const response = await callAPI("/llm/chat", {
      messages: [{ role: "user", content: message }],
      systemPrompt: `You are a helpful AI assistant that specializes in creating presentations. 
        Respond in ${appState.language === "auto" ? detectLanguage() : appState.language}.
        Be concise and helpful.`,
      temperature: appState.temperature,
      maxTokens: appState.maxTokens,
      provider: appState.provider,
    })

    addChatMessage(response.response)

    // Check if the message is about creating slides
    if (
      message.toLowerCase().includes("presentation") ||
      message.toLowerCase().includes("slides") ||
      message.toLowerCase().includes("عرض") ||
      message.toLowerCase().includes("شرائح")
    ) {
      generateSlides(message)
    }
  } catch (error) {
    addChatMessage(`Error: ${error.message}`)
  } finally {
    hideLoading()
  }
}

// Slides Functions
async function generateSlides(topic) {
  try {
    showLoading("Generating slides...")

    const lang = appState.language === "auto" ? detectLanguage() : appState.language

    const response = await callAPI("/llm/slides", {
      topic,
      language: lang,
      requirements: "Professional presentation with clear structure",
    })

    appState.currentSlides = response
    displaySlides(response)
    document.getElementById("slidesPanel").classList.remove("hidden")
  } catch (error) {
    console.error("Error generating slides:", error)
    addChatMessage(`Error generating slides: ${error.message}`)
  } finally {
    hideLoading()
  }
}

function displaySlides(slidesData) {
  const container = document.getElementById("slidesContainer")
  container.innerHTML = ""

  slidesData.slides.forEach((slide, index) => {
    const slideElement = document.createElement("div")
    slideElement.className = "slide-item"
    slideElement.innerHTML = `
      <h4>Slide ${index + 1}: ${slide.title || slide.type}</h4>
      <p>${slide.subtitle || slide.bullets?.join(", ") || "Content slide"}</p>
      <div class="slide-type">Type: ${slide.type}</div>
    `

    slideElement.addEventListener("click", () => {
      document.querySelectorAll(".slide-item").forEach((s) => s.classList.remove("active"))
      slideElement.classList.add("active")
    })

    container.appendChild(slideElement)
  })
}

async function exportSlides() {
  if (!appState.currentSlides) {
    alert("No slides to export")
    return
  }

  try {
    showLoading("Exporting slides...")

    // Create a simple HTML export
    const html = generateSlidesHTML(appState.currentSlides)
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${appState.currentSlides.title || "presentation"}.html`
    a.click()

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error exporting slides:", error)
    alert(`Error exporting slides: ${error.message}`)
  } finally {
    hideLoading()
  }
}

function generateSlidesHTML(slidesData) {
  const lang = slidesData.language || "en"
  const dir = lang === "ar" ? "rtl" : "ltr"

  let slidesHTML = ""
  slidesData.slides.forEach((slide, index) => {
    slidesHTML += `
      <div class="slide" style="
        width: 100vw; 
        height: 100vh; 
        padding: 2rem; 
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        background: linear-gradient(135deg, ${slidesData.theme.primary}, ${slidesData.theme.accent});
        color: white;
        page-break-after: always;
      ">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">${slide.title}</h1>
        ${slide.subtitle ? `<h2 style="font-size: 1.5rem; opacity: 0.8;">${slide.subtitle}</h2>` : ""}
        ${
          slide.bullets
            ? `<ul style="font-size: 1.2rem; line-height: 1.6;">
          ${slide.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
        </ul>`
            : ""
        }
      </div>
    `
  })

  return `
    <!DOCTYPE html>
    <html lang="${lang}" dir="${dir}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${slidesData.title}</title>
      <style>
        body { 
          margin: 0; 
          font-family: ${lang === "ar" ? "Cairo" : "Inter"}, sans-serif; 
        }
        @media print {
          .slide { page-break-after: always; }
        }
      </style>
    </head>
    <body>
      ${slidesHTML}
    </body>
    </html>
  `
}

// Dashboard Functions
function initializeDashboard() {
  const uploadArea = document.getElementById("uploadArea")
  const fileInput = document.getElementById("fileInput")

  // Drag and drop functionality
  uploadArea.addEventListener("click", () => fileInput.click())
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault()
    uploadArea.classList.add("dragover")
  })
  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover")
  })
  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault()
    uploadArea.classList.remove("dragover")
    handleFiles(e.dataTransfer.files)
  })

  fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files)
  })

  // Tab switching
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.getAttribute("data-tab")
      switchTab(tabName)
    })
  })
}

function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName)
  })

  // Update tab content
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.toggle("active", content.id === `${tabName}Tab`)
  })
}

async function handleFiles(files) {
  const filesList = document.getElementById("filesList")

  for (const file of files) {
    try {
      showLoading(`Uploading ${file.name}...`)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const fileInfo = await response.json()
      displayFileItem(fileInfo, file)

      // Parse the file
      await parseFile(fileInfo, file.name)
    } catch (error) {
      console.error("Error uploading file:", error)
      alert(`Error uploading ${file.name}: ${error.message}`)
    }
  }

  hideLoading()
}

function displayFileItem(fileInfo, originalFile) {
  const filesList = document.getElementById("filesList")
  const fileItem = document.createElement("div")
  fileItem.className = "file-item"
  fileItem.innerHTML = `
    <div class="file-info">
      <div class="file-icon">📄</div>
      <div class="file-details">
        <h4>${originalFile.name}</h4>
        <p>${(originalFile.size / 1024 / 1024).toFixed(2)} MB</p>
      </div>
    </div>
    <button class="btn btn-secondary" onclick="removeFile('${fileInfo.id}')">Remove</button>
  `

  filesList.appendChild(fileItem)
}

async function parseFile(fileInfo, originalName) {
  try {
    const response = await callAPI("/data/parse", {
      fileId: fileInfo.id,
      originalName,
    })

    appState.currentDatasets.push(...response.datasets)

    // Enable analyze button
    document.getElementById("analyzeDataBtn").disabled = false
    document.getElementById("suggestChartsBtn").disabled = false
    document.getElementById("generateInsightsBtn").disabled = false

    console.log("Parsed data:", response)
  } catch (error) {
    console.error("Error parsing file:", error)
    alert(`Error parsing file: ${error.message}`)
  }
}

async function analyzeData() {
  if (appState.currentDatasets.length === 0) {
    alert("No data to analyze")
    return
  }

  try {
    showLoading("Analyzing data...")

    const profileContainer = document.getElementById("dataProfile")
    profileContainer.innerHTML = ""

    appState.currentDatasets.forEach((dataset) => {
      const profileDiv = document.createElement("div")
      profileDiv.className = "dataset-profile"
      profileDiv.innerHTML = `
        <h4>${dataset.name}</h4>
        <p>Rows: ${dataset.totalRows}</p>
        <p>Columns: ${dataset.headers.length}</p>
        <div class="columns-list">
          ${dataset.headers.map((header) => `<span class="column-tag">${header}</span>`).join("")}
        </div>
      `
      profileContainer.appendChild(profileDiv)
    })

    switchTab("analyze")
  } catch (error) {
    console.error("Error analyzing data:", error)
    alert(`Error analyzing data: ${error.message}`)
  } finally {
    hideLoading()
  }
}

async function suggestCharts() {
  if (appState.currentDatasets.length === 0) {
    alert("No data to analyze")
    return
  }

  try {
    showLoading("Suggesting charts...")

    const question = document.getElementById("chartQuestion").value || "General analysis"
    const dataset = appState.currentDatasets[0] // Use first dataset for now

    // Create schema from headers
    const schema = {}
    dataset.headers.forEach((header) => {
      schema[header] = "string" // Simplified type detection
    })

    const response = await callAPI("/llm/chart-spec", {
      schema,
      sampleData: dataset.data.slice(0, 5),
      question,
    })

    displayChartSuggestions(response)
    switchTab("visualize")
  } catch (error) {
    console.error("Error suggesting charts:", error)
    alert(`Error suggesting charts: ${error.message}`)
  } finally {
    hideLoading()
  }
}

function displayChartSuggestions(suggestions) {
  const container = document.getElementById("chartSuggestions")
  container.innerHTML = ""

  suggestions.forEach((suggestion, index) => {
    const suggestionDiv = document.createElement("div")
    suggestionDiv.className = "chart-suggestion"
    suggestionDiv.innerHTML = `
      <h4 class="suggestion-title">${suggestion.title}</h4>
      <p class="suggestion-description">${suggestion.description}</p>
      ${suggestion.warnings?.length ? `<p class="suggestion-warnings">⚠️ ${suggestion.warnings.join(", ")}</p>` : ""}
    `

    suggestionDiv.addEventListener("click", () => {
      createChart(suggestion)
    })

    container.appendChild(suggestionDiv)
  })
}

function createChart(chartSpec) {
  const chartsGrid = document.getElementById("chartsGrid")
  const chartContainer = document.createElement("div")
  chartContainer.className = "chart-container"
  chartContainer.innerHTML = `
    <div class="chart-header">
      <h4 class="chart-title">${chartSpec.title}</h4>
      <div class="chart-actions">
        <button class="btn btn-secondary" onclick="exportChart(this)">Export</button>
        <button class="btn btn-secondary" onclick="removeChart(this)">Remove</button>
      </div>
    </div>
    <div class="chart-content" style="height: 250px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
      <p>Chart: ${chartSpec.type} - ${chartSpec.title}</p>
    </div>
  `

  chartsGrid.appendChild(chartContainer)
  appState.currentCharts.push(chartSpec)
}

function removeChart(button) {
  const chartContainer = button.closest(".chart-container")
  chartContainer.remove()
}

function exportChart(button) {
  const chartContainer = button.closest(".chart-container")
  const title = chartContainer.querySelector(".chart-title").textContent
  alert(`Exporting chart: ${title}`)
}

async function generateInsights() {
  if (appState.currentDatasets.length === 0) {
    alert("No data to analyze")
    return
  }

  try {
    showLoading("Generating insights...")

    const dataset = appState.currentDatasets[0]
    const prompt = `Analyze this dataset and provide key insights:
    Dataset: ${dataset.name}
    Columns: ${dataset.headers.join(", ")}
    Sample data: ${JSON.stringify(dataset.data.slice(0, 3))}`

    const response = await callAPI("/llm/chat", {
      messages: [{ role: "user", content: prompt }],
      systemPrompt: "You are a data analyst. Provide clear, actionable insights about the data.",
      temperature: 0.3,
      maxTokens: 1000,
      provider: appState.provider,
    })

    const insightsContainer = document.getElementById("insightsContent")
    insightsContainer.innerHTML = `
      <div class="insights-text">
        ${formatMessageContent(response.response)}
      </div>
    `

    switchTab("insights")
  } catch (error) {
    console.error("Error generating insights:", error)
    alert(`Error generating insights: ${error.message}`)
  } finally {
    hideLoading()
  }
}

// Command Palette
function initializeCommandPalette() {
  const commands = [
    {
      id: "new-presentation",
      text: "New Presentation",
      icon: "📊",
      action: () => document.getElementById("chatInput").focus(),
    },
    { id: "export-slides", text: "Export Slides", icon: "📥", action: exportSlides },
    { id: "upload-data", text: "Upload Data", icon: "📁", action: () => document.getElementById("fileInput").click() },
    { id: "analyze-data", text: "Analyze Data", icon: "🔍", action: analyzeData },
    { id: "suggest-charts", text: "Suggest Charts", icon: "💡", action: suggestCharts },
    { id: "generate-insights", text: "Generate Insights", icon: "🧠", action: generateInsights },
    { id: "toggle-theme", text: "Toggle Theme", icon: "🌙", action: toggleTheme },
    { id: "settings", text: "Settings", icon: "⚙️", action: () => showModal("settingsModal") },
  ]

  const commandInput = document.getElementById("commandInput")
  const commandResults = document.getElementById("commandResults")

  function showCommands(filter = "") {
    const filteredCommands = commands.filter((cmd) => cmd.text.toLowerCase().includes(filter.toLowerCase()))

    commandResults.innerHTML = filteredCommands
      .map(
        (cmd) => `
      <div class="command-item" data-command="${cmd.id}">
        <span class="command-icon">${cmd.icon}</span>
        <span class="command-text">${cmd.text}</span>
      </div>
    `,
      )
      .join("")

    // Add click handlers
    commandResults.querySelectorAll(".command-item").forEach((item) => {
      item.addEventListener("click", () => {
        const command = commands.find((cmd) => cmd.id === item.dataset.command)
        if (command) {
          command.action()
          hideModal("commandPalette")
        }
      })
    })
  }

  commandInput.addEventListener("input", (e) => {
    showCommands(e.target.value)
  })

  commandInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const firstCommand = commandResults.querySelector(".command-item")
      if (firstCommand) {
        firstCommand.click()
      }
    }
  })

  // Show all commands initially
  showCommands()
}

// Theme Functions
function toggleTheme() {
  appState.theme = appState.theme === "light" ? "dark" : "light"
  document.documentElement.setAttribute("data-theme", appState.theme)

  const themeToggle = document.getElementById("themeToggle")
  themeToggle.innerHTML = `<span class="icon">${appState.theme === "light" ? "🌙" : "☀️"}</span>`

  localStorage.setItem("theme", appState.theme)
}

// Settings Functions
function initializeSettings() {
  const temperatureSlider = document.getElementById("temperatureSlider")
  const temperatureValue = document.getElementById("temperatureValue")
  const maxTokensInput = document.getElementById("maxTokensInput")
  const modelInput = document.getElementById("modelInput")

  temperatureSlider.addEventListener("input", (e) => {
    appState.temperature = Number.parseFloat(e.target.value)
    temperatureValue.textContent = appState.temperature
  })

  maxTokensInput.addEventListener("change", (e) => {
    appState.maxTokens = Number.parseInt(e.target.value)
  })

  modelInput.addEventListener("change", (e) => {
    appState.model = e.target.value
  })
}

// Brand Kit Functions
function initializeBrandKit() {
  const logoInput = document.getElementById("logoInput")
  const logoPreview = document.getElementById("logoPreview")
  const primaryColor = document.getElementById("primaryColor")
  const accentColor = document.getElementById("accentColor")

  logoInput.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        appState.brandKit.logo = e.target.result
        logoPreview.innerHTML = `<img src="${e.target.result}" alt="Logo" style="max-width: 100px; max-height: 100px;">`

        // Extract colors from logo (simplified)
        extractColorsFromImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  })

  primaryColor.addEventListener("change", (e) => {
    appState.brandKit.primaryColor = e.target.value
  })

  accentColor.addEventListener("change", (e) => {
    appState.brandKit.accentColor = e.target.value
  })
}

function extractColorsFromImage(imageSrc) {
  // Simplified color extraction - in a real app, you'd use a library like ColorThief
  const img = new Image()
  img.crossOrigin = "anonymous"
  img.onload = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    // Get dominant colors (simplified approach)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Sample some pixels and find dominant colors
    const colors = []
    for (let i = 0; i < data.length; i += 4 * 100) {
      // Sample every 100th pixel
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      colors.push(`rgb(${r}, ${g}, ${b})`)
    }

    // Update color inputs with extracted colors (simplified)
    if (colors.length > 0) {
      document.getElementById("primaryColor").value = rgbToHex(colors[0])
      if (colors.length > 1) {
        document.getElementById("accentColor").value = rgbToHex(colors[1])
      }
    }
  }
  img.src = imageSrc
}

function rgbToHex(rgb) {
  const match = rgb.match(/rgb$$(\d+), (\d+), (\d+)$$/)
  if (match) {
    const r = Number.parseInt(match[1])
    const g = Number.parseInt(match[2])
    const b = Number.parseInt(match[3])
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }
  return "#000000"
}

// Dashboard Panel Functions
function initializeDashboardPanel() {
  const dashboardHandle = document.getElementById("dashboardHandle")
  const dashboardPanel = document.getElementById("agentB")
  const toggleBtn = document.getElementById("toggleDashboardBtn")

  let isCollapsed = true
  dashboardPanel.classList.add("collapsed")

  function togglePanel() {
    isCollapsed = !isCollapsed
    dashboardPanel.classList.toggle("collapsed", isCollapsed)
    toggleBtn.innerHTML = `<span class="icon">${isCollapsed ? "📈" : "📉"}</span>`
  }

  dashboardHandle.addEventListener("click", togglePanel)
  toggleBtn.addEventListener("click", togglePanel)
}

// Keyboard Shortcuts
function initializeKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Command Palette (Cmd/Ctrl + K)
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault()
      showModal("commandPalette")
      document.getElementById("commandInput").focus()
    }

    // Send message (Enter in chat)
    if (e.key === "Enter" && e.target.id === "chatInput" && !e.shiftKey) {
      e.preventDefault()
      sendChatMessage()
    }

    // Close modals (Escape)
    if (e.key === "Escape") {
      document.querySelectorAll(".modal:not(.hidden)").forEach((modal) => {
        modal.classList.add("hidden")
      })
    }
  })
}

// Load saved state
function loadSavedState() {
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    appState.theme = savedTheme
    document.documentElement.setAttribute("data-theme", savedTheme)
    const themeToggle = document.getElementById("themeToggle")
    themeToggle.innerHTML = `<span class="icon">${savedTheme === "light" ? "🌙" : "☀️"}</span>`
  }

  const savedLanguage = localStorage.getItem("language")
  if (savedLanguage) {
    appState.language = savedLanguage
    document.getElementById("languageSelect").value = savedLanguage
  }
}

// Save state
function saveState() {
  localStorage.setItem("theme", appState.theme)
  localStorage.setItem("language", appState.language)
}

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  // Load saved state
  loadSavedState()

  // Initialize components
  initializeDashboard()
  initializeDashboardPanel()
  initializeCommandPalette()
  initializeSettings()
  initializeBrandKit()
  initializeKeyboardShortcuts()

  // Update UI
  updateI18n()
  updateDirection()

  // Event Listeners
  document.getElementById("languageSelect").addEventListener("change", (e) => {
    appState.language = e.target.value
    updateI18n()
    updateDirection()
    saveState()
  })

  document.getElementById("providerSelect").addEventListener("change", (e) => {
    appState.provider = e.target.value
  })

  document.getElementById("themeToggle").addEventListener("click", toggleTheme)

  document.getElementById("settingsBtn").addEventListener("click", () => {
    showModal("settingsModal")
  })

  document.getElementById("commandPaletteBtn").addEventListener("click", () => {
    showModal("commandPalette")
    document.getElementById("commandInput").focus()
  })

  document.getElementById("brandKitBtn").addEventListener("click", () => {
    showModal("brandKitModal")
  })

  document.getElementById("sendChatBtn").addEventListener("click", sendChatMessage)
  document.getElementById("newPresentationBtn").addEventListener("click", () => {
    document.getElementById("chatInput").focus()
  })

  document.getElementById("exportSlidesBtn").addEventListener("click", exportSlides)
  document.getElementById("analyzeDataBtn").addEventListener("click", analyzeData)
  document.getElementById("suggestChartsBtn").addEventListener("click", suggestCharts)
  document.getElementById("generateInsightsBtn").addEventListener("click", generateInsights)

  // Modal close buttons
  document.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal")
      modal.classList.add("hidden")
    })
  })

  // Close modals when clicking outside
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden")
      }
    })
  })

  console.log("AI Builder initialized successfully")
})

// Service Worker Registration (PWA)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
