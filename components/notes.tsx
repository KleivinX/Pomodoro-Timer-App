"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Save, ChevronDown, ChevronUp } from "lucide-react"

export function Notes() {
  const [notes, setNotes] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("pomodoro-notes")
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])

  // Auto-save notes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (notes.trim()) {
        setIsSaving(true)
        localStorage.setItem("pomodoro-notes", notes)
        setLastSaved(new Date())
        setTimeout(() => setIsSaving(false), 500)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [notes])

  const handleSave = () => {
    setIsSaving(true)
    localStorage.setItem("pomodoro-notes", notes)
    setLastSaved(new Date())
    setTimeout(() => setIsSaving(false), 500)
  }

  const formatLastSaved = () => {
    if (!lastSaved) return ""
    const now = new Date()
    const diff = now.getTime() - lastSaved.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Saved just now"
    if (minutes === 1) return "Saved 1 minute ago"
    return `Saved ${minutes} minutes ago`
  }

  return (
    <Card
      className="glass-smooth rounded-2xl p-6 shadow-lg border backdrop-blur-xl slide-in-right"
      style={{ animationDelay: "100ms" }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div
          className="flex items-center justify-between cursor-pointer group transition-all duration-300 hover:bg-muted/20 rounded-lg p-2 -m-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:scale-110" />
            <h3 className="font-semibold text-foreground transition-colors duration-300">Notes</h3>
            {lastSaved && (
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full transition-all duration-300 group-hover:bg-muted">
                {formatLastSaved()}
              </span>
            )}
          </div>
          <div className="transition-transform duration-300">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-out overflow-hidden ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-3 slide-in-up">
            <Textarea
              placeholder="Write your thoughts, ideas, or session reflections..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-32 resize-none transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground transition-colors duration-300">
                {notes.length} characters
              </span>

              <Button
                onClick={handleSave}
                size="sm"
                variant="outline"
                className="gap-2 bg-transparent btn-smooth transition-all duration-300"
                disabled={isSaving}
              >
                <Save className={`h-3 w-3 transition-all duration-300 ${isSaving ? "animate-spin" : ""}`} />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
