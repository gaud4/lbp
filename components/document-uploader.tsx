"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"

interface DocumentUploaderProps {
  onFileUpload: (file: File) => void
}

export default function DocumentUploader({ onFileUpload }: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
        isDragging ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,.txt" />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className={`relative p-4 rounded-full bg-purple-100 group transition-all duration-300 ${isDragging ? "animate-pulse" : ""}`}
        >
          <Upload className="h-8 w-8 text-purple-500" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </div>

        <div>
          <h3 className="text-lg font-medium">Drag & drop your document here</h3>
          <p className="text-gray-500 mt-1">or click to browse files</p>
          <p className="text-xs text-gray-400 mt-2">Supports PDF, DOCX, TXT</p>
        </div>
      </div>
    </div>
  )
}

