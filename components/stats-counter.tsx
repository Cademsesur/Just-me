"use client"

import { useEffect, useState } from "react"

interface StatItemProps {
  label: string
  targetValue: number
  suffix?: string
  duration?: number
}

function StatItem({ label, targetValue, suffix = "", duration = 2000 }: StatItemProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    const element = document.getElementById(`stat-${label}`)
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [label])

  useEffect(() => {
    if (!isVisible) return

    const increment = targetValue / (duration / 16)
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetValue) {
        setCount(targetValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isVisible, targetValue, duration])

  const formatNumber = (num: number) => {
    return num.toLocaleString("fr-FR")
  }

  return (
    <div
      id={`stat-${label}`}
      className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-950/30 to-black border border-purple-900/30 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-purple-700/50"
    >
      <div className="text-5xl md:text-6xl font-bold text-purple-400 mb-3">
        {formatNumber(count)}
        {suffix}
      </div>
      <div className="text-gray-400 text-lg">{label}</div>
    </div>
  )
}

export function StatsCounter() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <StatItem label="Utilisateurs inscrits" targetValue={48832} suffix="+" />
      <StatItem label="Déclarations effectuées" targetValue={89951} suffix="+" />
      <StatItem label="Correspondances détectées" targetValue={12843} />
    </div>
  )
}
