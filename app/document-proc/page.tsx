"use client"

import { useState } from "react"
import { Download, Trash2, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import DocumentUploader from "@/components/document-uploader"
import AudioPlayer from "@/components/audio-player"
import PastDocumentsList from "@/components/past-documents-list"

export default function DocumentProcessor() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [audioGenerated, setAudioGenerated] = useState(false)
  const [saveAudio, setSaveAudio] = useState(true)

  // Mock data for past documents
  const pastDocuments = [
    { id: 1, name: "Annual Report 2023.pdf", date: "2023-04-01", duration: "12:34", audioUrl: "#" },
    { id: 2, name: "Project Proposal.docx", date: "2023-03-28", duration: "05:21", audioUrl: "#" },
    { id: 3, name: "Meeting Notes.txt", date: "2023-03-25", duration: "03:45", audioUrl: "#" },
    { id: 4, name: "Research Paper.pdf", date: "2023-03-20", duration: "18:12", audioUrl: "#" },
  ]

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setAudioGenerated(false)
  }

  const handleGenerateAudio = () => {
    // Simulate audio generation
    setTimeout(() => {
      setAudioGenerated(true)
    }, 1500)
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setAudioGenerated(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 via-purple-400 to-teal-400 bg-clip-text text-transparent">
          Document Processor
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Upload any document and get a high-quality audio version in seconds.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-md rounded-2xl border-0 overflow-hidden">
              <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>

              {!uploadedFile ? (
                <DocumentUploader onFileUpload={handleFileUpload} />
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-purple-500 mr-3" />
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveFile}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Switch id="save-audio" checked={saveAudio} onCheckedChange={setSaveAudio} />
                    <Label htmlFor="save-audio">Save audio output for later</Label>
                  </div>

                  {!audioGenerated ? (
                    <Button
                      onClick={handleGenerateAudio}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                    >
                      Generate Audio
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Audio Generated</h3>
                      <AudioPlayer />

                      <div className="flex space-x-3">
                        <Button variant="outline" className="flex-1 flex items-center justify-center">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50"
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
              <PastDocumentsList documents={pastDocuments} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

