"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download, Share2, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface Slide {
  type: string
  title: string
  subtitle?: string
  bullets?: string[]
  visuals?: string
  speakerNotes?: string
  chartType?: string
  dataDescription?: string
  keyInsights?: string[]
}

interface PresentationData {
  coreInfo: {
    title: string
    objective: string
    targetAudience: string
    keyMessage: string
  }
  language: string
  theme: {
    preset: string
    primary: string
    accent: string
    background: string
    font: string
    direction: string
  }
  slides: Slide[]
  designElements: {
    animations: string
    slideRatio: string
    logoPlacement: string
  }
  executiveSummary: string
}

export default function PresentationPage() {
  const router = useRouter()
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Get presentation data from localStorage or API
    const storedData = localStorage.getItem("presentationData")
    if (storedData) {
      setPresentationData(JSON.parse(storedData))
    }
  }, [])

  const nextSlide = () => {
    if (presentationData && currentSlide < presentationData.slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const exportToPDF = () => {
    // PDF export functionality
    console.log("Exporting to PDF...")
  }

  if (!presentationData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading presentation...</div>
      </div>
    )
  }

  const currentSlideData = presentationData.slides[currentSlide]
  const isRTL = presentationData.language === "ar"

  return (
    <div className={`min-h-screen bg-gray-900 text-white ${isRTL ? "rtl" : "ltr"}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/")} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: presentationData.theme.font }}>
              {presentationData.coreInfo.title}
            </h1>
            <p className="text-sm text-gray-400">{presentationData.coreInfo.objective}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={exportToPDF} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Slide Navigation */}
        <div className="w-64 border-r border-gray-800 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-4 text-gray-400">{isRTL ? "الشرائح" : "Slides"}</h3>
          {presentationData.slides.map((slide, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                currentSlide === index ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <div className="text-sm font-medium">{slide.title}</div>
              <div className="text-xs text-gray-400 mt-1">{isRTL ? `شريحة ${index + 1}` : `Slide ${index + 1}`}</div>
            </div>
          ))}
        </div>

        {/* Main Slide Area */}
        <div className="flex-1 flex flex-col">
          <div
            className="flex-1 p-8 flex items-center justify-center"
            style={{ backgroundColor: presentationData.theme.background }}
          >
            <div
              className="w-full max-w-4xl aspect-video bg-white rounded-lg shadow-2xl p-12 flex flex-col justify-center"
              style={{
                fontFamily: presentationData.theme.font,
                direction: presentationData.theme.direction,
              }}
            >
              {currentSlideData.type === "title" ? (
                <div className="text-center">
                  <h1 className="text-5xl font-bold mb-6" style={{ color: presentationData.theme.primary }}>
                    {currentSlideData.title}
                  </h1>
                  {currentSlideData.subtitle && (
                    <p className="text-2xl" style={{ color: presentationData.theme.accent }}>
                      {currentSlideData.subtitle}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-4xl font-bold mb-8" style={{ color: presentationData.theme.primary }}>
                    {currentSlideData.title}
                  </h2>
                  {currentSlideData.bullets && (
                    <ul className="space-y-4 text-xl text-gray-700">
                      {currentSlideData.bullets.map((bullet, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div
                            className="w-2 h-2 rounded-full mt-3 flex-shrink-0"
                            style={{ backgroundColor: presentationData.theme.accent }}
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                  {currentSlideData.visuals && (
                    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-600 italic">
                        {isRTL ? "العنصر المرئي: " : "Visual: "}
                        {currentSlideData.visuals}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between p-4 border-t border-gray-800">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {isRTL ? "السابق" : "Previous"}
            </button>

            <div className="text-sm text-gray-400">
              {currentSlide + 1} / {presentationData.slides.length}
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === presentationData.slides.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {isRTL ? "التالي" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Speaker Notes */}
        <div className="w-80 border-l border-gray-800 p-4">
          <h3 className="text-sm font-semibold mb-4 text-gray-400">{isRTL ? "ملاحظات المتحدث" : "Speaker Notes"}</h3>
          <div className="text-sm text-gray-300 leading-relaxed">
            {currentSlideData.speakerNotes || (isRTL ? "لا توجد ملاحظات لهذه الشريحة" : "No notes for this slide")}
          </div>

          {currentSlideData.keyInsights && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2 text-gray-400">{isRTL ? "الرؤى الرئيسية" : "Key Insights"}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {currentSlideData.keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
