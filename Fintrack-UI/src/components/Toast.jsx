export function Toast({ message, type }) {
  if (!message) return null

  const styles = {
    success: {
      bar: 'bg-[#3F9868]',
      icon: '✓',
      iconBg: 'bg-[#3F9868]/15 text-[#3F9868] dark:text-[#6FCB99]'
    },
    error: {
      bar: 'bg-[#C4514B]',
      icon: '!',
      iconBg: 'bg-[#C4514B]/15 text-[#C4514B] dark:text-[#F0928D]'
    },
    info: {
      bar: 'bg-[#0E7C86]',
      icon: 'i',
      iconBg: 'bg-[#0E7C86]/15 text-[#0E7C86] dark:text-[#8FD8DD]'
    }
  }

  const s = styles[type] ?? styles.info

  return (
    <div className="fixed top-5 right-5 z-50 animate-toast-in">
      <div className="flex items-center gap-3 pl-4 pr-5 py-3 rounded-2xl bg-white/80 dark:bg-[#121B2E]/80 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.25)] overflow-hidden relative">
        <span className={`absolute left-0 top-0 bottom-0 w-1 ${s.bar}`} />
        <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold font-display ${s.iconBg}`}>
          {s.icon}
        </span>
        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{message}</span>
      </div>
    </div>
  )
}
