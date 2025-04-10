import { Navbar } from "@/components/navbar"
import { SavedStories } from "@/components/saved-stories"

// Mock saved stories
const MOCK_SAVED_STORIES = [
  {
    id: "story-1",
    title: "The Enchanted Forest",
    prompt: "magic forest adventure",
    createdAt: new Date().toISOString(),
  },
  {
    id: "story-2",
    title: "Journey to the Stars",
    prompt: "space travel discovery",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "story-3",
    title: "The Lost City",
    prompt: "ancient ruins mystery",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "story-4",
    title: "Ocean Depths",
    prompt: "underwater exploration",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "story-5",
    title: "Mountain Quest",
    prompt: "climbing adventure",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
]

export default function LibraryPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Story Library</h1>
          <SavedStories stories={MOCK_SAVED_STORIES} />
        </div>
      </div>
    </main>
  )
}
