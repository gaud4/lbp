// "use client"

// import { useState, useEffect } from "react"
// import { Download, Trash2, X, FileText, Play } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"
// import { Navbar } from "@/components/navbar"
// import DocumentUploader from "@/components/document-uploader"
// import AudioPlayer from "@/components/audio-playerdoc"
// import { toast } from "sonner"

// interface Document {
//   id: string
//   name: string
//   date: string
//   duration: string
//   audioData: string // Store as data URL
// }

// const API_URL = "http://localhost:5000"

// export default function DocumentProcessor() {
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null)
//   const [currentAudioData, setCurrentAudioData] = useState<string | null>(null)
//   const [saveAudio, setSaveAudio] = useState(true)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [pastDocuments, setPastDocuments] = useState<Document[]>([])

//   useEffect(() => {
//     const savedDocs = localStorage.getItem("pastDocuments")
//     if (savedDocs) {
//       try {
//         setPastDocuments(JSON.parse(savedDocs))
//       } catch (e) {
//         console.error("Failed to parse saved documents:", e)
//         localStorage.removeItem("pastDocuments")
//       }
//     }
//   }, [])

//   const convertBlobToDataURL = async (blob: Blob): Promise<string> => {
//     return new Promise((resolve) => {
//       const reader = new FileReader()
//       reader.onloadend = () => resolve(reader.result as string)
//       reader.readAsDataURL(blob)
//     })
//   }

//   const handleFileUpload = (file: File) => {
//     setUploadedFile(file)
//     setCurrentAudioData(null)
//   }

//   const handleGenerateAudio = async () => {
//     if (!uploadedFile) return

//     setIsProcessing(true)
//     try {
//       const formData = new FormData()
//       formData.append("file", uploadedFile)

//       const response = await fetch(`${API_URL}/api/document/tts`, {
//         method: "POST",
//         body: formData
//       })

//       if (!response.ok) throw new Error(await response.text())

//       const audioBlob = await response.blob()
//       const audioData = await convertBlobToDataURL(audioBlob)
//       setCurrentAudioData(audioData)

//       if (saveAudio) {
//         const audio = new Audio(audioData)
//         const newDocument: Document = {
//           id: Date.now().toString(),
//           name: uploadedFile.name,
//           date: new Date().toISOString().split("T")[0],
//           duration: "0:00", // Implement actual duration calculation
//           audioData
//         }

//         setPastDocuments(prev => {
//           const updated = [newDocument, ...prev]
//           localStorage.setItem("pastDocuments", JSON.stringify(updated))
//           return updated
//         })
//       }

