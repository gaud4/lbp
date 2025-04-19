"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface AudioPlayerProps {
  audioData: string | null
}

export default function AudioPlayer({ audioData }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  useEffect(() => {
    // Cleanup previous audio and URL
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.removeEventListener("timeupdate", updateTime)
      audioRef.current.removeEventListener("loadedmetadata", updateMetadata)
    }
    if (blobUrl) URL.revokeObjectURL(blobUrl)

    if (audioData) {
      // Convert base64 to blob URL
      const byteString = atob(audioData.split(',')[1])
      const mimeType = audioData.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: mimeType })
      const url = URL.createObjectURL(blob)
      setBlobUrl(url)

      // Create new audio instance
      const audio = new Audio(url)
      audioRef.current = audio

      // Set up event listeners
      audio.addEventListener('loadedmetadata', updateMetadata)
      audio.addEventListener('timeupdate', updateTime)
      audio.addEventListener('ended', () => setIsPlaying(false))

      // Initialize duration
      updateMetadata()

      return () => {
        audio.pause()
        URL.revokeObjectURL(url)
        audio.removeEventListener("timeupdate", updateTime)
        audio.removeEventListener("loadedmetadata", updateMetadata)
      }
    }
  }, [audioData])

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
      console.error("Audio playback error:", error)
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
          disabled={!audioData}
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
            disabled={!audioData}
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