import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] File upload:", file.name, "size:", file.size, "type:", file.type)

    // Generate a unique file ID
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // In a real implementation, you would save the file to storage
    // For now, we'll just return the file info
    const fileInfo = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }

    return NextResponse.json(fileInfo)
  } catch (error) {
    console.error("[v0] Upload API error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