//       toast.success("Audio generated successfully")
//     } catch (error) {
//       console.error("Processing error:", error)
//       toast.error(`Failed to process document: ${error.message}`)
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const handleDownload = (audioData?: string, name?: string) => {
//     if (!audioData) return
    
//     try {
//       const byteString = atob(audioData.split(',')[1])
//       const mimeString = audioData.split(',')[0].split(':')[1].split(';')[0]
//       const ab = new ArrayBuffer(byteString.length)
//       const ia = new Uint8Array(ab)
//       for (let i = 0; i < byteString.length; i++) {
//         ia[i] = byteString.charCodeAt(i)
//       }
//       const blob = new Blob([ab], { type: mimeString })
//       const url = URL.createObjectURL(blob)
      
//       const link = document.createElement("a")
//       link.href = url
//       link.download = `${name?.replace(/\.[^/.]+$/, "") || "audio"}.wav`
//       document.body.appendChild(link)
//       link.click()
      
//       setTimeout(() => {
//         URL.revokeObjectURL(url)
//         document.body.removeChild(link)
//       }, 100)
//     } catch (error) {
//       toast.error("Failed to download audio")
//     }
//   }

//   const handleRemoveFile = () => {
//     setUploadedFile(null)
//     setCurrentAudioData(null)
//   }

//   const handleDeleteDocument = (id: string) => {
//     setPastDocuments(prev => {
//       const updated = prev.filter(doc => {
//         if (doc.id === id) {
//           try {
//             // Clean up any blob URLs created from this data
//             const byteString = atob(doc.audioData.split(',')[1])
//             const ab = new ArrayBuffer(byteString.length)
//             const ia = new Uint8Array(ab)
//             const blob = new Blob([ia], { type: 'audio/wav' })
//             URL.revokeObjectURL(URL.createObjectURL(blob))
//           } catch (error) {
//             console.error("Error cleaning up audio:", error)
//           }
//         }
//         return doc.id !== id
//       })
//       localStorage.setItem("pastDocuments", JSON.stringify(updated))
//       return updated
//     })
//     toast.success("Document deleted")
//   }

//   const handlePlayDocument = (audioData: string) => {
//     setCurrentAudioData(audioData)
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <Navbar />

//       <main className="container mx-auto px-4 py-8 max-w-6xl">
//         <h1 className="text-5xl font-bold text-center text-purple-500 mb-2">Document to Speech</h1>
//         <p className="text-center text-gray-600 mb-12">
//           Upload your documents and get high-quality audio versions in seconds.
//         </p>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <Card className="p-6 shadow-md rounded-2xl border-0 overflow-hidden">
//               <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>

//               {!uploadedFile ? (
//                 <DocumentUploader onFileUpload={handleFileUpload} />
//               ) : (
//                 <div className="space-y-6">
//                   <div className="bg-gray-50 p-4 rounded-lg flex items-start justify-between">
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
//                         <FileText className="h-5 w-5 text-purple-600" />
//                       </div>
//                       <div>
//                         <p className="font-medium">{uploadedFile.name}</p>
//                         <p className="text-xs text-gray-500">
//                           {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.type || "document"}
//                         </p>
//                       </div>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
//                       onClick={handleRemoveFile}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   <div className="flex items-center space-x-4">
//                     <Switch 
//                       id="save-audio" 
//                       checked={saveAudio} 
//                       onCheckedChange={setSaveAudio} 
//                     />
//                     <Label htmlFor="save-audio">Save audio output for later</Label>
//                   </div>

//                   {!currentAudioData ? (
//                     <Button
//                       onClick={handleGenerateAudio}
//                       disabled={isProcessing}
//                       className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
//                     >
//                       {isProcessing ? "Processing..." : "Generate Audio"}
//                     </Button>
//                   ) : (
//                     <div className="space-y-4">
//                       <h3 className="text-lg font-medium">Audio Generated</h3>
//                       <AudioPlayer audioData={currentAudioData} />

//                       <div className="flex space-x-3">
//                         <Button 
//                           variant="outline" 
//                           className="flex-1 flex items-center justify-center"
//                           onClick={() => handleDownload(currentAudioData, uploadedFile.name)}
//                         >
//                           <Download className="mr-2 h-4 w-4" />
//                           Download
//                         </Button>
//                         <Button
//                           variant="outline"
//                           className="flex-1 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50"
//                           onClick={() => setCurrentAudioData(null)}
//                         >
//                           <Trash2 className="mr-2 h-4 w-4" />
//                           Delete
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </Card>
//           </div>

//           <div className="lg:col-span-1">
//             <Card className="p-6 shadow-md rounded-2xl border-0 h-full">
//               <h2 className="text-2xl font-semibold mb-4">Past Documents</h2>
//               <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
//                 {pastDocuments.map((document) => (
//                   <div key={document.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
//                     <div className="flex items-start mb-2">
//                       <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
//                         <FileText className="h-4 w-4 text-purple-600" />
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="font-medium text-gray-900">{document.name}</h4>
//                         <p className="text-xs text-gray-500">
//                           {document.date} • {document.duration}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div className="flex space-x-2">
//                         <Button 
//                           size="sm" 
//                           variant="ghost" 
//                           className="h-8 px-2 text-xs"
//                           onClick={() => handlePlayDocument(document.audioData)}
//                         >
//                           <Play className="h-3 w-3 mr-1" />
//                           Play
//                         </Button>
//                         <Button 
//                           size="sm" 
//                           variant="ghost" 
//                           className="h-8 px-2 text-xs"
//                           onClick={() => handleDownload(document.audioData, document.name)}
//                         >
//                           <Download className="h-3 w-3 mr-1" />
//                           Download
//                         </Button>
//                       </div>
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         className="h-8 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
//                         onClick={() => handleDeleteDocument(document.id)}
//                       >
//                         <Trash2 className="h-3 w-3 mr-1" />
//                         Delete
//                       </Button>
//                     </div>
//                   </div>
//                 ))}

//                 {pastDocuments.length === 0 && (
//                   <div className="text-center py-8 text-gray-500">
//                     <p>No saved documents yet</p>
//                   </div>
//                 )}
//               </div>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Download, Trash2, X, FileText, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import DocumentUploader from "@/components/document-uploader"
import AudioPlayer from "@/components/audio-playerdoc"
import { toast } from "sonner"

interface Document {
  id: string
  name: string
  date: string
  duration: string
  audioData: string
}

const API_URL = "http://localhost:5000"

export default function DocumentProcessor() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [currentAudioData, setCurrentAudioData] = useState<string | null>(null)
  const [saveAudio, setSaveAudio] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pastDocuments, setPastDocuments] = useState<Document[]>([])
  const [autoPlay, setAutoPlay] = useState(false)

  useEffect(() => {
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

  const convertBlobToDataURL = async (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  }

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setCurrentAudioData(null)
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

      if (!response.ok) throw new Error(await response.text())

      const audioBlob = await response.blob()
      const audioData = await convertBlobToDataURL(audioBlob)
      setCurrentAudioData(audioData)

      if (saveAudio) {
        const audio = new Audio(audioData)
        const newDocument: Document = {
          id: Date.now().toString(),
          name: uploadedFile.name,
          date: new Date().toISOString().split("T")[0],
          duration: "0:00",
          audioData
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

  const handleDownload = (audioData?: string, name?: string) => {
    if (!audioData) return
    
    try {
      const byteString = atob(audioData.split(',')[1])
      const mimeString = audioData.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: mimeString })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement("a")
      link.href = url
      link.download = `${name?.replace(/\.[^/.]+$/, "") || "audio"}.wav`
      document.body.appendChild(link)
      link.click()
      
      setTimeout(() => {
        URL.revokeObjectURL(url)
        document.body.removeChild(link)
      }, 100)
    } catch (error) {
      toast.error("Failed to download audio")
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setCurrentAudioData(null)
  }

  const handleDeleteDocument = (id: string) => {
    setPastDocuments(prev => {
      const updated = prev.filter(doc => {
        if (doc.id === id) {
          try {
            const byteString = atob(doc.audioData.split(',')[1])
            const ab = new ArrayBuffer(byteString.length)
            const ia = new Uint8Array(ab)
            const blob = new Blob([ia], { type: 'audio/wav' })
            URL.revokeObjectURL(URL.createObjectURL(blob))
          } catch (error) {
            console.error("Error cleaning up audio:", error)
          }
        }
        return doc.id !== id
      })
      localStorage.setItem("pastDocuments", JSON.stringify(updated))
      return updated
    })
    toast.success("Document deleted")
  }

  const handlePlayDocument = (audioData: string) => {
    setCurrentAudioData(audioData)
    setAutoPlay(true)
  }

  useEffect(() => {
    if (autoPlay) {
      setAutoPlay(false)
    }
  }, [autoPlay])

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

                  {!currentAudioData ? (
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
                      <AudioPlayer audioData={currentAudioData} autoPlay={autoPlay} />

                      <div className="flex space-x-3">
                        <Button 
                          variant="outline" 
                          className="flex-1 flex items-center justify-center"
                          onClick={() => handleDownload(currentAudioData, uploadedFile.name)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setCurrentAudioData(null)}
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
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {pastDocuments.map((document) => (
                  <div key={document.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start mb-2">
                      <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                        <FileText className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{document.name}</h4>
                        <p className="text-xs text-gray-500">
                          {document.date} • {document.duration}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-2 text-xs"
                          onClick={() => handlePlayDocument(document.audioData)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Play
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-2 text-xs"
                          onClick={() => handleDownload(document.audioData, document.name)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteDocument(document.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}

                {pastDocuments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No saved documents yet</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}