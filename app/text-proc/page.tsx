"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Download, Trash2, Volume2, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"

interface TextEntry {
    id: string
    text: string
    title: string
    date: string
    time: string
    duration: string
    audioData?: string  // Store audio as base64 data URL
}

export default function TextProcessor() {
    const [textInput, setTextInput] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [saveAudio, setSaveAudio] = useState(true)
    const [currentTime, setCurrentTime] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [pastEntries, setPastEntries] = useState<TextEntry[]>([])
    const [currentAudioData, setCurrentAudioData] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    
    const API_URL = "http://localhost:5000"

    useEffect(() => {
        const savedEntries = localStorage.getItem("textEntries")
        if (savedEntries) setPastEntries(JSON.parse(savedEntries))
        return () => cleanupAudio()
    }, [])

    useEffect(() => {
        localStorage.setItem("textEntries", JSON.stringify(pastEntries))
    }, [pastEntries])

    const cleanupAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current = null
        }
        if (currentAudioData) URL.revokeObjectURL(convertDataToBlobUrl(currentAudioData))
    }

    const convertBlobToDataURL = async (blob: Blob): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(blob)
        })
    }

    const convertDataToBlobUrl = (dataUrl: string): string => {
        const byteString = atob(dataUrl.split(',')[1])
        const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0]
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
        }
        const blob = new Blob([ab], { type: mimeType })
        return URL.createObjectURL(blob)
    }

    const handleGenerateAudio = async () => {
        if (!textInput.trim()) {
            toast.warning("Please enter some text")
            return
        }

        setIsGenerating(true)
        cleanupAudio()

        try {
            const response = await fetch(`${API_URL}/api/tts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: textInput }),
            })

            if (!response.ok) throw new Error(await response.text())

            const audioBlob = await response.blob()
            const audioData = await convertBlobToDataURL(audioBlob)
            const blobUrl = convertDataToBlobUrl(audioData)
            const audio = new Audio(blobUrl)

            audioRef.current = audio
            setCurrentAudioData(audioData)

            audio.addEventListener("timeupdate", () => 
                setCurrentTime(audio.currentTime)
            )
            audio.addEventListener("ended", () => {
                setIsPlaying(false)
                setCurrentTime(0)
            })

            if (saveAudio) {
                const newEntry: TextEntry = {
                    id: Date.now().toString(),
                    text: textInput,
                    title: `Text Entry ${pastEntries.length + 1}`,
                    date: new Date().toISOString().split("T")[0],
                    time: new Date().toTimeString().substring(0, 5),
                    duration: formatDuration(audio.duration),
                    audioData
                }
                setPastEntries(prev => [newEntry, ...prev])
            }

            toast.success("Audio generated successfully")
        } catch (error) {
            console.error("Error generating audio:", error)
            toast.error("Failed to generate audio")
        } finally {
            setIsGenerating(false)
        }
    }

    const handlePlayPause = () => {
        if (!audioRef.current) return
        isPlaying ? audioRef.current.pause() : audioRef.current.play()
        setIsPlaying(!isPlaying)
    }

    const handleDelete = (id: string) => {
        setPastEntries(prev => {
            const updated = prev.filter(entry => entry.id !== id)
            localStorage.setItem("textEntries", JSON.stringify(updated))
            return updated
        })
        toast.success("Entry deleted")
    }

    const handleClearCurrent = () => {
        cleanupAudio()
        setCurrentAudioData(null)
        setTextInput("")
        setCurrentTime(0)
        setIsPlaying(false)
    }

    const handleDownload = (audioData?: string, title?: string) => {
        if (!audioData) return

        try {
            const blobUrl = convertDataToBlobUrl(audioData)
            const a = document.createElement("a")
            a.href = blobUrl
            a.download = `${title || 'audio'}.wav`
            document.body.appendChild(a)
            a.click()
            
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl)
                document.body.removeChild(a)
            }, 100)
        } catch (error) {
            console.error("Download failed:", error)
            toast.error("Failed to download audio")
        }
    }

    const handlePlayEntry = (entry: TextEntry) => {
        if (!entry.audioData) return
        cleanupAudio()

        const blobUrl = convertDataToBlobUrl(entry.audioData)
        const audio = new Audio(blobUrl)
        audioRef.current = audio
        setCurrentAudioData(entry.audioData)

        audio.addEventListener("timeupdate", () => 
            setCurrentTime(audio.currentTime)
        )
        audio.addEventListener("ended", () => setIsPlaying(false))
        
        audio.play()
        setIsPlaying(true)
    }

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-5xl font-bold text-center text-purple-500 mb-2">Text Processor</h1>
            <p className="text-center text-gray-600 mb-12">
                Paste your text or write your notes and get a high-quality audio version in seconds.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Text Input</h2>

                    <Card className="p-6 mb-6 shadow-md rounded-xl">
                        <div className="relative">
                            <Textarea
                                placeholder="Paste your text or write your notes here."
                                className="min-h-[200px] p-4 text-gray-800 border-purple-100 focus:border-purple-300 rounded-lg transition-all"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                            />
                            <div className="absolute -bottom-1 -right-1 w-16 h-16 opacity-20 pointer-events-none">
                                <div className={`w-full h-full rounded-full bg-purple-300 ${isGenerating ? "animate-ping" : ""}`}></div>
                                <Volume2
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-500"
                                    size={24}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center space-x-2">
                                <Switch checked={saveAudio} onCheckedChange={setSaveAudio} id="save-audio" />
                                <label htmlFor="save-audio" className="text-sm text-gray-600">
                                    Save audio output for later
                                </label>
                            </div>

                            <Button
                                onClick={handleGenerateAudio}
                                disabled={!textInput.trim() || isGenerating}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {isGenerating ? (
                                    <>
                                        <span className="mr-2">Generating</span>
                                        <span className="animate-pulse">...</span>
                                    </>
                                ) : (
                                    "Generate Audio"
                                )}
                            </Button>
                        </div>
                    </Card>

                    {currentAudioData && (
                        <Card className="p-6 shadow-md rounded-xl mb-6">
                            <h3 className="text-xl font-semibold mb-4">Audio Generated</h3>

                            <div className="flex items-center space-x-4 mb-4">
                                <Button
                                    onClick={handlePlayPause}
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600"
                                >
                                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                                </Button>

                                <div className="flex-1">
                                    <Slider
                                        value={[currentTime]}
                                        max={audioRef.current?.duration || 0}
                                        step={1}
                                        onValueChange={([value]) => {
                                            if (audioRef.current) {
                                                audioRef.current.currentTime = value
                                                setCurrentTime(value)
                                            }
                                        }}
                                        className="cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>
                                            {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, "0")}
                                        </span>
                                        <span>{formatDuration(audioRef.current?.duration || 0)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-purple-200 hover:bg-purple-50 text-purple-700"
                                    onClick={() => handleDownload(currentAudioData)}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 border-red-200 hover:bg-red-50 text-red-600"
                                    onClick={handleClearCurrent}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Past Text Entries</h2>

                    <Card className="p-6 shadow-md rounded-xl">
                        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                            {pastEntries.map((entry) => (
                                <div key={entry.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-start mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                                            <Volume2 className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{entry.title}</h4>
                                            <p className="text-xs text-gray-500">
                                                {entry.date} • {entry.time} • {entry.duration}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{entry.text}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex space-x-2">
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className="h-8 px-2 text-xs"
                                                onClick={() => handlePlayEntry(entry)}
                                            >
                                                <Play className="h-3 w-3 mr-1" />
                                                Play
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                className="h-8 px-2 text-xs"
                                                onClick={() => handleDownload(entry.audioData, entry.title)}
                                            >
                                                <Download className="h-3 w-3 mr-1" />
                                                Download
                                            </Button>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleDelete(entry.id)}
                                        >
                                            <Trash2 className="h-3 w-3 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {pastEntries.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No saved text entries yet</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}