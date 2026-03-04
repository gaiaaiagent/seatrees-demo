'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { ProjectWithStats } from '@/types'

interface ProjectMapProps {
  projects: ProjectWithStats[]
  className?: string
}

export function ProjectMap({ projects, className = '' }: ProjectMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const popupsRef = useRef<maplibregl.Popup[]>([])
  const router = useRouter()
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!mapContainer.current || projects.length === 0) return

    try {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [20, 5],
        zoom: 1.5,
        attributionControl: false,
      })

      mapRef.current = map

      map.on('load', () => {
        // Find max trees for scaling
        const maxTrees = Math.max(...projects.map((p) => p.trees_planted))

        projects.forEach((project) => {
          // Logarithmic size scaling: 10px to 32px
          const logScale = Math.log(project.trees_planted + 1) / Math.log(maxTrees + 1)
          const size = 10 + logScale * 22

          // Create marker element
          const el = document.createElement('div')
          el.style.width = `${size}px`
          el.style.height = `${size}px`
          el.style.borderRadius = '50%'
          el.style.backgroundColor = project.ecosystem_color || '#06B6D4'
          el.style.opacity = '0.85'
          el.style.cursor = 'pointer'
          el.style.border = '2px solid rgba(255,255,255,0.2)'
          el.style.transition = 'transform 0.2s, opacity 0.2s'

          if (project.status === 'active') {
            el.classList.add('pulse-glow')
          }

          el.addEventListener('mouseenter', () => {
            el.style.transform = 'scale(1.2)'
            el.style.opacity = '1'
          })
          el.addEventListener('mouseleave', () => {
            el.style.transform = 'scale(1)'
            el.style.opacity = '0.85'
          })

          // Popup on hover
          const popup = new maplibregl.Popup({
            offset: size / 2 + 4,
            closeButton: false,
            closeOnClick: false,
            className: 'seatrees-popup',
          }).setHTML(`
            <div style="background:#0F1D32;color:#E2E8F0;padding:8px 12px;border-radius:8px;font-size:12px;min-width:140px;">
              <div style="font-weight:600;margin-bottom:4px;">${project.name}</div>
              <div style="color:#94A3B8;margin-bottom:2px;">${project.ecosystem_name}</div>
              <div style="color:#94A3B8;">${project.trees_planted.toLocaleString()} trees</div>
              <div style="color:#94A3B8;">${project.partner}</div>
            </div>
          `)

          popupsRef.current.push(popup)

          el.addEventListener('mouseenter', () => {
            popup.addTo(map)
          })
          el.addEventListener('mouseleave', () => {
            popup.remove()
          })

          el.addEventListener('click', () => {
            router.push(`/project/${project.slug}`)
          })

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([project.lng, project.lat])
            .setPopup(popup)
            .addTo(map)

          markersRef.current.push(marker)
        })
      })

      return () => {
        markersRef.current.forEach((m) => m.remove())
        markersRef.current = []
        popupsRef.current.forEach((p) => p.remove())
        popupsRef.current = []
        map.remove()
        mapRef.current = null
      }
    } catch {
      setError(true)
    }
  }, [projects, router])

  if (error) {
    return (
      <div className={`flex items-center justify-center rounded-xl border border-border bg-card p-8 text-muted-foreground ${className}`}>
        <p className="text-sm">Map unavailable. Tracking {projects.length} projects.</p>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border ${className}`}>
      <div ref={mapContainer} className="h-full w-full" style={{ minHeight: 300 }} />
    </div>
  )
}
