"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(120) // Mock duration in seconds
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Create audio element for demo purposes
    audioRef.current = new Audio("/placeholder.mp3")

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    } else {
      audioRef.current.play().catch(() => {
        // Handle play error (often happens when audio isn't loaded)
        console.log("Audio playback failed")
      })

      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime((prev) => {
            // For demo purposes, loop back to start when reaching end
            if (prev >= duration) return 0
            return prev + 1
          })
        }
      }, 1000)
    }

    setIsPlaying(!isPlaying)
  }

  const handleSliderChange = (value: number[]) => {
    const newTime = value[0]
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="bg-gray-50 p-4 rounded-xl">
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlayPause}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>

        <div className="flex-1">
          <Slider value={[currentTime]} max={duration} step={1} onValueChange={handleSliderChange} className="my-1.5" />

          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <Volume2 className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  )
}

