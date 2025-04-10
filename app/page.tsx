import { Play, FileText, FileDigit, Heart, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AudioWave from "@/components/audio-wave"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-teal-400 flex items-center justify-center">
              <span className="sr-only">AudioEase</span>
            </div>
            <span className="text-xl font-bold">AudioEase</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-purple-500 transition-colors">
              Features
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-purple-500 transition-colors">
              Pricing
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-purple-500 transition-colors">
              Blog
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-purple-500 transition-colors">
              About
            </Link>
          </nav>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-teal-400 hover:opacity-90 transition-opacity"
            >
              Sign up
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10">
            <AudioWave />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-500">
                Simplify your life, through sound
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-10">
                Get stories, summaries, and insights — all through audio. Let AI transform your content into an auditory
                experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-full text-lg">
                  Try for free
                </Button>
                <Button variant="outline" className="px-8 py-6 rounded-full text-lg">
                  See how it works
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Transform your content with audio AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <FeatureCard
                icon={<Mic className="h-10 w-10 text-purple-500" />}
                title="Voice Synthesis"
                description="Convert any text into natural-sounding speech with customizable voices and tones."
                link1="/text-proc"
              />
              <FeatureCard
                icon={<Play className="h-10 w-10 text-purple-500" />}
                title="Story Generator"
                description="AI generates engaging stories and narrates them in natural-sounding voices."
                link1="/story-gen"
              />
              <FeatureCard
                icon={<FileText className="h-10 w-10 text-teal-500" />}
                title="Document Processor"
                description="Upload any document and get a high-quality audio version in seconds."
                link1="document-proc"
              />
              <FeatureCard
                icon={<FileDigit className="h-10 w-10 text-purple-500" />}
                title="Summary Generator"
                description="Condense long texts into concise audio summaries for quick consumption."
                link1="/summary"
              />
              <FeatureCard
                icon={<Heart className="h-10 w-10 text-teal-500" />}
                title="Emotion Detector Text"
                description="Analyze text or voice input to detect and convey emotions through audio."
                link1="/text-emo"
              />
              <FeatureCard
                icon={<Heart className="h-10 w-10 text-teal-500" />}
                title="Emotion Detector Image"
                description="Analyze text or voice input to detect and convey emotions through audio."
                link1="/image-emo"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How AudioEase works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload or create</h3>
                <p className="text-gray-600">Upload your document or create content directly in our editor.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-teal-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI processing</h3>
                <p className="text-gray-600">Our AI analyzes your content and prepares it for audio conversion.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Listen & share</h3>
                <p className="text-gray-600">Listen to your audio content and share it with anyone, anywhere.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-teal-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to experience the power of audio?</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of users who are already simplifying their lives through AudioEase.
            </p>
            <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 rounded-full text-lg">
              Get started for free
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-teal-400"></div>
                <span className="text-xl font-bold text-white">AudioEase</span>
              </div>
              <p className="text-sm text-gray-400">Simplifying life through audio AI technology.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:text-white transition-colors">
                    Use Cases
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} AudioEase. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, link1 }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600">{description}</p>
      <Link href={link1} passHref>
        <Button variant="link" className="mt-4 p-0 text-purple-600">
          Try now →
        </Button>
      </Link>
    </div>
  );
}

