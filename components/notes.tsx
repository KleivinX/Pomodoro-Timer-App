"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { FileText, ChevronDown, ChevronUp, Plus, Download, Trash2, Edit3 } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("pomodoro-notes-multiple")
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }))
        setNotes(parsedNotes)
      } catch (error) {
        console.error("Failed to parse saved notes:", error)
      }
    }
  }, [])

  // Auto-save notes to localStorage
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("pomodoro-notes-multiple", JSON.stringify(notes))
    }
  }, [notes])

  const createNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return

    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setNotes((prev) => [newNote, ...prev])
    setNewNoteTitle("")
    setNewNoteContent("")
    setIsCreating(false)
  }

  const updateNote = (id: string, title: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, title: title.trim(), content: content.trim(), updatedAt: new Date() } : note,
      ),
    )
    setEditingNote(null)
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  const downloadNote = (note: Note) => {
    const content = `${note.title}\n${"=".repeat(note.title.length)}\n\nCreated: ${note.createdAt.toLocaleString()}\nLast Updated: ${note.updatedAt.toLocaleString()}\n\n${note.content}`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${note.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
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
            {notes.length > 0 && (
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full transition-all duration-300 group-hover:bg-muted">
                {notes.length} note{notes.length !== 1 ? "s" : ""}
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
            isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-4 slide-in-up">
            <div className="flex justify-between items-center">
              <Button
                onClick={() => setIsCreating(!isCreating)}
                size="sm"
                variant="outline"
                className="gap-2 bg-transparent btn-smooth transition-all duration-300"
              >
                <Plus className="h-3 w-3" />
                New Note
              </Button>
            </div>

            {isCreating && (
              <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                <Input
                  placeholder="Note title..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="transition-all duration-300 focus:scale-[1.02]"
                />
                <Textarea
                  placeholder="Write your note content..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="min-h-24 resize-none transition-all duration-300 focus:scale-[1.02]"
                />
                <div className="flex gap-2 justify-end">
                  <Button onClick={() => setIsCreating(false)} size="sm" variant="ghost">
                    Cancel
                  </Button>
                  <Button onClick={createNote} size="sm" disabled={!newNoteTitle.trim() || !newNoteContent.trim()}>
                    Create Note
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {notes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No notes yet. Create your first note!</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="border rounded-xl p-5 bg-background/50">
                    {editingNote === note.id ? (
                      <EditNoteForm note={note} onSave={updateNote} onCancel={() => setEditingNote(null)} />
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">{note.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{note.content}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              onClick={() => setEditingNote(note.id)}
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => downloadNote(note)}
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => deleteNote(note.id)}
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Updated {formatDate(note.updatedAt)}</span>
                          <span>{note.content.length} characters</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function EditNoteForm({
  note,
  onSave,
  onCancel,
}: {
  note: Note
  onSave: (id: string, title: string, content: string) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onSave(note.id, title, content)
    }
  }

  return (
    <div className="space-y-3">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} className="font-medium" />
      <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-24 resize-none" />
      <div className="flex gap-2 justify-end">
        <Button onClick={onCancel} size="sm" variant="ghost">
          Cancel
        </Button>
        <Button onClick={handleSave} size="sm" disabled={!title.trim() || !content.trim()}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}
