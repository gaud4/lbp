"use client"

import { useState, useEffect } from "react"
import { Download, Trash2, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import DocumentUploader from "@/components/document-uploader"
import AudioPlayer from "@/components/audio-player"
import PastDocumentsList from "@/components/past-documents-list"
import { toast } from "sonner"

interface Document {
  id: string
  name: string
  date: string
  duration: string
  audioUrl: string
}

const API_URL = "http://localhost:5000" // Update with your backend URL

export default function DocumentProcessor() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [saveAudio, setSaveAudio] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pastDocuments, setPastDocuments] = useState<Document[]>([])

  useEffect(() => {
    // Load past documents from localStorage
    const savedDocs = localStorage.getItem("pastDocuments")
    if (savedDocs) {
      try {
        setPastDocuments(JSON.parse(savedDocs))
      } catch (e) {
        console.error("Failed to parse saved documents:", e)
        localStorage.removeItem("pastDocuments")
      }
    }
  }, [])

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setAudioUrl(null)
  }

  const handleGenerateAudio = async () => {
    if (!uploadedFile) return

    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)

      const response = await fetch(`${API_URL}/api/document/tts`, {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to process document")
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      setAudioUrl(audioUrl)

      if (saveAudio) {
        // Get audio duration (approximate for now)
        const duration = "2:30" // In a real app, you'd get this from audio metadata
        
        const newDocument: Document = {
          id: Date.now().toString(),
          name: uploadedFile.name,
          date: new Date().toISOString().split("T")[0],
          duration: duration,
          audioUrl: audioUrl
        }

        setPastDocuments(prev => {
          const updated = [newDocument, ...prev]
          localStorage.setItem("pastDocuments", JSON.stringify(updated))
          return updated
        })
      }

      toast.success("Audio generated successfully")
    } catch (error) {
      console.error("Processing error:", error)
      toast.error(`Failed to process document: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!audioUrl || !uploadedFile) return
    
    const link = document.createElement("a")
    link.href = audioUrl
    link.download = `${uploadedFile.name.replace(/\.[^/.]+$/, "")}.wav`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
  }

  const handleDeleteAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
  }

  const handleDeleteDocument = (id: string) => {
    setPastDocuments(prev => {
      // Find the document to get its URL
      const docToDelete = prev.find(doc => doc.id === id)
      if (docToDelete && docToDelete.audioUrl) {
        // Release the object URL to prevent memory leaks
        URL.revokeObjectURL(docToDelete.audioUrl)
      }
      
      // Filter out the deleted document
      const updated = prev.filter(doc => doc.id !== id)
      localStorage.setItem("pastDocuments", JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-5xl font-bold text-center text-purple-500 mb-2">Document to Speech</h1>
        <p className="text-center text-gray-600 mb-12">
          Upload your documents and get high-quality audio versions in seconds.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-md rounded-2xl border-0 overflow-hidden">
              <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>

              {!uploadedFile ? (
                <DocumentUploader onFileUpload={handleFileUpload} />
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.type || "document"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Switch 
                      id="save-audio" 
                      checked={saveAudio} 
                      onCheckedChange={setSaveAudio} 
                    />
                    <Label htmlFor="save-audio">Save audio output for later</Label>
                  </div>

                  {!audioUrl ? (
                    <Button
                      onClick={handleGenerateAudio}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                    >
                      {isProcessing ? "Processing..." : "Generate Audio"}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Audio Generated</h3>
                      <AudioPlayer audioUrl={audioUrl} />

                      <div className="flex space-x-3">
                        <Button 
                          variant="outline" 
                          className="flex-1 flex items-center justify-center"
                          onClick={handleDownload}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={handleDeleteAudio}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 shadow-md rounded-2xl border-0 h-full">
              <h2 className="text-2xl font-semibold mb-4">Past Documents</h2>
              <PastDocumentsList 
                documents={pastDocuments}
                onDelete={handleDeleteDocument}
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}