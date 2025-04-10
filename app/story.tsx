import { Navbar } from "@/components/navbar"
import { StoryGenerator } from "@/components/story-generator"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-16 mt-8">
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">StorySync</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate engaging stories from a few words and listen to them with synchronized text, just like your
            favorite music lyrics.
          </p>
        </div>
        <StoryGenerator />
      </div>
    </main>
  )
}
