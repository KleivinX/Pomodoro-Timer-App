"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Check, X, ListTodo, ChevronDown, ChevronUp } from "lucide-react"
import { recordTaskCompletion } from "@/lib/activity-tracker"

interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date(),
      }
      setTasks([...tasks, task])
      setNewTask("")
    }
  }

  const toggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task && !task.completed) {
      // Only record when completing a task (not uncompleting)
      recordTaskCompletion()
    }
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask()
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length
  const totalCount = tasks.length

  return (
    <Card className="game-card p-6 border-0">
      <div className="space-y-4">
        {/* Header */}
        <div
          className="flex items-center justify-between cursor-pointer group transition-all duration-300 hover:bg-muted/20 rounded-lg p-2 -m-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <ListTodo className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:scale-110" />
            <h3 className="font-semibold text-foreground transition-colors duration-300">Tasks</h3>
            {totalCount > 0 && (
              <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-full transition-all duration-300 group-hover:bg-muted">
                {completedCount}/{totalCount}
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
          <div className="space-y-4">
            {/* Add Task Input */}
            <div className="flex gap-2 slide-in-up">
              <Input
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
              />
              <Button
                onClick={addTask}
                size="sm"
                className="px-3 btn-smooth hover:rotate-90 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Task List */}
            {tasks.length > 0 && (
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 group ${
                      task.completed
                        ? "bg-muted/50 border-muted scale-95 opacity-75"
                        : "bg-background/50 border-border hover:bg-muted/30 hover:scale-[1.02] hover:shadow-md"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTask(task.id)}
                      className={`p-1 h-6 w-6 rounded-full border-2 transition-all duration-300 btn-smooth ${
                        task.completed
                          ? "bg-green-500 border-green-500 text-white hover:bg-green-600 scale-110"
                          : "border-muted-foreground hover:border-green-500 hover:scale-110"
                      }`}
                    >
                      <Check
                        className={`h-3 w-3 transition-all duration-300 ${
                          task.completed ? "scale-100 rotate-0" : "scale-0 rotate-180"
                        }`}
                      />
                    </Button>

                    <span
                      className={`flex-1 text-sm transition-all duration-500 ${
                        task.completed ? "text-muted-foreground line-through transform scale-95" : "text-foreground"
                      }`}
                    >
                      {task.text}
                    </span>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="p-1 h-6 w-6 text-muted-foreground hover:text-destructive transition-all duration-300 hover:scale-110 hover:rotate-90 opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground scale-in">
                <ListTodo className="h-8 w-8 mx-auto mb-2 opacity-50 float" />
                <p className="text-sm">No tasks yet. Add one to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
