import { Play, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Document {
  id: number
  name: string
  date: string
  duration: string
  audioUrl: string
}

interface PastDocumentsListProps {
  documents: Document[]
}

export default function PastDocumentsList({ documents }: PastDocumentsListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No saved documents yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
      {documents.map((doc) => (
        <div key={doc.id} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-500"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{doc.name}</h4>
              <p className="text-xs text-gray-500">
                {doc.date} • {doc.duration}
              </p>

              <div className="flex items-center mt-2 space-x-2">
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  <Play className="h-3.5 w-3.5 mr-1" />
                  Play
                </Button>

                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

