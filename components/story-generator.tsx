"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoryPlayer } from "@/components/story-player"
import { SavedStories } from "@/components/saved-stories"
import { Loader2, Sparkles } from "lucide-react"

// Mock data for demonstration
const MOCK_STORY = {
  id: "story-1",
  title: "The Enchanted Forest",
  prompt: "magic forest adventure",
  content: [
    "Once upon a time, there was a magical forest hidden from the world.",
    "Trees whispered ancient secrets to those who would listen.",
    "A young explorer named Lily discovered the entrance by accident.",
    "As she stepped through the veil of mist, colors became more vibrant.",
    "Flowers glowed with an inner light, illuminating her path.",
    "Small creatures with luminous eyes watched her from the shadows.",
    "Lily felt no fear, only wonder at the beauty surrounding her.",
    "A gentle voice called to her from deeper within the woods.",
    "Following the sound, she found a clearing bathed in moonlight.",
    "In the center stood an ancient tree with silver leaves.",
    "The tree spoke to her mind, sharing wisdom of centuries past.",
    "It told her she was chosen to protect the forest from harm.",
    "Lily accepted this responsibility with a solemn promise.",
    "From that day forward, she became the guardian of the enchanted forest.",
    "And the magic of the forest became part of her forever.",
  ],
  audioUrl: "/placeholder.mp3",
  timestamps: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56],
  createdAt: new Date().toISOString(),
}

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
]

export function StoryGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedStory, setGeneratedStory] = useState<typeof MOCK_STORY | null>(null)
  const [savedStories, setSavedStories] = useState(MOCK_SAVED_STORIES)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Simulate API call to backend
    setTimeout(() => {
      setGeneratedStory(MOCK_STORY)
      setIsGenerating(false)
    }, 2000)
  }

  const handleSave = () => {
    if (!generatedStory) return

    // Check if story is already saved
    if (!savedStories.some((story) => story.id === generatedStory.id)) {
      const newSavedStory = {
        id: generatedStory.id,
        title: generatedStory.title,
        prompt: generatedStory.prompt,
        createdAt: new Date().toISOString(),
      }

      setSavedStories([newSavedStory, ...savedStories])
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="create">Create Story</TabsTrigger>
          <TabsTrigger value="library">My Library</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Generate a Story</h2>
                <p className="text-gray-500">
                  Enter a few words or a brief prompt, and our AI will create an engaging story for you.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter a few words (e.g., 'space adventure', 'magical forest')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {generatedStory && <StoryPlayer story={generatedStory} onSave={handleSave} />}
        </TabsContent>

        <TabsContent value="library">
          <SavedStories stories={savedStories} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
