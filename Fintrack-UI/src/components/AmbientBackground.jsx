export default function AmbientBackground({ variant = 'default' }) {
  const variants = {
    default: {
      first: 'bg-indigo-500/20',
      second: 'bg-cyan-400/15',
      third: 'bg-violet-500/15'
    },
    warm: {
      first: 'bg-violet-500/20',
      second: 'bg-fuchsia-400/15',
      third: 'bg-blue-500/15'
    },
    green: {
      first: 'bg-emerald-500/15',
      second: 'bg-cyan-400/15',
      third: 'bg-indigo-500/15'
    }
  }

  const colors = variants[variant] || variants.default

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base atmospheric gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 dark:from-[#070b17] dark:via-[#0b1020] dark:to-[#080b14]" />

      {/* Floating ambient lights */}
      <div
        className={`absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full ${colors.first} blur-3xl animate-[float_18s_ease-in-out_infinite]`}
      />

      <div
        className={`absolute right-[-120px] top-[20%] h-[500px] w-[500px] rounded-full ${colors.second} blur-3xl animate-[floatReverse_22s_ease-in-out_infinite]`}
      />

      <div
        className={`absolute bottom-[-180px] left-[25%] h-[480px] w-[480px] rounded-full ${colors.third} blur-3xl animate-[float_24s_ease-in-out_infinite]`}
      />

      {/* Fine light grid */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(2,6,23,.06)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,.35)_100%)]" />

      {/* CSS animation definitions */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            33% {
              transform: translate3d(70px, 40px, 0) scale(1.08);
            }
            66% {
              transform: translate3d(-35px, 80px, 0) scale(.94);
            }
          }

          @keyframes floatReverse {
            0%, 100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            33% {
              transform: translate3d(-80px, 50px, 0) scale(.95);
            }
            66% {
              transform: translate3d(30px, -60px, 0) scale(1.08);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
            }
          }
        `}
      </style>
    </div>
  )
}