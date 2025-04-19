"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface AudioPlayerProps {
  audioUrl: string | null
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioUrl) {
      // Clean up previous audio instance
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener("timeupdate", updateTime)
        audioRef.current.removeEventListener("loadedmetadata", updateMetadata)
      }

      // Create new audio element
      audioRef.current = new Audio(audioUrl)
      
      // Set up event listeners
      audioRef.current.addEventListener("loadedmetadata", updateMetadata)
      audioRef.current.addEventListener("timeupdate", updateTime)
      audioRef.current.addEventListener("ended", () => setIsPlaying(false))

      // Initialize duration
      updateMetadata()
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener("timeupdate", updateTime)
        audioRef.current.removeEventListener("loadedmetadata", updateMetadata)
      }
    }
  }, [audioUrl])

  const updateMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0)
    }
  }

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const togglePlayPause = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        await audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } catch (error) {
      console.error("Audio playback failed:", error)
    }
  }

  const handleSliderChange = (value: number[]) => {
    const newTime = value[0]
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-gray-50 p-4 rounded-xl">
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlayPause}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-200"
          disabled={!audioUrl}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>

        <div className="flex-1">
          <Slider 
            value={[currentTime]} 
            max={duration} 
            step={1} 
            onValueChange={handleSliderChange} 
            className="my-1.5"
            disabled={!audioUrl}
          />

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