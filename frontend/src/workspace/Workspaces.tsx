import React, { useEffect, useState } from "react";
import videoHero from '../assets/Hero_Video.mp4'
import {
    LayoutDashboard,
    LogOut,
    Search,
    Plus,
    Sparkles,
    ArrowUpRight,
    Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Workspace {
    _id: string;
    name: string;
    description: string;
    owner: string;
}

function Workspaces() {
    const [searchQuery, setSearchQuery] = useState("");
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [ownerName, setOwnerName] = useState<string>('')
    const [ownerEmail, setOwnerEmail] = useState<string>('')
    const navigate = useNavigate()

    const filteredWorkspaces = workspaces.filter((ws) =>
        ws.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const token = localStorage.getItem("token")

    const handleGetWorkspaces = async () => {
        const response = await fetch("http://localhost:4800/api/auth/workspaces", {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        if (response.ok) {
            setWorkspaces(data.workspaces || [])
            setOwnerEmail(data.owner.email)
            setOwnerName(data.owner.name)
        }
    }

    useEffect(() => {
        handleGetWorkspaces()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-transparent text-slate-900">

            {/* Optional: Apni Hero_Video.mp4 ya mesh wave background image yahan laga sakte ho */}
            <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover opacity-55" >
                <source src={videoHero} type="video/mp4" />
            </video>

            {/* Soft Glass Overlay taake cards aur text bilkul crisp dikhein */}
            <div className="fixed inset-0 bg-transparent backdrop-blur-[2px]   " />

            {/* MAIN LAYOUT WRAPPER */}
            <div className="relative z-10 min-h-screen flex p-4 gap-4">

                {/* 1. LEFT FLOATING GLASS SIDEBAR */}
                <aside className="w-60 shrink-0 rounded-3xl bg-white/25 border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-2xl flex flex-col justify-between p-4">

                    {/* Top Brand + Nav */}
                    <div>
                        {/* Brand Pill */}
                        <div className="flex items-center gap-2.5 px-2.5 py-2 mb-6">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-600/30">
                                <Layers className="w-4 h-4" />
                            </div>
                            <span className="text-base font-bold tracking-tight text-slate-900">
                                Nexus<span className="text-blue-600">CRM</span>
                            </span>
                        </div>

                        {/* Sidebar Link: Dashboard */}
                        <nav className="space-y-1.5">
                            <button
                                type="button"
                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full bg-blue-600 text-white font-medium text-sm shadow-md shadow-blue-600/25 cursor-pointer transition-all"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Dashboard</span>
                            </button>
                        </nav>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-3 border-t border-white/70">
                        <button type="button" onClick={handleLogout} className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full bg-white/60 hover:bg-red-500 hover:text-white text-slate-700 border border-white/80 font-medium text-sm shadow-xs transition-all cursor-pointer">
                            <LogOut className="w-4 h-4" />
                            <span>Log out</span>
                        </button>
                    </div>
                </aside>

                {/* 2. right side */}
                <div className="flex-1 flex flex-col min-w-0 gap-6">

                    <header className="h-16 px-5 rounded-full bg-white/50 border-2 border-white/80 shadow-[0_8px_30px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-2xl flex items-center justify-between gap-4">

                        {/* Navbar Search: Workspaces Search */}
                        <div className="relative w-full max-w-md">
                            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input type="text" placeholder="Search workspaces..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-500/10 border-2 border-white focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm text-slate-800 placeholder:text-slate-400 transition-all"
                            />
                        </div>

                        {/* Navbar Right: Owner Name & Email */}
                        <div className="flex items-center gap-3 shrink-0 pr-1">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-900 leading-tight"> {ownerName} </p>
                                <p className="text-xs text-slate-500">{ownerEmail}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm shadow-blue-600/30">
                                {/* {owner.name.slice(0, 2).toUpperCase()} */}
                                {ownerName.slice(0, 2)}
                            </div>
                        </div>
                    </header>

                    {/* center area navbar or sidebar */}
                    <main className="flex-1 flex flex-col items-center justify-start pt-4 px-4 max-w-6xl w-full mx-auto">

                        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/55 border border-white/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] backdrop-blur-xl text-xs font-medium text-slate-700 mb-4">
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                            <span>Multi - Tenant Workspace Portal</span>
                        </div>

                        <div className="text-center mb-10">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"> Your Active{" "}
                                <span className="text-blue-600">Workspaces</span>
                            </h1>
                            <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
                                Select Your isolated workspace or create new workspace to organize your team.
                            </p>
                        </div>

                        {/* Workspaces Cards Grid */}
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                            {/* Create New Workspace Glass Card */}
                            <div onClick={() => navigate('/workspace')}
                                className="rounded-3xl bg-white/45 hover:bg-white/75 border-2 border-dashed border-blue-400/50 hover:border-blue-600 p-6 backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-[195px] cursor-pointer transition-all group">
                                <div className="w-12 h-12 rounded-full bg-blue-600/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center mb-3 shadow-xs transition-all">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-base">Create Workspace</h3>
                                <p className="text-xs text-slate-500 mt-1">Start a new isolated CRM environment</p>
                            </div>

                            {/* Workspaces List */}
                            {filteredWorkspaces.map((ws) => (
                                <div key={ws._id} onClick={()=>navigate(`/workspace/${ws._id}`)}
                                    className="rounded-3xl bg-white/60 hover:bg-white/85 border border-white/85 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-2xl flex flex-col justify-between min-h-[195px] cursor-pointer transition-all group"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-blue-600/25">
                                                {ws.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <span className="w-9 h-9 rounded-full bg-white/80 border border-white text-slate-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </span>
                                        </div>

                                        <h2 className="text-lg font-bold text-slate-900 truncate">
                                            {ws.name}
                                        </h2>
                                        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                                            {ws.description}
                                        </p>
                                    </div>

                                    <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                                        <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium"> <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Owner Access </span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-600 font-semibold"> Open ↗ </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty Search State */}
                        {filteredWorkspaces.length === 0 && (
                            <div className="mt-8 px-6 py-3 rounded-full bg-white/60 border border-white/80 backdrop-blur-xl text-sm text-slate-600">
                                "<span className="font-semibold text-slate-900">{searchQuery}</span>" No Workspace Yet!
                            </div>
                        )}

                    </main>
                </div>

            </div>
        </div>
    );
}

export default Workspaces;