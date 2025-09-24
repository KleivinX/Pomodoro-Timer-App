"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, X, Volume2, VolumeX, SkipBack, SkipForward, Plus, Link } from "lucide-react"

export function YouTubeWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState([50])
  const [currentVideo, setCurrentVideo] = useState(0)
  const [customUrl, setCustomUrl] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customVideoId, setCustomVideoId] = useState<string | null>(null)
  const [isCustomVideo, setIsCustomVideo] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [playerReady, setPlayerReady] = useState(false)

  const playlists = [
    {
      name: "🎵 Lo-fi Focus",
      id: "jfKfPfyJRdk",
      emoji: "🎵",
    },
    {
      name: "🌧️ Rain Sounds",
      id: "mPZkdNFkNps",
      emoji: "🌧️",
    },
    {
      name: "🎹 Piano Focus",
      id: "lTRiuFIWV54",
      emoji: "🎹",
    },
    {
      name: "🌊 Nature Sounds",
      id: "UfcAVejslrU",
      emoji: "🌊",
    },
  ]

  const extractVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
      /youtu\.be\/([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    return null
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return

      try {
        const data = JSON.parse(event.data)
        console.log("[v0] YouTube message received:", data)

        if (data.event === "onReady") {
          console.log("[v0] YouTube player ready")
          setPlayerReady(true)
          // Set initial volume when player is ready
          setTimeout(() => {
            if (iframeRef.current) {
              const message = {
                event: "command",
                func: "setVolume",
                args: [volume[0]],
              }
              console.log("[v0] Setting initial volume:", message)
              iframeRef.current.contentWindow?.postMessage(JSON.stringify(message), "*")
            }
          }, 1000)
        } else if (data.event === "onStateChange") {
          console.log("[v0] Player state change:", data.info)
          // Handle player state changes
          if (data.info === 1) {
            // Playing
            setIsPlaying(true)
          } else if (data.info === 2) {
            // Paused
            setIsPlaying(false)
          }
        }
      } catch (e) {
        console.log("[v0] Error parsing YouTube message:", e)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [volume])

  const toggleWidget = useCallback(() => setIsOpen(!isOpen), [isOpen])

  const togglePlayback = useCallback(() => {
    if (iframeRef.current && playerReady) {
      const iframe = iframeRef.current
      const message = JSON.stringify({
        event: "command",
        func: isPlaying ? "pauseVideo" : "playVideo",
        args: [],
      })
      iframe.contentWindow?.postMessage(message, "*")
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying, playerReady])

  const toggleMute = useCallback(() => {
    if (iframeRef.current && playerReady) {
      const iframe = iframeRef.current
      const message = JSON.stringify({
        event: "command",
        func: isMuted ? "unMute" : "mute",
        args: [],
      })
      iframe.contentWindow?.postMessage(message, "*")
      setIsMuted(!isMuted)
    }
  }, [isMuted, playerReady])

  const handleVolumeChange = useCallback(
    (newVolume: number[]) => {
      console.log("[v0] Volume change requested:", newVolume[0])
      setVolume(newVolume)
      if (iframeRef.current && playerReady) {
        const iframe = iframeRef.current
        const message = {
          event: "command",
          func: "setVolume",
          args: [newVolume[0]],
        }
        console.log("[v0] Sending volume command:", message)
        iframe.contentWindow?.postMessage(JSON.stringify(message), "*")

        // Also try the alternative format
        setTimeout(() => {
          iframe.contentWindow?.postMessage(`{"event":"command","func":"setVolume","args":[${newVolume[0]}]}`, "*")
        }, 100)
      }
    },
    [playerReady],
  )

  const changeVideo = useCallback(
    (direction: "prev" | "next") => {
      if (isCustomVideo) {
        // If currently playing custom video, switch back to playlists
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
      setPlayerReady(false) // Reset player ready state for new video
    },
    [currentVideo, playlists.length, isCustomVideo],
  )

  const handleCustomUrl = useCallback(() => {
    console.log("[v0] Processing custom URL:", customUrl)
    const videoId = extractVideoId(customUrl)
    console.log("[v0] Extracted video ID:", videoId)

    if (videoId) {
      setCustomVideoId(videoId)
      setIsCustomVideo(true)
      setIsPlaying(false) // Start paused to avoid autoplay issues
      setShowCustomInput(false)
      setCustomUrl("")
      setPlayerReady(false) // Reset player ready state for new video
    } else {
      console.log("[v0] Invalid YouTube URL")
      // Could add user feedback here
    }
  }, [customUrl])

  const getCurrentVideoId = () => {
    if (isCustomVideo && customVideoId) {
      return customVideoId
    }
    return playlists[currentVideo]?.id
  }

  const currentVideoId = getCurrentVideoId()

  const getCurrentVideoName = () => {
    if (isCustomVideo) {
      return "🔗 Custom Video"
    }
    return playlists[currentVideo]?.name || "Unknown"
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleWidget}
          size="lg"
          className="rounded-full w-14 h-14 shadow-2xl bg-red-500 hover:bg-red-600 text-white border-0 transition-all duration-200 ease-out btn-smooth float"
          style={{
            boxShadow: "0 0 30px rgba(239, 68, 68, 0.4), 0 10px 25px rgba(0, 0, 0, 0.15)",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <div className="transition-all duration-150">
            {isOpen ? <X className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </div>
        </Button>
      </div>

      <div
        className={`fixed bottom-24 right-6 z-40 w-80 transition-all duration-200 ease-out ${
          isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"
        }`}
      >
        <Card className="glass-smooth border backdrop-blur-xl shadow-2xl">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                <span className="font-semibold text-sm">YouTube Music</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="h-8 w-8 p-0 hover:bg-muted/50 btn-smooth"
                  title="Add custom YouTube link"
                >
                  <Link className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleWidget}
                  className="h-8 w-8 p-0 hover:bg-muted/50 btn-smooth"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {showCustomInput && (
              <div className="mb-4 space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste YouTube URL here..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && customUrl) {
                        handleCustomUrl()
                      }
                    }}
                  />
                  <Button size="sm" onClick={handleCustomUrl} disabled={!customUrl} className="px-3 btn-smooth">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* YouTube Embed */}
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden">
                <iframe
                  ref={iframeRef}
                  key={`${currentVideoId}-${isCustomVideo}`} // Better key to force re-render
                  src={`https://www.youtube.com/embed/${currentVideoId}?enablejsapi=1&autoplay=0&loop=1&playlist=${currentVideoId}&origin=${typeof window !== "undefined" ? window.location.origin : ""}&rel=0&modestbranding=1`}
                  width="100%"
                  height="200"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="rounded-xl transition-all duration-150 hover:shadow-lg"
                  onLoad={() => {
                    console.log("[v0] YouTube iframe loaded")
                    // Reset player ready state when iframe loads
                    setPlayerReady(false)
                  }}
                ></iframe>
              </div>

              {/* Current Track Info */}
              <div className="bg-muted/30 rounded-xl p-3 text-center">
                <p className="font-medium text-sm">{getCurrentVideoName()}</p>
                <p className="text-xs text-muted-foreground">Focus Music</p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 btn-smooth"
                  onClick={() => changeVideo("prev")}
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full btn-smooth"
                  onClick={togglePlayback}
                  disabled={!playerReady}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 btn-smooth"
                  onClick={() => changeVideo("next")}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 btn-smooth"
                  onClick={toggleMute}
                  disabled={!playerReady}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <Slider
                    value={volume}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={5}
                    className="flex-1"
                    disabled={!playerReady}
                  />
                  <span className="text-xs text-muted-foreground w-8 font-mono">{volume[0]}%</span>
                </div>
                {!playerReady && <p className="text-xs text-muted-foreground text-center">Loading player...</p>}
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
                      className={`text-xs h-8 bg-transparent btn-smooth ${
                        !isCustomVideo && currentVideo === index ? "bg-red-500/10 border-red-500/30" : ""
                      }`}
                      onClick={() => {
                        setCurrentVideo(index)
                        setIsCustomVideo(false)
                        setIsPlaying(true)
                        setPlayerReady(false)
                      }}
                    >
                      {playlist.emoji} {playlist.name.split(" ")[1]}
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
