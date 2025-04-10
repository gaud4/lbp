"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analyzeFacialEmotion } from "@/lib/emotion-analysis"
import EmotionChart from "@/components/emotion-chart"
import { Camera, Upload } from "lucide-react"

export default function FacialAnalysisPage() {
    const [image, setImage] = useState<string | null>(null)
    const [analysis, setAnalysis] = useState<null | {
        emotions: { emotion: string; score: number }[]
        dominantEmotion: string
        confidence: number
    }>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isCapturing, setIsCapturing] = useState(false)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setImage(event.target?.result as string)
                setAnalysis(null)
            }
            reader.readAsDataURL(file)
        }
    }

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                setIsCapturing(true)
            }
        } catch (err) {
            console.error("Error accessing camera:", err)
        }
    }

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d")
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth
                canvasRef.current.height = videoRef.current.videoHeight
                context.drawImage(videoRef.current, 0, 0)

                const capturedImage = canvasRef.current.toDataURL("image/png")
                setImage(capturedImage)
                setAnalysis(null)

                // Stop the camera stream
                const stream = videoRef.current.srcObject as MediaStream
                stream.getTracks().forEach((track) => track.stop())
                setIsCapturing(false)
            }
        }
    }

    const handleAnalyze = async () => {
        if (!image) return

        setIsAnalyzing(true)
        try {
            const result = await analyzeFacialEmotion(image)
            setAnalysis(result)
        } catch (error) {
            console.error("Error analyzing facial expression:", error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 container py-8">
                <h1 className="text-3xl font-bold mb-6">Facial Emotion Analysis</h1>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                {isCapturing ? (
                                    <div className="space-y-4">
                                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                        </div>
                                        <Button onClick={captureImage} className="w-full">
                                            Capture Photo
                                        </Button>
                                    </div>
                                ) : image ? (
                                    <div className="space-y-4">
                                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                                            <img
                                                src={image || "/placeholder.svg"}
                                                alt="Uploaded image"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1">
                                                <Upload className="w-4 h-4 mr-2" />
                                                Change Image
                                            </Button>
                                            <Button onClick={startCamera} variant="outline" className="flex-1">
                                                <Camera className="w-4 h-4 mr-2" />
                                                Use Camera
                                            </Button>
                                        </div>
                                        <Button
                                            onClick={handleAnalyze}
                                            className="w-full bg-purple-600 hover:bg-purple-700"
                                            disabled={isAnalyzing}
                                        >
                                            {isAnalyzing ? "Analyzing..." : "Analyze Facial Expression"}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div
                                            className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={startCamera}
                                        >
                                            <p className="text-gray-500 mb-4">Click here to use your camera or upload an image</p>
                                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        fileInputRef.current?.click()
                                                    }}
                                                    variant="outline"
                                                    className="flex items-center"
                                                >
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Upload Image
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        startCamera()
                                                    }}
                                                    variant="outline"
                                                    className="flex items-center"
                                                >
                                                    <Camera className="w-4 h-4 mr-2" />
                                                    Use Camera
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                                <canvas ref={canvasRef} className="hidden" />
                            </CardContent>
                        </Card>
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
                                    <p className="text-gray-500">
                                        Upload or capture an image and click analyze to see emotion analysis results
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
