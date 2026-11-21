import { Layers, ArrowUpRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated?: boolean;
}

export default function HeroNavbar({ isAuthenticated = false }: NavbarProps) {

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token'),
    localStorage.removeItem('user')
    navigate("/login")
  }

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="relative flex w-full max-w-3xl items-center justify-between rounded-full border border-white/80 bg-white/60 px-3.5 py-2 shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-xl backdrop-saturate-150">
        {/* Top Liquid Highlight Line */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

        {/* Left: Brand Logo */}
        <a href="/" className="flex items-center gap-2.5 pl-1.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-600/25">
            <Layers className="h-4 w-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            Nexus<span className="text-blue-600">CRM</span>
          </span>
        </a>

        {/* Center: Subtle Status Pill (Khaali na lage is liye) */}
        <div className="hidden items-center gap-1.5 rounded-full border border-white/90 bg-white/65 px-3.5 py-1 text-xs font-medium text-slate-600 shadow-xs sm:flex">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>Multi-Tenant Workspace Portal</span>
        </div>

        {/* Right: Auth Buttons (Ya Workspace Button agar logged in ho) */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <button onClick={handleLogout} className="cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-white/70 hover:text-slate-900"
              >Log out</button>
              <button onClick={() => navigate('/workspaces')} className="group inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700">
                My Workspaces
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-white/70 hover:text-slate-900">
                Log In </button>
              <button onClick={() => navigate('/register')} className="cursor-pointer group inline-flex items-center gap-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(15,23,42,0.18)] transition-all hover:bg-blue-600 hover:shadow-blue-600/30">
                Sign Up <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}