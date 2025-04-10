import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 flex items-center justify-center">
            <Play className="h-4 w-4 text-white fill-white" />
          </div>
          <span className="text-xl font-bold">StorySync</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-purple-500">
            Home
          </Link>
          <Link href="/library" className="text-sm font-medium hover:text-purple-500">
            Library
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-purple-500">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
          <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  )
}
