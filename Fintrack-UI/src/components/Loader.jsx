import AnimatedBackground from './AnimatedBackground'

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center transition-colors duration-300">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center gap-4 px-10 py-8 rounded-3xl bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)]">
        {/* Spinner */}
        <div className="relative h-11 w-11">
          <div className="absolute inset-0 rounded-full border-2 border-[#0E7C86]/15" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#0E7C86] dark:border-t-[#7FD0D6] animate-spin" />
        </div>

        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 font-display">{text}</p>
      </div>
    </div>
  )
}
