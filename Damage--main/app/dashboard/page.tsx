"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download, Share2, Settings, X, Maximize2 } from "lucide-react"
import { useRouter } from "next/navigation"

// Chart components (using a simple implementation for demo)
const BarChart = ({ data, title }: { data: any[]; title: string }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-white font-medium">{title}</h3>
      <button className="text-gray-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
    <div className="h-32 flex items-end justify-between gap-1">
      {data.map((item, idx) => (
        <div
          key={idx}
          className="flex-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t"
          style={{ height: `${(item.value / Math.max(...data.map((d) => d.value))) * 100}%` }}
        />
      ))}
    </div>
  </div>
)

const DonutChart = ({ data, title, centerValue }: { data: any[]; title: string; centerValue: string }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-white font-medium">{title}</h3>
      <button className="text-gray-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
    <div className="relative w-24 h-24 mx-auto">
      <div className="w-full h-full rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-1">
        <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
          <span className="text-white font-bold text-sm">{centerValue}</span>
        </div>
      </div>
    </div>
    <div className="mt-4 space-y-2">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-${["orange", "pink", "purple"][idx]}-500`} />
            <span className="text-gray-300">{item.label}</span>
          </div>
          <span className="text-white">{item.percentage}%</span>
        </div>
      ))}
    </div>
  </div>
)

const LineChart = ({ data, title }: { data: any[]; title: string }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-white font-medium">{title}</h3>
      <div className="flex items-center gap-2">
        <button className="text-gray-400 hover:text-white">
          <Maximize2 className="w-4 h-4" />
        </button>
        <button className="text-gray-400 hover:text-white">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
    <div className="h-32 relative">
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          points={data
            .map(
              (item, idx) =>
                `${(idx / (data.length - 1)) * 100},${100 - (item.value / Math.max(...data.map((d) => d.value))) * 80}`,
            )
            .join(" ")}
        />
      </svg>
    </div>
  </div>
)

export default function DashboardPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("Output")
  const [dashboardData, setDashboardData] = useState<any>(null)

  // Sample data for demonstration
  const sampleData = {
    barChart: [
      { label: "Jan", value: 4200 },
      { label: "Feb", value: 3100 },
      { label: "Mar", value: 5200 },
      { label: "Apr", value: 2800 },
      { label: "May", value: 4100 },
      { label: "Jun", value: 3600 },
    ],
    donutChart: [
      { label: "Desktop", percentage: 45, value: 2700 },
      { label: "Mobile", percentage: 35, value: 2100 },
      { label: "Tablet", percentage: 20, value: 1200 },
    ],
    lineChart: [
      { label: "Week 1", value: 2400 },
      { label: "Week 2", value: 1398 },
      { label: "Week 3", value: 9800 },
      { label: "Week 4", value: 3908 },
      { label: "Week 5", value: 4800 },
      { label: "Week 6", value: 3800 },
    ],
    tableData: [
      {
        name: "Aodume",
        contact: "68",
        crime: "6.1%",
        contrast: "3",
        cosmicMisalation: "0 Planetal Carrey",
        value: "18",
      },
      {
        name: "Aoluase",
        contact: "127",
        crime: "1.7%",
        contrast: "9",
        cosmicMisalation: "Post Cagitor",
        value: "13.56%",
      },
    ],
  }

  useEffect(() => {
    // Load dashboard data from localStorage or API
    const savedData = localStorage.getItem("dashboardData")
    if (savedData) {
      setDashboardData(JSON.parse(savedData))
    } else {
      setDashboardData(sampleData)
    }
  }, [])

  const sidebarItems = [
    { icon: "📊", label: "Resümé", active: false },
    { icon: "🔄", label: "Resend", active: false },
    { icon: "⭐", label: "Astern", active: false },
    { icon: "📈", label: "Raymus", active: true },
    { icon: "📋", label: "Cgrattails", active: false },
    { icon: "💎", label: "Esyret", active: false },
    { icon: "💰", label: "Dollors", active: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/")} className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Frapet</h1>
          <div className="flex items-center gap-4 ml-8">
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTab === "Output" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setSelectedTab("Output")}
            >
              Output*
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">F</span>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800/30 backdrop-blur-sm border-r border-gray-700/50 p-4">
          <nav className="space-y-2">
            {sidebarItems.map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active ? "bg-gray-700/50 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="mt-8 pt-4 border-t border-gray-700/50">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">T</span>
              </div>
              <span className="text-gray-300">Tomas</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Bar Chart */}
            <BarChart data={dashboardData?.barChart || []} title="Orde of Aotlions" />

            {/* Donut Chart */}
            <DonutChart data={dashboardData?.donutChart || []} title="Handy Gancet" centerValue="60.12" />

            {/* Line Chart */}
            <LineChart data={dashboardData?.lineChart || []} title="The Pime" />

            {/* Multi-line Chart */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Wertigament</h3>
                <button className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="h-32 relative">
                <svg className="w-full h-full">
                  <defs>
                    <linearGradient id="multiGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="multiGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="none"
                    stroke="url(#multiGradient1)"
                    strokeWidth="2"
                    points="0,80 20,60 40,70 60,50 80,40 100,30"
                  />
                  <polyline
                    fill="none"
                    stroke="url(#multiGradient2)"
                    strokeWidth="2"
                    points="0,90 20,75 40,85 60,65 80,55 100,45"
                  />
                </svg>
              </div>
            </div>

            {/* Complex Chart */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Redghoarts</h3>
                <button className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="h-32 flex items-end justify-between gap-1">
                {[65, 45, 80, 35, 90, 25, 70, 55].map((height, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div
                      className="w-3 bg-gradient-to-t from-purple-600 to-pink-500 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                    <div
                      className="w-3 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t"
                      style={{ height: `${height * 0.7}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Another Line Chart */}
            <LineChart data={dashboardData?.lineChart || []} title="Tou Lair" />
          </div>

          {/* Data Table */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
            <div className="p-4 border-b border-gray-700/50">
              <h3 className="text-white font-medium">Data Overview</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Contact Street
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Crime
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Contrast
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Cosmic Misalation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {dashboardData?.tableData?.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-700/20">
                      <td className="px-4 py-3 text-sm text-white">{row.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{row.contact}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{row.crime}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{row.contrast}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{row.cosmicMisalation}</td>
                      <td className="px-4 py-3 text-sm text-white font-medium">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
