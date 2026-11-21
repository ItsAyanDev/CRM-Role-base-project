import { useState, type ChangeEvent, type FormEvent } from "react"
import heroVideo from '../assets/Hero_Video.mp4'
import imageWorkspaceBG from '../assets/workspace-image-blue.jpg'

interface Workspace {
    name: string,
    description: string
}

function CWorkspace() {

    const [formData, setFormData] = useState<Workspace>({ name: '', description: '' })

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const token = localStorage.getItem('token')

        const response = await fetch("http://localhost:4800/api/auth/create-workspace", {
            method: "POST",
            headers: { 'content-type': 'application/json' , 'Authorization' : `Bearer ${token}` },
            body: JSON.stringify(formData),
            credentials: 'include'
        })
        const data: Workspace = await response.json()
        console.log(data)
        if (response.ok) {
            setFormData({ name: '', description: '' })
            alert("Workspace Created. You can access your workspace")
        }

    }


    return (
        <div className="flex justify-center items-center" >
            <video src={heroVideo} loop playsInline muted autoPlay className='fixed inset-0 -z-20 h-full w-full object-cover' />

            <div className='border-white/15 h-screen border-2 w-full max-w-screen mx-4 rounded-2xl flex flex-col gap-8 items-center justify-center shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-xl backdrop-saturate-150'>
                <div className="flex flex-col lg:flex-row justify-center items-center gap-8 w-full max-w-5xl">
                    {/* LEFT SIDE: Glassmorphic Create Workspace Form */}
                    <div className="w-full max-w-md rounded-3xl bg-white/40 border-2 border-white/50 p-7 shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-xl backdrop-saturate-150">
                        {/* Form Header */}
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-500/10 border border-blue-500/20 rounded-full mb-2.5">
                                New Workspace
                            </span>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                                Create your workspace
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Your team, leads and projects Orginize in one place.
                            </p>
                        </div>

                        {/* Form */}
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit} >
                            {/* Workspace Name Field */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5 px-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Workspace Name</label>
                                    <span className="text-[11px] text-slate-400">Required</span>
                                </div>
                                <input type="text" name="name" required placeholder="e.g. Nexus Digital Studio" value={formData.name} onChange={handleChange} className="w-full bg-white/45 border-2 border-white/50 focus:border-blue-500/60 focus:bg-white/75 focus:ring-4 focus:ring-blue-500/10 outline-none py-2.5 px-4 rounded-2xl text-slate-800 placeholder:text-slate-400 text-sm font-medium shadow-[0_4px_20px_rgba(15,23,42,0.05),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-xl transition-all" />
                            </div>

                            {/* Description Field */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5 px-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Description</label>
                                    <span className="text-[11px] text-slate-400">{formData.description.length}/120</span>
                                </div>
                                <textarea name="description" required rows={3} placeholder="Is workspace ka maqsad aur team workflow likhein..." value={formData.description} onChange={handleChange} className="w-full bg-white/45 border-2 border-white/50 focus:border-blue-500/60 focus:bg-white/75 focus:ring-4 focus:ring-blue-500/10 outline-none py-2.5 px-4 rounded-2xl text-slate-800 placeholder:text-slate-400 text-sm leading-relaxed resize-none shadow-[0_4px_20px_rgba(15,23,42,0.05),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-xl transition-all" />
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="mt-2 w-full cursor-pointer bg-slate-800 hover:bg-blue-600 active:scale-[0.99] transition-all duration-200 py-3 px-5 rounded-2xl text-white font-semibold text-sm shadow-lg shadow-slate-900/15 hover:shadow-blue-600/25 flex items-center justify-center gap-2">
                                <span>Create Workspace</span>
                                <span className="text-base">→</span>
                            </button>
                        </form>
                    </div>

                    {/* RIGHT SIDE: Glassmorphic Workspace Preview Card */}
                    <div className="w-full max-w-sm rounded-3xl bg-white/40 border-2 border-white/50 p-4 shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300">
                        {/* Top Banner Image with Badge Overlay */}
                        <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-200">
                            <img
                                src={imageWorkspaceBG}
                                alt="workspaceBackground"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                            <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase bg-white/80 backdrop-blur-md text-slate-800 rounded-full shadow-sm">
                                Preview
                            </span>
                        </div>

                        {/* Overlapping Workspace Avatar / Initials */}
                        <div className="px-2 relative">
                            <div className="-mt-7 mb-3 w-14 h-14 rounded-2xl bg-slate-800 border-4 border-white/90 text-white flex items-center justify-center font-bold text-lg shadow-md">
                                {formData.name ? formData.name.slice(0, 2).toUpperCase() : "WS"}
                            </div>

                            {/* Workspace Title & Description */}
                            <h1 className="text-xl font-bold text-slate-800 truncate">
                                {formData.name || "Workspace Name"}
                            </h1>
                            <p className="text-sm text-slate-600 mt-1.5 line-clamp-2 min-h-[40px] leading-relaxed">
                                {formData.description || "Description About Workspace"}
                            </p>

                            {/* Bottom Metadata Footer */}
                            <div className="mt-5 pt-3.5 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="font-medium text-slate-700">Active Environment</span>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-800/5 text-slate-700 font-medium">
                                    Owner Role
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CWorkspace

