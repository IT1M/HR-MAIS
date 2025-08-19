"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Paperclip, MoreHorizontal, Settings, BarChart3, FileText, Lightbulb, TrendingUp } from "lucide-react"

// Types
interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  agentType?: "presentation" | "dashboard" | "general"
}

interface AgentModel {
  id: string
  name: string
  description: string
  icon: string
  type: "presentation" | "dashboard" | "general"
  cost?: string
}

interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
  }
}

export default function Page() {
  // State management
  const [language, setLanguage] = useState<"auto" | "en" | "ar">("auto")
  const [theme, setTheme] = useState<"dark" | "light" | "eco" | "auto">("auto")
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedModel, setSelectedModel] = useState<AgentModel>({
    id: "e-1.1",
    name: "E-1.1",
    description: "Fast & flexible",
    icon: "⚡",
    type: "general",
    cost: "$0.002/1K tokens",
  })
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const chatInputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Available models/agents
  const availableModels: AgentModel[] = [
    {
      id: "e-1",
      name: "E-1",
      description: "Stable & thorough",
      icon: "🎯",
      type: "general",
      cost: "$0.003/1K tokens",
    },
    {
      id: "e-1.1",
      name: "E-1.1",
      description: "Fast & flexible",
      icon: "⚡",
      type: "general",
      cost: "$0.002/1K tokens",
    },
    {
      id: "gemini-pro",
      name: "Gemini Pro",
      description: "Advanced reasoning",
      icon: "🧠",
      type: "general",
      cost: "$0.005/1K tokens",
    },
    {
      id: "presentation",
      name: "Presentation Builder",
      description: "Creates slides & presentations",
      icon: "📊",
      type: "presentation",
      cost: "$0.004/1K tokens",
    },
    {
      id: "dashboard",
      name: "Data Dashboard",
      description: "Analyzes data & creates charts",
      icon: "📈",
      type: "dashboard",
      cost: "$0.003/1K tokens",
    },
  ]

  // Quick action suggestions
  const quickActions = [
    {
      icon: <FileText className="w-5 h-5" />,
      text: "Create Presentation",
      prompt: "Create a professional presentation about",
      agentType: "presentation" as const,
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      text: "Analyze Data",
      prompt: "Help me analyze my data and create charts for",
      agentType: "dashboard" as const,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: "Budget Planner",
      prompt: "Create a budget planning presentation for",
      agentType: "presentation" as const,
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      text: "Surprise Me",
      prompt: "Create something creative and useful for",
      agentType: "general" as const,
    },
  ]

  // Quick reply buttons for better UX
  const quickReplies = [
    { text: "Add Slide", icon: "➕" },
    { text: "Suggest Chart", icon: "📊" },
    { text: "Export PDF", icon: "📄" },
    { text: "Change Theme", icon: "🎨" },
  ]

  // Internationalization
  const t = (key: string) => {
    const currentLang = language === "auto" ? (navigator.language.startsWith("ar") ? "ar" : "en") : language
    const translations: Record<string, Record<string, string>> = {
      en: {
        welcome: "Welcome,",
        "what.build": "What will you build today?",
        "chat.placeholder": "Build me a beautiful landing page for...",
        login: "Log in",
        signup: "Sign up",
        "invite.friends": "Invite Friends",
        "get.credits": "Get Free Credits",
        "onboarding.title": "Welcome to AI Builder!",
        "onboarding.step1": "Choose Agent A for presentations or Agent B for data analysis",
        "onboarding.step2": "Upload files or type your request in the chat",
        "onboarding.step3": "Get professional results in seconds!",
        settings: "Settings",
        theme: "Theme",
        provider: "AI Provider",
        "cost.estimate": "Estimated cost",
      },
      ar: {
        welcome: "مرحباً،",
        "what.build": "ماذا ستبني اليوم؟",
        "chat.placeholder": "اصنع لي صفحة هبوط جميلة لـ...",
        login: "تسجيل الدخول",
        signup: "إنشاء حساب",
        "invite.friends": "دعوة الأصدقاء",
        "get.credits": "احصل على رصيد مجاني",
        "onboarding.title": "مرحباً بك في منشئ الذكي!",
        "onboarding.step1": "اختر الوكيل أ للعروض التقديمية أو الوكيل ب لتحليل البيانات",
        "onboarding.step2": "ارفع الملفات أو اكتب طلبك في المحادثة",
        "onboarding.step3": "احصل على نتائج احترافية في ثوانٍ!",
        settings: "الإعدادات",
        theme: "المظهر",
        provider: "مزود الذكاء الاصطناعي",
        "cost.estimate": "التكلفة المقدرة",
      },
    }
    return translations[currentLang]?.[key] || translations.en[key] || key
  }

  // Themes
  const themes: Theme[] = [
    {
      id: "auto",
      name: "Auto (System)",
      colors: {
        primary: "rgb(6, 182, 212)",
        secondary: "rgb(34, 197, 94)",
        accent: "rgb(168, 85, 247)",
        background: "rgb(17, 24, 39)",
        surface: "rgb(31, 41, 55)",
      },
    },
    {
      id: "dark",
      name: "Dark Mode",
      colors: {
        primary: "rgb(6, 182, 212)",
        secondary: "rgb(34, 197, 94)",
        accent: "rgb(168, 85, 247)",
        background: "rgb(17, 24, 39)",
        surface: "rgb(31, 41, 55)",
      },
    },
    {
      id: "light",
      name: "Light Mode",
      colors: {
        primary: "rgb(14, 165, 233)",
        secondary: "rgb(34, 197, 94)",
        accent: "rgb(168, 85, 22)",
        background: "rgb(255, 255, 255)",
        surface: "rgb(249, 250, 251)",
      },
    },
    {
      id: "eco",
      name: "Eco-Friendly",
      colors: {
        primary: "rgb(34, 197, 94)",
        secondary: "rgb(22, 163, 74)",
        accent: "rgb(132, 204, 22)",
        background: "rgb(20, 83, 45)",
        surface: "rgb(22, 101, 52)",
      },
    },
  ]

  useEffect(() => {
    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => {
        document.documentElement.setAttribute("data-theme", mediaQuery.matches ? "dark" : "light")
      }
      handleChange()
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    } else {
      document.documentElement.setAttribute("data-theme", theme)
    }
  }, [theme])

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited")
    if (!hasVisited) {
      setShowOnboarding(true)
      localStorage.setItem("hasVisited", "true")
    }
  }, [])

  // Effects
  useEffect(() => {
    const currentLang = language === "auto" ? (navigator.language.startsWith("ar") ? "ar" : "en") : language
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = currentLang
  }, [language])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // API Functions
  const callAPI = async (endpoint: string, data: any = {}) => {
    setProgress(0)
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90))
    }, 200)

    try {
      const response = await fetch(`/api${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
      const result = await response.json()
      setProgress(100)
      setTimeout(() => setProgress(0), 500)
      return result
    } finally {
      clearInterval(progressInterval)
    }
  }

  // Chat Functions
  const sendMessage = async (messageText?: string, agentType?: "presentation" | "dashboard" | "general") => {
    const text = messageText || inputValue.trim()
    if (!text) return

    // Switch to appropriate agent if specified
    if (agentType) {
      const targetModel = availableModels.find((m) => m.type === agentType)
      if (targetModel) {
        setSelectedModel(targetModel)
      }
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content: text,
      isUser: true,
      timestamp: new Date(),
      agentType: agentType || selectedModel.type,
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")

    try {
      setIsLoading(true)

      let response
      const currentLang = language === "auto" ? (navigator.language.startsWith("ar") ? "ar" : "en") : language

      // Route to appropriate API based on selected model
      if ((agentType || selectedModel.type) === "presentation") {
        response = await callAPI("/llm/slides", {
          topic: text,
          language: currentLang,
          requirements: "Professional presentation with clear structure",
        })

        localStorage.setItem("presentationData", JSON.stringify(response))

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `✅ ${currentLang === "ar" ? "تم إنشاء العرض التقديمي" : "Presentation created"}: "${response.coreInfo?.title || response.title}" ${currentLang === "ar" ? "مع" : "with"} ${response.slides?.length || 0} ${currentLang === "ar" ? "شرائح" : "slides"}. ${currentLang === "ar" ? "انقر هنا لعرض العرض التقديمي" : "Click here to view your presentation"}.`,
          isUser: false,
          timestamp: new Date(),
          agentType: "presentation",
        }
        setMessages((prev) => [...prev, aiMessage])

        setTimeout(() => {
          window.location.href = "/presentation"
        }, 1500)
      } else if ((agentType || selectedModel.type) === "dashboard") {
        response = await callAPI("/llm/chart-spec", {
          query: text,
          language: currentLang,
        })

        localStorage.setItem("dashboardData", JSON.stringify(response.dashboardData || {}))

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `✅ ${currentLang === "ar" ? "تم إنشاء لوحة التحكم بنجاح!" : "Dashboard created successfully!"} ${currentLang === "ar" ? "انقر هنا لعرض تصور البيانات" : "Click here to view your data visualization"}.`,
          isUser: false,
          timestamp: new Date(),
          agentType: "dashboard",
        }
        setMessages((prev) => [...prev, aiMessage])

        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1500)
      } else {
        response = await callAPI("/llm/chat", {
          messages: [{ role: "user", content: text }],
          systemPrompt: `You are a helpful AI assistant. Respond in ${currentLang}. Be concise and helpful.`,
          temperature: 0.7,
          maxTokens: 2000,
          provider: "auto",
        })

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.response,
          isUser: false,
          timestamp: new Date(),
          agentType: "general",
        }
        setMessages((prev) => [...prev, aiMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `${language === "ar" ? "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى أو صياغة السؤال بشكل مختلف." : "Sorry, something went wrong. Please try again or rephrase your question."} (${error})`,
        isUser: false,
        timestamp: new Date(),
        agentType: selectedModel.type,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (files: FileList) => {
    if (selectedModel.type !== "dashboard") {
      setSelectedModel(availableModels.find((m) => m.type === "dashboard") || selectedModel)
    }

    for (const file of Array.from(files)) {
      try {
        setIsLoading(true)

        const formData = new FormData()
        formData.append("file", file)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) throw new Error("Upload failed")

        const fileInfo = await uploadResponse.json()

        const fileMessage: Message = {
          id: Date.now().toString(),
          content: `📁 Uploaded: ${file.name}`,
          isUser: true,
          timestamp: new Date(),
          agentType: "dashboard",
        }
        setMessages((prev) => [...prev, fileMessage])

        const parseResponse = await callAPI("/data/parse", {
          fileId: fileInfo.id,
          originalName: file.name,
        })

        const analysisMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `✅ File processed successfully! Found ${parseResponse.datasets?.[0]?.totalRows || 0} rows and ${parseResponse.datasets?.[0]?.headers?.length || 0} columns. What would you like to analyze?`,
          isUser: false,
          timestamp: new Date(),
          agentType: "dashboard",
        }
        setMessages((prev) => [...prev, analysisMessage])
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `❌ Error uploading ${file.name}: ${error}`,
          isUser: false,
          timestamp: new Date(),
          agentType: "dashboard",
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    }
    setIsLoading(false)
  }

  const currentTheme = themes.find((t) => t.id === theme) || themes[0]

  return (
    <div
      className="min-h-screen text-white flex flex-col transition-all duration-300"
      style={{
        background:
          theme === "eco"
            ? `linear-gradient(135deg, ${currentTheme.colors.background} 0%, rgb(22, 101, 52) 100%)`
            : theme === "light"
              ? `linear-gradient(135deg, ${currentTheme.colors.background} 0%, rgb(243, 244, 246) 100%)`
              : `linear-gradient(135deg, ${currentTheme.colors.background} 0%, rgb(31, 41, 55) 100%)`,
        color: theme === "light" ? "rgb(17, 24, 39)" : "white",
      }}
    >
      {progress > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div
            className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {showOnboarding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{t("onboarding.title")}</h3>
            <div className="space-y-4">
              {onboardingStep === 0 && <p>{t("onboarding.step1")}</p>}
              {onboardingStep === 1 && <p>{t("onboarding.step2")}</p>}
              {onboardingStep === 2 && <p>{t("onboarding.step3")}</p>}
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={() => setShowOnboarding(false)} className="px-4 py-2 text-gray-400 hover:text-white">
                Skip
              </button>
              <button
                onClick={() => {
                  if (onboardingStep < 2) {
                    setOnboardingStep((prev) => prev + 1)
                  } else {
                    setShowOnboarding(false)
                  }
                }}
                className="px-4 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600"
              >
                {onboardingStep < 2 ? "Next" : "Get Started"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Status Bar */}
      <div className="flex items-center justify-between px-6 py-2 text-sm">
        <span className="font-medium">4:46</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-current rounded-full opacity-80"></div>
            <div className="w-1 h-3 bg-current rounded-full opacity-60"></div>
            <div className="w-1 h-3 bg-current rounded-full opacity-40"></div>
            <div className="w-1 h-3 bg-current rounded-full opacity-20"></div>
          </div>
          <span className="ml-1">5G</span>
          <div className="ml-2 px-1 py-0.5 bg-yellow-500 text-black text-xs rounded">35</div>
        </div>
      </div>

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-600 rounded-full text-sm hover:bg-white/10 transition-all duration-200">
            {t("login")}
          </button>
          <button className="px-4 py-2 bg-white text-black rounded-full text-sm hover:bg-gray-100 transition-all duration-200">
            {t("signup")}
          </button>
        </div>
      </header>

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{t("settings")}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t("theme")}</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  className="w-full p-2 bg-gray-700 rounded-lg"
                >
                  {themes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t("provider")}</label>
                <div className="text-sm text-gray-400">
                  {t("cost.estimate")}: {selectedModel.cost}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="mt-6 w-full py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="px-6 py-8 text-center">
        <h1 className="text-4xl font-light opacity-80 mb-2">{t("welcome")}</h1>
        <h2 className="text-4xl font-medium" style={{ color: currentTheme.colors.primary }}>
          {t("what.build")}
        </h2>
      </div>

      {/* Action Buttons */}
      <div className="px-6 mb-8 flex gap-3 justify-center">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105"
          style={{ backgroundColor: `${currentTheme.colors.surface}80` }}
        >
          <span style={{ color: currentTheme.colors.primary }}>👥</span>
          {t("invite.friends")}
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105"
          style={{ backgroundColor: currentTheme.colors.secondary }}
        >
          <span>🎁</span>
          {t("get.credits")}
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 px-6 pb-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center opacity-60 py-8">
            <p>Start a conversation with your AI assistant</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl transition-all duration-200 ${
                    message.isUser ? `text-white ml-auto` : `text-gray-100`
                  }`}
                  style={{
                    backgroundColor: message.isUser ? currentTheme.colors.primary : `${currentTheme.colors.surface}80`,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.agentType && (
                    <div className="text-xs opacity-70 mt-1">
                      {availableModels.find((m) => m.type === message.agentType)?.icon}{" "}
                      {availableModels.find((m) => m.type === message.agentType)?.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: `${currentTheme.colors.surface}80` }}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: currentTheme.colors.primary }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{
                        backgroundColor: currentTheme.colors.primary,
                        animationDelay: "0.2s",
                      }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{
                        backgroundColor: currentTheme.colors.primary,
                        animationDelay: "0.4s",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className="px-6 pb-2">
          <div className="flex gap-2 overflow-x-auto">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(reply.text)}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: `${currentTheme.colors.surface}60` }}
              >
                <span>{reply.icon}</span>
                <span>{reply.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-6 pb-6">
        <div
          className="rounded-2xl p-4 mb-4 backdrop-blur-lg"
          style={{ backgroundColor: `${currentTheme.colors.surface}40` }}
        >
          <div className="flex items-end gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 opacity-70 hover:opacity-100 transition-opacity"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <textarea
                ref={chatInputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t("chat.placeholder")}
                className="w-full bg-transparent placeholder-opacity-50 resize-none border-none outline-none"
                style={{ color: "inherit" }}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
              />
              <div className="text-xs opacity-50 mt-1">{inputValue.length}/2000 characters</div>
            </div>

            {/* Model Selector */}
            <div className="relative">
              <button
                onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: `${currentTheme.colors.surface}60` }}
              >
                <span>{selectedModel.icon}</span>
                <span>{selectedModel.name}</span>
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {isModelSelectorOpen && (
                <div
                  className="absolute bottom-full mb-2 right-0 border rounded-lg shadow-lg min-w-[250px] backdrop-blur-lg"
                  style={{
                    backgroundColor: `${currentTheme.colors.surface}90`,
                    borderColor: `${currentTheme.colors.primary}40`,
                  }}
                >
                  {availableModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model)
                        setIsModelSelectorOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                        selectedModel.id === model.id ? "bg-white/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{model.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{model.name}</div>
                          <div className="text-xs opacity-60">{model.description}</div>
                          <div className="text-xs opacity-40">{model.cost}</div>
                        </div>
                        {selectedModel.id === model.id && <div style={{ color: currentTheme.colors.primary }}>✓</div>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => sendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: currentTheme.colors.primary }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(`${action.prompt} my business`, action.agentType)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: `${currentTheme.colors.surface}40` }}
            >
              <span style={{ color: currentTheme.colors.primary }}>{action.icon}</span>
              <span>{action.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".xlsx,.xls,.csv,.pdf,.docx"
        className="hidden"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
      />
    </div>
  )
}
