"use client"

import { useEffect, useState } from "react"

interface Point {
  x: number
  y: number
  delay: number
}

export function WorldMap() {
  const [points, setPoints] = useState<Point[]>([])

  useEffect(() => {
    // Generate random points for active users
    const generatedPoints: Point[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 60 + 20, // Avoid poles
      delay: Math.random() * 3,
    }))
    setPoints(generatedPoints)
  }, [])

  return (
    <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden border border-purple-900/30 bg-gradient-to-br from-purple-950/20 to-black">
      {/* Simple world map representation */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))" }}
      >
        {/* Continents in simplified shapes - dark gray */}
        <g fill="#1a1a2e" stroke="#374151" strokeWidth="1">
          {/* North America */}
          <path d="M 100 100 Q 150 80, 200 90 L 220 120 Q 200 150, 180 180 L 150 170 Q 120 140, 100 100 Z" />

          {/* South America */}
          <path d="M 180 200 Q 190 180, 210 190 L 220 250 Q 210 280, 190 270 L 170 240 Q 175 220, 180 200 Z" />

          {/* Europe */}
          <path d="M 450 100 Q 480 90, 510 100 L 520 130 Q 500 140, 480 130 L 450 100 Z" />

          {/* Africa */}
          <path d="M 470 150 Q 490 140, 520 150 L 530 230 Q 510 260, 490 250 L 470 200 Q 465 175, 470 150 Z" />

          {/* Asia */}
          <path d="M 550 80 Q 650 70, 750 90 L 780 140 Q 760 180, 720 170 L 650 150 Q 580 130, 550 80 Z" />

          {/* Australia */}
          <path d="M 750 280 Q 780 270, 810 280 L 820 310 Q 800 330, 770 320 L 750 280 Z" />
        </g>

        {/* Active user points */}
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x * 10}
            cy={point.y * 10}
            r="4"
            fill="#a855f7"
            className="animate-pulse"
            style={{
              animationDelay: `${point.delay}s`,
              filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.8))",
            }}
          />
        ))}
      </svg>

      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
    </div>
  )
}
