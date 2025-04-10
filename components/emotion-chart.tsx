"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface EmotionChartProps {
  emotions: { emotion: string; score: number }[]
}

export default function EmotionChart({ emotions }: EmotionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Generate colors with a purple/blue gradient theme
    const generateColors = (count: number) => {
      const colors = []
      for (let i = 0; i < count; i++) {
        const hue = 260 + ((i * 40) % 100) // Range from purple to blue
        colors.push(`hsla(${hue}, 80%, 65%, 0.8)`)
      }
      return colors
    }

    const labels = emotions.map((item) => item.emotion)
    const data = emotions.map((item) => item.score * 100)
    const backgroundColors = generateColors(emotions.length)

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Emotion Score (%)",
            data,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((color) => color.replace("0.8", "1")),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.formattedValue}%`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => `${value}%`,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [emotions])

  return <canvas ref={chartRef} />
}
