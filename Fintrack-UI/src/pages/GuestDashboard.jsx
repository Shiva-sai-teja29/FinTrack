import { useNavigate } from 'react-router-dom'
import AnimatedBackground from '../components/AnimatedBackground'

export default function GuestDashboard() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen transition-colors duration-300">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-24 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E7C86]/10 border border-[#0E7C86]/20 text-[#0E7C86] dark:text-[#7FD0D6] text-xs font-semibold tracking-wide uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]" />
          Every rupee, accounted for
        </span>

        <h1 className="font-display text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.05]">
          Take control of<br className="hidden sm:block" /> your money
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
          FinTrack helps you track income, control expenses, set budgets,
          and gain clear insights into your financial life — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-4 text-base font-semibold text-white rounded-2xl bg-[#0E7C86] hover:bg-[#0B6971] shadow-xl shadow-[#0E7C86]/25 hover:shadow-2xl hover:shadow-[#0E7C86]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            Login
          </button>

          <button
            onClick={() => navigate('/register')}
            className="px-10 py-4 text-base font-semibold rounded-2xl border-2 border-[#C9A24B] text-[#9C7B34] dark:text-[#E4C579] hover:bg-[#C9A24B]/10 transition-all duration-300"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <Feature
            title="Smart Expense Tracking"
            desc="Track where your money goes with category-wise analytics and monthly insights."
            icon="💳"
          />
          <Feature
            title="Monthly Budgets"
            desc="Set monthly limits and instantly see how much you can still spend."
            icon="📊"
          />
          <Feature
            title="Visual Analytics"
            desc="Pie charts and summaries that make your finances easy to understand."
            icon="📈"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 bg-[#0B1120] py-20 text-center text-white">
        <h2 className="font-display text-4xl font-bold mb-4">
          Ready to manage money better?
        </h2>
        <p className="text-lg mb-8 text-slate-400">
          Join FinTrack today and bring clarity to your finances.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="px-12 py-4 bg-[#C9A24B] hover:bg-[#D9B563] text-[#0B1120] font-bold rounded-2xl shadow-xl shadow-[#C9A24B]/20 hover:-translate-y-0.5 transition-all duration-300"
        >
          Get Started
        </button>
      </section>
    </div>
  )
}

function Feature({ title, desc, icon }) {
  return (
    <div className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-xl rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] hover:shadow-[0_16px_40px_-12px_rgba(15,23,42,0.18)] hover:-translate-y-1 transition-all duration-300 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}
