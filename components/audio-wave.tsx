"use client"

import { useEffect, useRef } from "react"

export default function AudioWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const waves = {
      y: canvas.height / 2,
      length: 0.01,
      amplitude: 100,
      frequency: 0.01,
    }

    const strokeColor = {
      h: 250,
      s: 50,
      l: 50,
    }

    let increment = waves.frequency

    function animate() {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)

      for (let i = 0; i < canvas.width; i++) {
        const angle = i * waves.length + increment
        const y = waves.y + Math.sin(angle) * waves.amplitude

        ctx.lineTo(i, y)
      }

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, "rgba(123, 31, 162, 0.5)")
      gradient.addColorStop(1, "rgba(20, 184, 166, 0.5)")

      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.stroke()

      increment += waves.frequency
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      waves.y = canvas.height / 2
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
