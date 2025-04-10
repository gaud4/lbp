"use client"

import { useState } from "react"
import { Play, Download, Trash2, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface TextEntry {
    id: string
    text: string
    title: string
    date: string
    time: string
    duration: string
}

export default function TextProcessor() {
    const [textInput, setTextInput] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [audioGenerated, setAudioGenerated] = useState(false)
    const [saveAudio, setSaveAudio] = useState(true)
    const [currentTime, setCurrentTime] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [pastEntries, setPastEntries] = useState<TextEntry[]>([
        {
            id: "1",
            text: "Annual report summary with key financial highlights and future projections...",
            title: "Annual Report Notes",
            date: "2023-04-01",
            time: "12:34",
            duration: "1:45",
        },
        {
            id: "2",
            text: "Project proposal for the new marketing campaign targeting Gen Z audience...",
            title: "Marketing Campaign",
            date: "2023-03-28",
            time: "05:21",
            duration: "2:12",
        },
        {
            id: "3",
            text: "Meeting notes from the product team discussion about upcoming features...",
            title: "Product Meeting Notes",
            date: "2023-03-25",
            time: "03:45",
            duration: "3:20",
        },
        {
            id: "4",
            text: "Research findings on consumer behavior in the post-pandemic market...",
            title: "Market Research",
            date: "2023-03-20",
            time: "18:12",
            duration: "4:05",
        },
    ])

    const handleGenerateAudio = () => {
        if (!textInput.trim()) return

        setIsGenerating(true)

        // Simulate audio generation
        setTimeout(() => {
            setIsGenerating(false)
            setAudioGenerated(true)

            if (saveAudio) {
                const newEntry: TextEntry = {
                    id: Date.now().toString(),
                    text: textInput,
                    title: `Text Entry ${pastEntries.length + 1}`,
                    date: new Date().toISOString().split("T")[0],
                    time: new Date().toTimeString().split(" ")[0].substring(0, 5),
                    duration: "2:00",
                }

                setPastEntries([newEntry, ...pastEntries])
            }
        }, 1500)
    }

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    const handleDelete = (id: string) => {
        setPastEntries(pastEntries.filter((entry) => entry.id !== id))
    }

    const handleClearCurrent = () => {
        setAudioGenerated(false)
        setTextInput("")
        setCurrentTime(0)
        setIsPlaying(false)
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

                    {audioGenerated && (
                        <Card className="p-6 shadow-md rounded-xl mb-6">
                            <h3 className="text-xl font-semibold mb-4">Audio Generated</h3>

                            <div className="flex items-center space-x-4 mb-4">
                                <Button
                                    onClick={handlePlayPause}
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600"
                                >
                                    <Play className={`h-6 w-6 ${isPlaying ? "hidden" : "block"}`} />
                                    <div className={`h-4 w-4 rounded-sm bg-purple-600 ${isPlaying ? "block" : "hidden"}`}></div>
                                </Button>

                                <div className="flex-1">
                                    <Slider
                                        value={[currentTime]}
                                        max={120}
                                        step={1}
                                        onValueChange={(value) => setCurrentTime(value[0])}
                                        className="cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>
                                            {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, "0")}
                                        </span>
                                        <span>2:00</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-purple-200 hover:bg-purple-50 text-purple-700"
                                    onClick={() => { }}
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
                                                {entry.date} • {entry.time}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{entry.text}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="ghost" className="h-8 px-2 text-xs">
                                                <Play className="h-3 w-3 mr-1" />
                                                Play
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-8 px-2 text-xs">
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

                        {pastEntries.length > 0 && (
                            <div className="flex justify-center mt-4">
                                <div className="flex space-x-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                        &lt;
                                    </Button>
                                    <div className="h-1 w-24 bg-gray-200 rounded-full self-center">
                                        <div className="h-1 w-6 bg-purple-500 rounded-full"></div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                        &gt;
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}

