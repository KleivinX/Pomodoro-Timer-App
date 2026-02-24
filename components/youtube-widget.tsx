"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  X,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Plus,
  Link,
  ExternalLink,
  AlertCircle,
  Music,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

type PlayerState = "loading" | "ready" | "error" | "blocked"

export function YouTubeWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState([50])
  const [currentVideo, setCurrentVideo] = useState(0)
  const [customUrl, setCustomUrl] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customVideoId, setCustomVideoId] = useState<string | null>(null)
  const [isCustomVideo, setIsCustomVideo] = useState(false)
  const [playerState, setPlayerState] = useState<PlayerState>("loading")
  const [loadTimeout, setLoadTimeout] = useState(false)

  const playlists = [
    { name: "Lo-fi Focus", id: "jfKfPfyJRdk", emoji: "🎵" },
    { name: "Rain Sounds", id: "mPZkdNFkNps", emoji: "🌧️" },
    { name: "Piano Focus", id: "lTRiuFIWV54", emoji: "🎹" },
    { name: "Nature Sounds", id: "UfcAVejslrU", emoji: "🌊" },
  ]

  const extractVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
      /youtu\.be\/([^&\n?#]+)/,
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match?.[1]) return match[1]
    }
    return null
  }

  // Detect if player is blocked after timeout
  useEffect(() => {
    if (isOpen && playerState === "loading") {
      const timer = setTimeout(() => {
        setLoadTimeout(true)
        setPlayerState("blocked")
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, playerState])

  // Reset timeout when video changes
  useEffect(() => {
    setLoadTimeout(false)
    setPlayerState("loading")
  }, [currentVideo, isCustomVideo, customVideoId])

  const handleIframeLoad = useCallback(() => {
    // Give it a moment to actually initialize
    setTimeout(() => {
      if (!loadTimeout) {
        setPlayerState("ready")
      }
    }, 2000)
  }, [loadTimeout])

  const toggleWidget = useCallback(() => {
    setIsOpen((prev) => !prev)
    if (!isOpen) {
      setIsMinimized(false)
    }
  }, [isOpen])

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    setVolume(newVolume)
    if (newVolume[0] === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }, [isMuted])

  const changeVideo = useCallback(
    (direction: "prev" | "next") => {
      if (isCustomVideo) {
        setIsCustomVideo(false)
        setCurrentVideo(0)
      } else {
        const newIndex =
          direction === "next"
            ? (currentVideo + 1) % playlists.length
            : (currentVideo - 1 + playlists.length) % playlists.length
        setCurrentVideo(newIndex)
      }
      setIsPlaying(true)
    },
    [currentVideo, playlists.length, isCustomVideo],
  )

  const handleCustomUrl = useCallback(() => {
    const videoId = extractVideoId(customUrl)
    if (videoId) {
      setCustomVideoId(videoId)
      setIsCustomVideo(true)
      setIsPlaying(true)
      setShowCustomInput(false)
      setCustomUrl("")
    }
  }, [customUrl])

  const getCurrentVideoId = () => {
    if (isCustomVideo && customVideoId) return customVideoId
    return playlists[currentVideo]?.id
  }

  const currentVideoId = getCurrentVideoId()

  const getCurrentVideoName = () => {
    if (isCustomVideo) return "Custom Video"
    return playlists[currentVideo]?.name || "Unknown"
  }

  const openInYouTube = () => {
    const url = isCustomVideo
      ? `https://www.youtube.com/watch?v=${customVideoId}`
      : `https://www.youtube.com/watch?v=${playlists[currentVideo]?.id}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const openPlaylistInYouTubeMusic = () => {
    window.open("https://music.youtube.com/playlist?list=RDCLAK5uy_mfut9V_o1n9nVG_m5yZ3ztCif29AHUffI", "_blank", "noopener,noreferrer")
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={toggleWidget}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg bg-accent hover:bg-accent/90 text-white border-0"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Music className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mini Player (when minimized but open) */}
      {isOpen && isMinimized && (
        <div className="fixed bottom-6 left-24 z-40">
          <Card className="border-2 border-border bg-card shadow-lg p-3 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium truncate max-w-32">{getCurrentVideoName()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => changeVideo("prev")}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => changeVideo("next")}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsMinimized(false)}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Full Player Panel */}
      <div
        className={`fixed bottom-24 left-6 z-40 w-80 transition-all duration-200 ease-out ${
          isOpen && !isMinimized
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
        }`}
      >
        <Card className="border-2 border-border bg-card shadow-xl">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                <span className="font-semibold text-sm">Focus Music</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="h-8 w-8 p-0 hover:bg-muted/50"
                  title="Add custom YouTube link"
                >
                  <Link className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="h-8 w-8 p-0 hover:bg-muted/50"
                  title="Minimize"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleWidget}
                  className="h-8 w-8 p-0 hover:bg-muted/50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Custom URL Input */}
            {showCustomInput && (
              <div className="mb-4 space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste YouTube URL..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && customUrl) handleCustomUrl()
                    }}
                  />
                  <Button size="sm" onClick={handleCustomUrl} disabled={!customUrl} className="px-3">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Player Content */}
            <div className="space-y-4">
              {/* YouTube Embed with Error Handling */}
              <div className="rounded-xl overflow-hidden bg-muted/20 relative">
                {playerState === "blocked" || playerState === "error" ? (
                  <div className="h-48 flex flex-col items-center justify-center p-4 text-center">
                    <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium mb-1">Player unavailable</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Try enabling cookies or disabling tracker blocking
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openPlaylistInYouTubeMusic}
                      className="gap-2 bg-transparent"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in YouTube Music
                    </Button>
                  </div>
                ) : (
                  <>
                    <iframe
                      key={`${currentVideoId}-${isCustomVideo}`}
                      src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=${isPlaying ? 1 : 0}&loop=1&playlist=${currentVideoId}&rel=0&modestbranding=1`}
                      width="100%"
                      height="180"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="rounded-xl"
                      onLoad={handleIframeLoad}
                    />
                    {playerState === "loading" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 rounded-xl">
                        <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-2" />
                        <p className="text-xs text-muted-foreground">Loading player...</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Track Info */}
              <div className="bg-muted/30 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{getCurrentVideoName()}</p>
                  <p className="text-xs text-muted-foreground">Focus Music</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={openInYouTube}
                  title="Open in YouTube"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => changeVideo("prev")}
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 bg-accent hover:bg-accent/90 text-white rounded-full"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => changeVideo("next")}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={isMuted ? [0] : volume}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-8 font-mono">
                  {isMuted ? 0 : volume[0]}%
                </span>
              </div>

              {/* Quick Playlists */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Quick Access</p>
                <div className="grid grid-cols-2 gap-2">
                  {playlists.map((playlist, index) => (
                    <Button
                      key={playlist.id}
                      variant="outline"
                      size="sm"
                      className={`text-xs h-8 bg-transparent ${
                        !isCustomVideo && currentVideo === index
                          ? "bg-red-500/10 border-red-500/30"
                          : ""
                      }`}
                      onClick={() => {
                        setCurrentVideo(index)
                        setIsCustomVideo(false)
                        setIsPlaying(true)
                      }}
                    >
                      {playlist.emoji} {playlist.name}
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
