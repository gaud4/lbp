// This is a mock implementation for demonstration purposes
// In a real application, you would integrate with actual ML models

// Replace the emotion arrays with the complete list
// Mock emotions for text analysis
const TEXT_EMOTIONS = [
  "Sadness",
  "Enthusiasm",
  "Neutral",
  "Worry",
  "Surprise",
  "Love",
  "Fun",
  "Hate",
  "Happiness",
  "Boredom",
  "Relief",
  "Anger",
  "Empty",
]

// Mock emotions for facial analysis
const FACIAL_EMOTIONS = [
  "Sadness",
  "Enthusiasm",
  "Neutral",
  "Worry",
  "Surprise",
  "Love",
  "Fun",
  "Hate",
  "Happiness",
  "Boredom",
  "Relief",
  "Anger",
  "Empty",
]

// Helper to generate random scores that sum to 1
function generateRandomScores(count: number): number[] {
  const scores = Array(count)
    .fill(0)
    .map(() => Math.random())
  const sum = scores.reduce((a, b) => a + b, 0)
  return scores.map((score) => score / sum)
}

// Mock text emotion analysis
export async function analyzeTextEmotion(text: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generate random emotion scores
  const scores = generateRandomScores(TEXT_EMOTIONS.length)

  // Create emotion objects with scores
  const emotions = TEXT_EMOTIONS.map((emotion, index) => ({
    emotion,
    score: scores[index],
  })).sort((a, b) => b.score - a.score)

  // Get dominant emotion
  const dominantEmotion = emotions[0].emotion
  const confidence = emotions[0].score

  return {
    emotions,
    dominantEmotion,
    confidence,
  }
}

// Mock facial emotion analysis
export async function analyzeFacialEmotion(imageData: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate random emotion scores
  const scores = generateRandomScores(FACIAL_EMOTIONS.length)

  // Create emotion objects with scores
  const emotions = FACIAL_EMOTIONS.map((emotion, index) => ({
    emotion,
    score: scores[index],
  })).sort((a, b) => b.score - a.score)

  // Get dominant emotion
  const dominantEmotion = emotions[0].emotion
  const confidence = emotions[0].score

  return {
    emotions,
    dominantEmotion,
    confidence,
  }
}
