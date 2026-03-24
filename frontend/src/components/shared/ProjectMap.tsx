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
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [20, 5],
        zoom: 1.5,
        attributionControl: false,
      })

      mapRef.current = map

      map.on('load', () => {
        const maxTrees = Math.max(...projects.map((p) => p.trees_planted))

        projects.forEach((project) => {
          const logScale = Math.log(project.trees_planted + 1) / Math.log(maxTrees + 1)
          const size = 10 + logScale * 22

          // Outer wrapper — MapLibre controls its transform for positioning
          const el = document.createElement('div')
          el.style.width = `${size}px`
          el.style.height = `${size}px`
          el.style.cursor = 'pointer'

          // Inner circle — safe to transform without breaking positioning
          const inner = document.createElement('div')
          inner.style.width = '100%'
          inner.style.height = '100%'
          inner.style.borderRadius = '50%'
          inner.style.backgroundColor = project.ecosystem_color || '#0e7490'
          inner.style.opacity = '0.85'
          inner.style.border = '2px solid rgba(255,255,255,0.8)'
          inner.style.boxShadow = '0 1px 4px rgba(0,0,0,0.15)'
          inner.style.transition = 'transform 0.2s, opacity 0.2s'
          el.appendChild(inner)

          el.addEventListener('mouseenter', () => {
            inner.style.transform = 'scale(1.2)'
            inner.style.opacity = '1'
          })
          el.addEventListener('mouseleave', () => {
            inner.style.transform = 'scale(1)'
            inner.style.opacity = '0.85'
          })

          const popup = new maplibregl.Popup({
            offset: size / 2 + 4,
            closeButton: false,
            closeOnClick: false,
            className: 'seatrees-popup',
          }).setHTML(`
            <div style="background:var(--st-card);color:var(--st-text);padding:8px 12px;border-radius:8px;font-size:12px;min-width:140px;border:1px solid var(--st-border);box-shadow:var(--shadow-card);">
              <div style="font-weight:600;margin-bottom:4px;">${project.name}</div>
              <div style="color:var(--st-text-muted);margin-bottom:2px;">${project.ecosystem_name}</div>
              <div style="color:var(--st-text-muted);">${project.trees_planted.toLocaleString()} trees</div>
              <div style="color:var(--st-text-muted);">${project.partner}</div>
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
      <div className={`flex items-center justify-center rounded-xl border border-[var(--st-border)] bg-[var(--st-card)] p-8 text-[var(--st-text-muted)] ${className}`}>
        <p className="text-sm">Map unavailable. Tracking {projects.length} projects.</p>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border border-[var(--st-border)] ${className}`}>
      <div ref={mapContainer} className="h-full w-full" style={{ minHeight: 300 }} />
    </div>
  )
}
