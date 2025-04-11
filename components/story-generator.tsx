"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoryPlayer } from "@/components/story-player"
import { SavedStories } from "@/components/saved-stories"
import { Loader2, Sparkles, BotIcon, BookOpen, Settings2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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
  const [model, setModel] = useState("llama") // Default model
  const [wordCount, setWordCount] = useState("200")
  const [temperature, setTemperature] = useState("0.7")
  const [topP, setTopP] = useState("0.9")
  const [storyText, setStoryText] = useState("")
  const [showOutput, setShowOutput] = useState(false)
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    // Set generating state to true and hide any previous output
    setIsGenerating(true)
    setShowOutput(false)

    try {
      // Implementation similar to the handleSubmit in the first code
      console.log("Prompt:", prompt)
      console.log("Model:", model)
      console.log("Word Count:", wordCount)

      if (model === "llama") {
        console.log("Temperature:", temperature)
        console.log("Top P:", topP)
      }

      // Prepare request data
      const data = {
        inp: prompt,
        word_count: Number.parseInt(wordCount),
        ...(model === "llama" && {
          temperature: Number.parseFloat(temperature),
          top_p: Number.parseFloat(topP),
        }),
      }

      // Simulate API call to backend with a delay
      // In a real implementation, this would be a fetch call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation with actual API:
      const response = await fetch(`http://localhost:8000/${model}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const reply = await response.json()

      // Update state with the actual response
      const responseText = reply.text || reply
      setStoryText(responseText)

      const newStory = {
        ...MOCK_STORY,
        id: `story-${Date.now()}`,
        prompt: prompt,
        title: `AI Story: ${prompt.substring(0, 20)}${prompt.length > 20 ? "..." : ""}`,
        content: responseText.split("\n").filter(Boolean),
        createdAt: new Date().toISOString(),
      }

      setGeneratedStory(newStory)
      setShowOutput(true)
    } catch (e) {
      console.error("Error generating story:", e)
      // Show error message
      setStoryText("An error occurred while generating your story. Please try again.")
      setShowOutput(true)
    } finally {
      // Always set generating state to false after completion
      setIsGenerating(false)
    }
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGenerate()
    }
  }

  // Ensure word count is a valid integer
  const handleWordCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numeric input
    if (/^\d*$/.test(value)) {
      setWordCount(value)
    }
  }

  // Ensure temperature and top_p are valid floats between 0 and 1
  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value) && (value === "" || Number.parseFloat(value) <= 1)) {
      setTemperature(value)
    }
  }

  const handleTopPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value) && (value === "" || Number.parseFloat(value) <= 1)) {
      setTopP(value)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8 gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 flex items-center justify-center">
          <BotIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold gradient-text">LLaMALore</h1>
          <p className="text-sm text-muted-foreground">AI-Powered Storytelling</p>
        </div>
      </div>

      <Card className="mb-8 border-none shadow-lg bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-950/20 dark:to-orange-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <BookOpen className="h-8 w-8 text-purple-500" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Next-Gen Storytelling with Transformer-Driven Intelligence</h2>
              <p className="text-muted-foreground">
                Enter the realm of AI-powered storytelling, where literature meets technology. Provide a prompt, and let
                our model weave an original tale based on your ideas. Our tool recreates the tone, style, and essence of
                iconic authors, bringing new stories to life with every input.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="create" className="text-base py-3">
            <Sparkles className="h-4 w-4 mr-2" />
            Create Story
          </TabsTrigger>
          <TabsTrigger value="library" className="text-base py-3">
            <BookOpen className="h-4 w-4 mr-2" />
            My Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Generate a Story</CardTitle>
              <CardDescription>
                Enter a prompt and customize generation settings to create your unique story
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-sm font-medium">
                  Story Prompt
                </Label>
                <Input
                  id="prompt"
                  placeholder="Enter your story prompt (e.g., 'A detective in a cyberpunk city')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isGenerating}
                  className="focus-visible:ring-purple-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <Label htmlFor="word-count" className="text-sm font-medium">
                    Word Count
                  </Label>
                  <Input
                    id="word-count"
                    type="text"
                    value={wordCount}
                    onChange={handleWordCountChange}
                    placeholder="200"
                    disabled={isGenerating}
                    className="focus-visible:ring-purple-500"
                  />
                </div>

                <div className="w-full sm:w-2/3">
                  <Label className="text-sm font-medium">Model Selection</Label>
                  <div className="flex gap-3 mt-1.5">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setModel("gpt")}
                            variant={model === "gpt" ? "default" : "outline"}
                            className={`w-full ${model === "gpt" ? "bg-purple-500 hover:bg-purple-600" : ""}`}
                            disabled={isGenerating}
                          >
                            GPT-1 (10M)
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Smaller model, faster generation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setModel("llama")}
                            variant={model === "llama" ? "default" : "outline"}
                            className={`w-full ${model === "llama" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                            disabled={isGenerating}
                          >
                            Llama (7B)
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Larger model, more creative results</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>

              <Collapsible
                open={showAdvancedSettings}
                onOpenChange={setShowAdvancedSettings}
                className={model === "llama" ? "block" : "hidden"}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground">
                    <Settings2 className="h-4 w-4" />
                    {showAdvancedSettings ? "Hide Advanced Settings" : "Show Advanced Settings"}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-md">
                    <div>
                      <Label htmlFor="temperature" className="text-sm font-medium">
                        Temperature
                        <span className="ml-1 text-xs text-muted-foreground">(0-1)</span>
                      </Label>
                      <Input
                        id="temperature"
                        type="text"
                        value={temperature}
                        onChange={handleTemperatureChange}
                        placeholder="0.7"
                        disabled={isGenerating}
                        className="focus-visible:ring-orange-500"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Higher values produce more creative but potentially less coherent text
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="top-p" className="text-sm font-medium">
                        Top P<span className="ml-1 text-xs text-muted-foreground">(0-1)</span>
                      </Label>
                      <Input
                        id="top-p"
                        type="text"
                        value={topP}
                        onChange={handleTopPChange}
                        placeholder="0.9"
                        disabled={isGenerating}
                        className="focus-visible:ring-orange-500"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Controls diversity of word choices during generation
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Story
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Show loading indicator when generating */}
          {isGenerating && (
            <div className="flex flex-col justify-center items-center py-16 space-y-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-orange-500" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Crafting your story...</p>
                <p className="text-sm text-muted-foreground">This may take a moment</p>
              </div>
            </div>
          )}

          {/* Show output only after generation is complete */}
          {showOutput && !isGenerating && (
            <>
              <Card className="shadow-md border-t-4 border-t-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    Generated Story
                  </CardTitle>
                  <CardDescription>Your AI-generated story based on: "{prompt}"</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={storyText}
                    readOnly
                    className="min-h-[300px] text-base leading-relaxed focus-visible:ring-purple-500"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      variant="outline"
                      className="border-purple-200 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Save to Library
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {generatedStory && <StoryPlayer story={generatedStory} onSave={handleSave} />}
            </>
          )}
        </TabsContent>

        <TabsContent value="library">
          <SavedStories stories={savedStories} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
