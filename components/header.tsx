"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/saladtimer-logo.png" alt="SaladTimer Logo" className="w-16 h-16" />
          <div>
            <h1 className="text-3xl font-bold text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SaladTimer
            </h1>
            <p className="text-muted-foreground mt-1">Productivity & Self-Improvement</p>
          </div>
        </div>
        <div className="w-10 h-10" />
      </header>
    )
  }

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/saladtimer-logo.png" alt="SaladTimer Logo" className="w-16 h-16" />
        <div>
          <h1 className="text-3xl font-bold text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SaladTimer
          </h1>
          <p className="text-muted-foreground mt-1">Productivity & Self-Improvement</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="rounded-full w-12 h-12 glass hover:bg-muted/50 transition-all duration-150"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </header>
  )
}
