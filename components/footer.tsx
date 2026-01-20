"use client"

import { Card } from "@/components/ui/card"
import { Clock, Target, Monitor, Apple, Smartphone } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Feature Explanations */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Pomodoro Timer Explanation */}
          <Card className="p-6 bg-background/50 backdrop-blur-sm border rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
                <Clock className="h-6 w-6 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground">🍅 Pomodoro Timer</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The Pomodoro Technique is a time management method that uses a timer to break work into focused intervals, 
                  traditionally 25 minutes, separated by short breaks. This technique helps improve focus, reduce mental 
                  fatigue, and boost productivity by working with your brain's natural attention span.
                </p>
              </div>
            </div>
          </Card>

          {/* Habit Tracker Explanation */}
          <Card className="p-6 bg-background/50 backdrop-blur-sm border rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                <Target className="h-6 w-6 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground">🥣 Habit Tracker</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track your daily habits with our beautiful circular tracker inspired by mindful journaling. 
                  Build consistency, visualize your progress throughout the month, and develop lasting positive 
                  habits. The visual representation helps you stay motivated and accountable to your goals.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Coming Soon Section */}
        <Card className="p-8 bg-gradient-to-r from-primary/5 via-background to-primary/5 backdrop-blur-sm border rounded-2xl mb-10">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-foreground">🚀 Coming Soon</h3>
              <p className="text-muted-foreground">Download SaladTimer on all your devices!</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {/* Windows */}
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-muted/50 border opacity-60 cursor-not-allowed">
                <Monitor className="h-5 w-5" />
                <span className="font-medium">🪟 Windows</span>
              </div>
              
              {/* Mac */}
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-muted/50 border opacity-60 cursor-not-allowed">
                <Apple className="h-5 w-5" />
                <span className="font-medium">🍎 macOS</span>
              </div>
              
              {/* iOS */}
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-muted/50 border opacity-60 cursor-not-allowed">
                <Smartphone className="h-5 w-5" />
                <span className="font-medium">📱 iOS</span>
              </div>
              
              {/* Android */}
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-muted/50 border opacity-60 cursor-not-allowed">
                <Smartphone className="h-5 w-5" />
                <span className="font-medium">🤖 Android</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Stay tuned for native app releases! In the meantime, install the web app using the button in the header.
            </p>
          </div>
        </Card>

        {/* Made by Section */}
        <div className="text-center py-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Made with ❤️ by <span className="font-semibold text-foreground">Kleivin</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
