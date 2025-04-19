"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Upload, ClipboardCopy, Download as DownloadIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function SummarizePage() {
  const [summaryType, setSummaryType] = useState("extractive")
  const [inputMethod, setInputMethod] = useState("text")
  const [textInput, setTextInput] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [summaryLength, setSummaryLength] = useState(30)
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      let res
      if (inputMethod === "text") {
        res = await fetch("http://127.0.0.1:5000/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: textInput,
            percentage: summaryLength,
            method: summaryType,
          }),
        })
      } else if (inputMethod === "pdf" && file) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("method", summaryType)
        formData.append("percentage", summaryLength.toString())

        res = await fetch("http://127.0.0.1:5000/summarize", {
          method: "POST",
          body: formData,
        })
      } else {
        throw new Error("No valid input provided.")
      }

      const data = await res.json()
      if (res.ok) {
        setSummary(data.summary)
      } else {
        setSummary(data.error || "Failed to summarize.")
      }
    } catch (error) {
      console.error("Error summarizing:", error)
      setSummary("Failed to summarize.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      alert("Summary copied to clipboard")
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([summary], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "summary.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Generate Your Summary</h1>
          <p className="text-muted-foreground">Choose your summarization method and input type to get started.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Summarization Options</CardTitle>
            <CardDescription>
              Select the type of summary you want to generate and how you want to input your content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Type Selection */}
            <div className="space-y-3">
              <Label>Summary Type</Label>
              <RadioGroup
                defaultValue="extractive"
                value={summaryType}
                onValueChange={setSummaryType}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div
                  className={cn(
                    "flex items-center space-x-2 rounded-md border p-4 cursor-pointer",
                    summaryType === "extractive" &&
                      "border-violet-600 bg-gradient-to-br from-violet-600/5 via-blue-500/5 to-teal-400/5",
                  )}
                >
                  <RadioGroupItem value="extractive" id="extractive" />
                  <Label htmlFor="extractive" className="cursor-pointer font-normal">
                    <div className="font-medium">Extractive</div>
                    <p className="text-sm text-muted-foreground">Pulls out key sentences from the original text</p>
                  </Label>
                </div>
                <div
                  className={cn(
                    "flex items-center space-x-2 rounded-md border p-4 cursor-pointer",
                    summaryType === "abstractive" &&
                      "border-blue-500 bg-gradient-to-br from-violet-600/5 via-blue-500/5 to-teal-400/5",
                  )}
                >
                  <RadioGroupItem value="abstractive" id="abstractive" />
                  <Label htmlFor="abstractive" className="cursor-pointer font-normal">
                    <div className="font-medium">Abstractive</div>
                    <p className="text-sm text-muted-foreground">Generates new text that captures the essence</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Input Method Selection */}
            <div className="space-y-3">
              <Label>Input Method</Label>
              <Tabs defaultValue="text" value={inputMethod} onValueChange={setInputMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">
                    <FileText className="h-4 w-4 mr-2" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="pdf">
                    <Upload className="h-4 w-4 mr-2" />
                    PDF Upload
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-4">
                  <Textarea
                    placeholder="Paste your text here to summarize..."
                    className="min-h-[200px]"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="pdf" className="mt-4">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-12 text-center">
                    <Upload className="h-8 w-8 mb-4 text-muted-foreground" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Drag and drop your PDF here, or click to browse</p>
                      <p className="text-xs text-muted-foreground">PDF files up to 10MB</p>
                    </div>
                    <Input type="file" accept=".pdf" className="hidden" id="pdf-upload" onChange={handleFileChange} />
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => document.getElementById("pdf-upload")?.click()}
                    >
                      Select PDF
                    </Button>
                    {file && <p className="mt-2 text-sm">Selected: {file.name}</p>}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Summary Length Slider (Extractive Only) */}
            {summaryType === "extractive" && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Summary Length</Label>
                  <span className="text-sm text-muted-foreground">{summaryLength}%</span>
                </div>
                <Slider
                  defaultValue={[30]}
                  max={100}
                  step={5}
                  value={[summaryLength]}
                  onValueChange={(value) => setSummaryLength(value[0])}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Adjust the slider to control how much of the original text is retained in the extractive summary.
                </p>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={
                isGenerating ||
                (inputMethod === "text" && !textInput) ||
                (inputMethod === "pdf" && !file)
              }
              className="w-full bg-gradient-to-r from-violet-600 via-blue-500 to-teal-400 text-white"
            >
              {isGenerating ? "Generating..." : "Generate Summary"}
            </Button>
          </CardContent>
        </Card>

        {/* Summary Output */}
        {summary && (
          <Card>
            <CardHeader>
              <CardTitle>Your Summary</CardTitle>
              <CardDescription>
                {summaryType === "extractive"
                  ? "Key sentences extracted from your text"
                  : "AI-generated summary of your content"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-4">
                <p>{summary}</p>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <ClipboardCopy className="w-4 h-4 mr-1" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <DownloadIcon className="w-4 h-4 mr-1" /> Download
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
