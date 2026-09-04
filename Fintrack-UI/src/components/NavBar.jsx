import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ChevronDownIcon,
  HomeIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  CurrencyRupeeIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline'
import { useNavigate, useLocation } from 'react-router-dom'
import { logout, isAuthenticated } from '../services/auth'
import { useTheme } from '../context/ThemeContext'
import avtar from '../assests/avtar.png'

const navigation = [
  { name: 'Add', href: '/edit', icon: PlusCircleIcon },
  { name: 'Budgets', href: '/MonthlyBudgets', icon: ClipboardDocumentListIcon },
  { name: 'Transactions', href: '/transactions', icon: CurrencyRupeeIcon }
]

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = isAuthenticated()
  const { dark, toggle } = useTheme()

  const goTo = (path, close) => {
    navigate(path)
    close?.()
  }

  const doLogout = async close => {
    await logout()
    close?.()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {/* TOP NAVBAR */}
      <Disclosure as="nav" className="sticky top-0 z-50 bg-[#0B1120]/80 dark:bg-[#080D18]/85 backdrop-blur-xl border-b border-white/[0.06]">
        {({ open, close }) => (
          <>
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex h-16 items-center justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-8">
                  <h1
                    onClick={() => navigate('/')}
                    className="font-display text-xl font-bold text-white cursor-pointer tracking-tight flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#C9A24B]" />
                    FinTrack
                  </h1>

                  {/* DESKTOP MENU */}
                  {auth && (
                    <div className="hidden md:flex gap-1">
                      {navigation.map(item => {
                        const active = location.pathname === item.href
                        return (
                          <button
                            key={item.name}
                            onClick={() => navigate(item.href)}
                            className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                              active ? 'text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {item.name}
                            {active && (
                              <span className="absolute left-3 right-3 -bottom-[1px] h-0.5 rounded-full bg-[#C9A24B]" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                  {/* DARK MODE TOGGLE */}
                  <button
                    onClick={toggle}
                    className="relative flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#0E7C86] focus:ring-offset-2 focus:ring-offset-[#0B1120]"
                    style={{ backgroundColor: dark ? '#0E7C86' : '#334155' }}
                    aria-label="Toggle dark mode"
                  >
                    <span
                      className={`absolute flex items-center justify-center w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        dark ? 'translate-x-8' : 'translate-x-1'
                      }`}
                    >
                      {dark
                        ? <MoonIcon className="w-3 h-3 text-[#0E7C86]" />
                        : <SunIcon className="w-3 h-3 text-[#C9A24B]" />
                      }
                    </span>
                  </button>

                  {!auth ? (
                    <button
                      onClick={() => navigate('/login')}
                      className="px-6 py-2 bg-[#0E7C86] hover:bg-[#0B6971] text-white rounded-xl font-semibold text-sm shadow-lg shadow-[#0E7C86]/25 transition-all duration-200"
                    >
                      Login
                    </button>
                  ) : (
                    <>
                      <button className="hidden md:block text-slate-400 hover:text-white transition-colors">
                        <BellIcon className="h-6 w-6" />
                      </button>

                      {/* PROFILE MENU */}
                      <Menu as="div" className="relative hidden md:block">
                        <MenuButton className="flex items-center gap-2 group">
                          <img src={avtar} className="h-9 w-9 rounded-xl ring-2 ring-white/10 group-hover:ring-[#C9A24B]/50 transition-all" />
                          <ChevronDownIcon className="h-4 w-4 text-slate-400" />
                        </MenuButton>

                        <MenuItems className="absolute right-0 mt-3 w-52 bg-white/90 dark:bg-[#121B2E]/90 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] border border-black/5 dark:border-white/10 p-1.5 overflow-hidden">
                          <MenuItem>
                            <button
                              onClick={() => navigate('/profile')}
                              className="w-full px-4 py-2.5 text-left rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-[#0E7C86]/10 hover:text-[#0E7C86] dark:hover:text-[#7FD0D6] transition-colors"
                            >
                              Profile
                            </button>
                          </MenuItem>
                          <MenuItem>
                            <button
                              onClick={() => navigate('/settings')}
                              className="w-full px-4 py-2.5 text-left rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-[#0E7C86]/10 hover:text-[#0E7C86] dark:hover:text-[#7FD0D6] transition-colors"
                            >
                              Settings
                            </button>
                          </MenuItem>
                          <MenuItem>
                            <button
                              onClick={() => doLogout()}
                              className="w-full px-4 py-2.5 text-left rounded-xl text-sm font-medium text-[#C4514B] hover:bg-[#C4514B]/10 transition-colors"
                            >
                              Logout
                            </button>
                          </MenuItem>
                        </MenuItems>
                      </Menu>
                    </>
                  )}

                  {/* MOBILE TOGGLE */}
                  <DisclosureButton className="md:hidden text-slate-300">
                    {open ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>

            {/* MOBILE DROPDOWN MENU */}
            {auth && (
              <DisclosurePanel className="md:hidden bg-[#0B1120]/95 backdrop-blur-xl px-4 pb-4 space-y-1 border-t border-white/[0.06]">
                {navigation.map(item => (
                  <button
                    key={item.name}
                    onClick={() => goTo(item.href, close)}
                    className="block w-full text-left px-4 py-3 rounded-xl text-slate-200 hover:bg-white/5 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}

                <hr className="border-white/10 my-2" />

                <button
                  onClick={() => goTo('/profile', close)}
                  className="block w-full text-left px-4 py-3 text-slate-200 hover:bg-white/5 rounded-xl transition-colors"
                >
                  Profile
                </button>

                <button
                  onClick={() => goTo('/settings', close)}
                  className="block w-full text-left px-4 py-3 text-slate-200 hover:bg-white/5 rounded-xl transition-colors"
                >
                  Settings
                </button>

                <button
                  onClick={() => doLogout(close)}
                  className="block w-full text-left px-4 py-3 text-[#F0928D] hover:bg-[#C4514B]/10 rounded-xl transition-colors"
                >
                  Logout
                </button>
              </DisclosurePanel>
            )}
          </>
        )}
      </Disclosure>

      {/* MOBILE BOTTOM TAB BAR */}
      {auth && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white/85 dark:bg-[#0B1120]/90 backdrop-blur-xl border-t border-black/5 dark:border-white/10 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.15)] z-50">
          <div className="flex justify-around py-2">
            {navigation.map(item => {
              const Icon = item.icon
              const active = location.pathname === item.href
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
                    active ? 'text-[#0E7C86] dark:text-[#7FD0D6]' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  {item.name}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
