"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Music, X, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"

export function SpotifyWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleWidget = () => setIsOpen(!isOpen)
  const togglePlayback = () => setIsPlaying(!isPlaying)

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleWidget}
          size="lg"
          className="rounded-full w-14 h-14 shadow-2xl bg-green-500 hover:bg-green-600 text-white border-0 transition-all duration-500 ease-out btn-smooth float"
          style={{
            boxShadow: "0 0 30px rgba(34, 197, 94, 0.4), 0 10px 25px rgba(0, 0, 0, 0.15)",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <div className="transition-all duration-300">
            {isOpen ? <X className="w-6 h-6" /> : <Music className="w-6 h-6" />}
          </div>
        </Button>
      </div>

      {/* Spotify Widget Panel */}
      <div
        className={`fixed bottom-24 right-6 z-40 w-80 transition-all duration-500 ease-out ${
          isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"
        }`}
      >
        <Card className="glass-smooth border backdrop-blur-xl shadow-2xl">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 slide-in-up">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                <span className="font-semibold text-sm">Spotify Player</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleWidget}
                className="h-8 w-8 p-0 hover:bg-muted/50 btn-smooth hover:rotate-90"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Spotify Embed */}
            <div className="space-y-4">
              {/* Focus Music Playlist Embed */}
              <div className="rounded-xl overflow-hidden slide-in-up" style={{ animationDelay: "100ms" }}>
                <iframe
                  src="https://open.spotify.com/embed/playlist/37i9dQZF1DX8NTLI2TtZa6?utm_source=generator&theme=0"
                  width="100%"
                  height="200"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl transition-all duration-300 hover:shadow-lg"
                ></iframe>
              </div>

              {/* Alternative: Custom Player UI (for demonstration) */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-3 slide-in-up" style={{ animationDelay: "200ms" }}>
                <div className="text-center">
                  <p className="font-medium text-sm transition-colors duration-300">Focus Beats</p>
                  <p className="text-xs text-muted-foreground">Lo-fi Hip Hop</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                  <div className="bg-green-500 h-1 rounded-full w-1/3 transition-all duration-1000 ease-out shadow-sm shadow-green-500/50"></div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 btn-smooth hover:scale-125">
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 bg-green-500 hover:bg-green-600 text-white rounded-full btn-smooth glow"
                    onClick={togglePlayback}
                  >
                    <div className="transition-all duration-300">
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </div>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 btn-smooth hover:scale-125">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground transition-colors duration-300 hover:text-foreground" />
                  <div className="flex-1 bg-muted rounded-full h-1 overflow-hidden">
                    <div className="bg-green-500 h-1 rounded-full w-2/3 transition-all duration-300 shadow-sm shadow-green-500/50"></div>
                  </div>
                </div>
              </div>

              {/* Quick Playlists */}
              <div className="space-y-2 slide-in-up" style={{ animationDelay: "300ms" }}>
                <p className="text-xs font-medium text-muted-foreground">Quick Access</p>
                <div className="grid grid-cols-2 gap-2">
                  {["🎵 Focus", "🌧️ Rain", "🎹 Piano", "🎸 Chill"].map((playlist, index) => (
                    <Button
                      key={playlist}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 bg-transparent btn-smooth hover:scale-105"
                      style={{ animationDelay: `${400 + index * 50}ms` }}
                    >
                      {playlist}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
