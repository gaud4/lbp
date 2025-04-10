"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analyzeTextEmotion } from "@/lib/emotion-analysis"
import EmotionChart from "@/components/emotion-chart"

export default function TextAnalysisPage() {
    const [text, setText] = useState("")
    const [analysis, setAnalysis] = useState<null | {
        emotions: { emotion: string; score: number }[]
        dominantEmotion: string
        confidence: number
    }>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const handleAnalyze = async () => {
        if (!text.trim()) return

        setIsAnalyzing(true)
        try {
            const result = await analyzeTextEmotion(text)
            setAnalysis(result)
        } catch (error) {
            console.error("Error analyzing text:", error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 container py-8">
                <h1 className="text-3xl font-bold mb-6">Text Emotion Analysis</h1>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <Textarea
                            placeholder="Enter text to analyze emotions (minimum 20 characters for accurate results)..."
                            className="min-h-[200px] text-base"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Button
                            onClick={handleAnalyze}
                            className="mt-4 bg-purple-600 hover:bg-purple-700"
                            disabled={text.length < 20 || isAnalyzing}
                        >
                            {isAnalyzing ? "Analyzing..." : "Analyze Emotions"}
                        </Button>
                    </div>

                    <div>
                        {analysis ? (
                            <Tabs defaultValue="chart">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="chart">Emotion Chart</TabsTrigger>
                                    <TabsTrigger value="summary">Summary</TabsTrigger>
                                </TabsList>
                                <TabsContent value="chart">
                                    <Card>
                                        <CardContent className="pt-6">
                                            <EmotionChart emotions={analysis.emotions} />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="summary">
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="font-medium text-lg">Dominant Emotion</h3>
                                                    <p className="text-2xl font-bold text-purple-600">{analysis.dominantEmotion}</p>
                                                    <p className="text-sm text-gray-500">Confidence: {Math.round(analysis.confidence * 100)}%</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-lg">All Emotions</h3>
                                                    <ul className="space-y-2 mt-2">
                                                        {analysis.emotions.map((item) => (
                                                            <li key={item.emotion} className="flex justify-between">
                                                                <span>{item.emotion}</span>
                                                                <span className="font-medium">{Math.round(item.score * 100)}%</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <div className="h-full flex items-center justify-center border rounded-lg bg-gray-50 p-8">
                                <div className="text-center">
                                    <p className="text-gray-500">Enter text and click analyze to see emotion analysis results</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
