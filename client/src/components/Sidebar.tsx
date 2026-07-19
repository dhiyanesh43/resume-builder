import { Link } from 'react-router-dom'
import { FileText, LayoutGrid, Moon, Sun, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 border-r border-border bg-card flex flex-col">
      <div className="px-5 py-5 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <FileText size={16} className="text-white" strokeWidth={2.25} />
        </div>
        <span className="font-display font-semibold text-ink text-[15px]">ResumeForge</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-ink bg-surface"
        >
          <LayoutGrid size={16} />
          Dashboard
        </Link>
      </nav>

      <div className="px-3 pb-4 space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-ink-soft hover:bg-surface hover:text-ink transition-colors"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>

        <div className="flex items-center gap-2.5 px-3 py-2.5 mt-2 rounded-xl bg-surface">
          <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-ink truncate">{user?.name}</p>
            <p className="text-[11px] text-ink-faint truncate">{user?.email}</p>
          </div>
          <button onClick={logout} className="text-ink-faint hover:text-danger shrink-0" title="Log out">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
