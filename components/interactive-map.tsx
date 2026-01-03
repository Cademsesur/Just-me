"use client"

import { useEffect, useState } from "react"

interface ActivePoint {
  id: number
  x: number
  y: number
  delay: number
  city: string
}

export function InteractiveMap() {
  const [activePoints, setActivePoints] = useState<ActivePoint[]>([])

  useEffect(() => {
    const cityLocations = [
      { x: 25, y: 40, city: "New York" },
      { x: 18, y: 45, city: "Los Angeles" },
      { x: 24, y: 42, city: "Chicago" },
      { x: 50, y: 35, city: "Paris" },
      { x: 49, y: 32, city: "London" },
      { x: 52, y: 33, city: "Berlin" },
      { x: 52, y: 42, city: "Rome" },
      { x: 48, y: 41, city: "Madrid" },
      { x: 82, y: 45, city: "Tokyo" },
      { x: 78, y: 48, city: "Shanghai" },
      { x: 77, y: 41, city: "Beijing" },
      { x: 80, y: 46, city: "Seoul" },
      { x: 70, y: 55, city: "Mumbai" },
      { x: 71, y: 50, city: "Delhi" },
      { x: 32, y: 72, city: "São Paulo" },
      { x: 33, y: 71, city: "Rio de Janeiro" },
      { x: 21, y: 55, city: "Mexico City" },
      { x: 88, y: 78, city: "Sydney" },
      { x: 91, y: 80, city: "Auckland" },
      { x: 54, y: 78, city: "Cape Town" },
      { x: 56, y: 73, city: "Johannesburg" },
      { x: 58, y: 50, city: "Cairo" },
      { x: 64, y: 54, city: "Dubai" },
    ]

    const points: ActivePoint[] = cityLocations.map((location, i) => ({
      id: i,
      x: location.x + (Math.random() - 0.5) * 1,
      y: location.y + (Math.random() - 0.5) * 1,
      delay: Math.random() * 2,
      city: location.city,
    }))

    setActivePoints(points)
  }, [])

  return (
    <div className="relative">
      {/* SVG World Map */}
      <div className="relative w-full aspect-[2/1] rounded-3xl overflow-hidden border border-border/30 bg-background/20 backdrop-blur-sm">
        <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* Simplified world map continents */}
          <g className="fill-muted/20 stroke-border/40" strokeWidth="0.1">
            {/* North America */}
            <path d="M 10,15 Q 12,12 15,13 L 20,14 Q 23,15 24,18 L 26,22 Q 27,26 25,30 L 22,33 Q 18,35 15,34 L 12,32 Q 10,28 11,24 L 10,20 Q 9,17 10,15 Z" />
            {/* South America */}
            <path d="M 24,35 Q 26,37 27,40 L 29,45 Q 30,50 28,53 L 26,56 Q 24,58 22,57 L 20,55 Q 18,52 19,48 L 21,43 Q 23,38 24,35 Z" />
            {/* Europe */}
            <path d="M 45,18 Q 48,16 51,17 L 54,19 Q 56,21 55,24 L 53,27 Q 50,29 47,28 L 44,26 Q 43,23 44,20 L 45,18 Z" />
            {/* Africa */}
            <path d="M 48,30 Q 51,31 53,34 L 55,38 Q 57,43 56,48 L 54,53 Q 52,57 49,58 L 46,57 Q 43,54 44,50 L 46,45 Q 47,40 47,35 L 48,30 Z" />
            {/* Asia */}
            <path d="M 58,15 Q 62,13 68,14 L 75,16 Q 80,18 83,22 L 86,27 Q 88,32 86,37 L 83,42 Q 78,46 72,46 L 66,44 Q 60,41 58,36 L 56,30 Q 55,24 57,19 L 58,15 Z" />
            {/* Australia */}
            <path d="M 78,52 Q 82,51 86,53 L 89,56 Q 91,59 90,62 L 88,65 Q 85,67 81,66 L 77,64 Q 75,61 76,58 L 78,54 Z" />
          </g>

          {/* Active points with pulsing animation */}
          {activePoints.map((point) => (
            <g key={point.id}>
              {/* Pulsing outer circle */}
              <circle
                cx={point.x}
                cy={point.y}
                r="0.8"
                className="fill-primary animate-ping opacity-75"
                style={{ animationDelay: `${point.delay}s` }}
              />
              {/* Main point */}
              <circle
                cx={point.x}
                cy={point.y}
                r="0.4"
                className="fill-primary drop-shadow-[0_0_4px_rgba(147,51,234,0.7)]"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Gender distribution - elegant side-by-side bars */}
      <div className="mt-12 max-w-xl mx-auto">
        <div className="bg-background/30 backdrop-blur-md border border-border/30 rounded-3xl p-8">
          <div className="space-y-6">
            {/* Women */}
            <div className="group">
              <div className="flex items-baseline justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/30" />
                  <span className="text-base font-medium text-foreground">Femmes</span>
                </div>
                <span className="text-3xl font-bold text-primary tracking-tight">64%</span>
              </div>
              <div className="h-2.5 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-primary/20"
                  style={{ width: "64%" }}
                />
              </div>
            </div>

            {/* Men */}
            <div className="group">
              <div className="flex items-baseline justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent shadow-lg shadow-accent/30" />
                  <span className="text-base font-medium text-foreground">Hommes</span>
                </div>
                <span className="text-3xl font-bold text-accent tracking-tight">36%</span>
              </div>
              <div className="h-2.5 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-accent/20"
                  style={{ width: "36%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
