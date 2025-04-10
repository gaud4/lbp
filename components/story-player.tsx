"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Save, Volume2, VolumeX } from "lucide-react"

type Story = {
  id: string
  title: string
  prompt: string
  content: string[]
  audioUrl: string
  timestamps: number[]
  createdAt: string
}

type StoryPlayerProps = {
  story: Story
  onSave: () => void
}

export function StoryPlayer({ story, onSave }: StoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [activeLineIndex, setActiveLineIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const storyContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const audio = new Audio()

    // Use a real audio file or handle the case where it doesn't exist
    audio.src = story.audioUrl || "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"
    audioRef.current = audio

    const handleError = (e: Event) => {
      console.error("Audio error:", e)
      setIsPlaying(false)
    }

    audio.addEventListener("error", handleError)

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration)
    })

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime)

      // Find the current line based on timestamps
      const newIndex = story.timestamps.findIndex((timestamp, index) => {
        const nextTimestamp = story.timestamps[index + 1] || Number.POSITIVE_INFINITY
        return audio.currentTime >= timestamp && audio.currentTime < nextTimestamp
      })

      if (newIndex !== -1 && newIndex !== activeLineIndex) {
        setActiveLineIndex(newIndex)

        // Scroll to active line
        const activeLine = document.getElementById(`line-${newIndex}`)
        if (activeLine && storyContainerRef.current) {
          storyContainerRef.current.scrollTop = activeLine.offsetTop - storyContainerRef.current.offsetTop - 100
        }
      }
    })

    audio.addEventListener("ended", () => {
      setIsPlaying(false)
      setCurrentTime(0)
      setActiveLineIndex(0)
    })

    return () => {
      audio.pause()
      audio.removeEventListener("error", handleError)
      audio.src = ""
    }
  }, [story])

  const togglePlayPause = () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          const playPromise = audioRef.current.play()

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Playback started successfully
              })
              .catch((error) => {
                // Auto-play was prevented or there was an error
                console.error("Playback error:", error)
                setIsPlaying(false)
              })
          }
        }
        setIsPlaying(!isPlaying)
      } catch (error) {
        console.error("Toggle play/pause error:", error)
        setIsPlaying(false)
      }
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 1
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
    }
  }

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 bg-gradient-to-r from-purple-500/10 to-teal-500/10">
          <h2 className="text-2xl font-bold mb-1">{story.title}</h2>
          <p className="text-gray-500 text-sm">Based on prompt: "{story.prompt}"</p>
        </div>

        <div ref={storyContainerRef} className="story-text h-[300px] overflow-y-auto p-6">
          {story.content.map((paragraph, index) => (
            <p key={index} id={`line-${index}`} className={activeLineIndex === index ? "active-line" : ""}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="p-6 border-t">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-500 w-10">{formatTime(currentTime)}</span>
            <Slider value={[currentTime]} max={duration} step={0.1} onValueChange={handleSeek} className="flex-1" />
            <span className="text-xs text-gray-500 w-10">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={skipBackward}>
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <Button variant="ghost" size="icon" onClick={skipForward}>
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>

              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-24"
              />

              <Button variant="outline" size="sm" onClick={onSave} className="ml-4">
                <Save className="h-4 w-4 mr-2" />
                Save Story
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
