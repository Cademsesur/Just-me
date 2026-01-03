"use client"

import { useEffect, useState } from "react"

export function EnhancedStats() {
  const [totalUsers, setTotalUsers] = useState(2134567)
  const [revealedDeceptions, setRevealedDeceptions] = useState(47892)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setTotalUsers((prev) => prev + Math.floor(Math.random() * 8))
      setRevealedDeceptions((prev) => prev + Math.floor(Math.random() * 2))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid md:grid-cols-2 gap-16 max-w-3xl mx-auto">
      {/* Total Users */}
      <div className="text-center space-y-4">
        <div className="text-6xl md:text-7xl font-bold text-foreground tabular-nums">{totalUsers.toLocaleString()}</div>
        <p className="text-xl text-muted-foreground">Utilisateurs totaux</p>
      </div>

      {/* Revealed Deceptions */}
      <div className="text-center space-y-4">
        <div className="text-6xl md:text-7xl font-bold text-accent tabular-nums">
          {revealedDeceptions.toLocaleString()}
        </div>
        <p className="text-xl text-muted-foreground">Tromperies dévoilées</p>
      </div>
    </div>
  )
}
