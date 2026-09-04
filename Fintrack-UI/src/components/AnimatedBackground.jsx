import { useEffect, useRef } from 'react'

/**
 * FinTrack ambient background.
 * - Soft drifting teal/gold glows (pure CSS, GPU-friendly transform/opacity only)
 * - A faint "ledger constellation" canvas: nodes that connect when close, like a quiet financial network
 * - Gently reacts to the cursor, pauses on tab-blur, and disables motion for prefers-reduced-motion
 * - Also carries the global @font-face imports + .font-display / .font-ledger utility classes
 *   used throughout the redesign, so it only needs to be mounted once per page.
 */
export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width, height, dpr
    let nodes = []
    let mouse = { x: -9999, y: -9999 }
    let rafId = null

    const isDark = () => document.documentElement.classList.contains('dark')

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.max(18, Math.min(42, Math.floor((width * height) / 42000)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.8
      }))
    }

    const onMove = e => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }

    const LINK_DIST = 140
    const MOUSE_RADIUS = 130

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const dark = isDark()
      const dotColor = dark ? '148, 210, 214' : '14, 124, 134'
      const lineColor = dark ? '148, 210, 214' : '14, 124, 134'

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        n.x += n.vx
        n.y += n.vy

        const dx = n.x - mouse.x
        const dy = n.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
          n.x += (dx / (dist || 1)) * force * 0.6
          n.y += (dy / (dist || 1)) * force * 0.6
        }

        if (n.x < 0) n.x = width; if (n.x > width) n.x = 0
        if (n.y < 0) n.y = height; if (n.y > height) n.y = 0
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < LINK_DIST) {
            ctx.strokeStyle = `rgba(${lineColor}, ${0.12 * (1 - d / LINK_DIST)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      nodes.forEach(n => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${dotColor}, 0.55)`
        ctx.fill()
      })

      rafId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    const handleVisibility = () => {
      if (document.hidden || prefersReducedMotion) {
        cancelAnimationFrame(rafId)
      } else {
        rafId = requestAnimationFrame(draw)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    if (prefersReducedMotion) {
      draw()
    } else {
      rafId = requestAnimationFrame(draw)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#F5F6FB] dark:bg-[#0B1120] transition-colors duration-500">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
        .font-ledger { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace; font-variant-numeric: tabular-nums; }
        @keyframes fintrack-drift-a { 0%, 100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(40px,-30px,0) scale(1.06); } }
        @keyframes fintrack-drift-b { 0%, 100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(-50px,35px,0) scale(1.08); } }
        @keyframes fintrack-toast-in { from { opacity: 0; transform: translateY(-8px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-fintrack-a { animation: fintrack-drift-a 24s ease-in-out infinite; }
        .animate-fintrack-b { animation: fintrack-drift-b 30s ease-in-out infinite; }
        .animate-toast-in { animation: fintrack-toast-in 0.25s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .animate-fintrack-a, .animate-fintrack-b, .animate-toast-in { animation: none; }
        }
      `}</style>

      {/* Drifting glows — teal + gold, the two anchor accents of the palette */}
      <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-[#0E7C86]/[0.12] dark:bg-[#0E7C86]/[0.18] blur-[110px] animate-fintrack-a" />
      <div className="absolute bottom-[-8rem] right-[-6rem] w-[26rem] h-[26rem] rounded-full bg-[#C9A24B]/[0.14] dark:bg-[#C9A24B]/[0.12] blur-[110px] animate-fintrack-b" />

      {/* Ledger constellation canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90" />

      {/* Soft vignette so content stays legible at the edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F5F6FB]/70 dark:to-[#0B1120]/70" />
    </div>
  )
}
