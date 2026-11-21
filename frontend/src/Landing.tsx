import heroVideo from './assets/Hero_Video.mp4'

function Landing() {
    return (
        <>
            <div className='relative min-h-screen w-full overflow-hidden flex justify-center ' >
                <video src={heroVideo} loop playsInline muted autoPlay className='fixed inset-0 -z-20 h-full w-full object-cover ' />
                <div className="fixed inset-0 -z-10 bg-white/10 backdrop-blur-[2px]" />
                <div className='flex flex-col items-center justify-center gap-4' >
                    <div className='flex items-center justify-between pr-30 w-xl rounded-full border border-white/80 bg-white/15 px-4 py-2 shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-xl backdrop-saturate-150' >
                        <span className='md:h-3 h-2 md:w-3 w-2 bg-blue-600 rounded-full ' ></span>
                        <h4 className='text-slate-500 font-semibold md:text-lg text-sm ' >Multi - Tenant Workspace Architecture</h4>
                    </div>
                    <div className='text-center' >
                        <h1 className='md:text-6xl text-3xl font-extrabold' >Manage Your Customers</h1>
                        <h2 className='md:text-6xl text-2xl font-extrabold text-blue-600' >Smartly & Faster</h2>
                    </div>
                    <p className='md:text-lg text-sm text-center text-slate-600' >Track leads, isolate team workspaces, and close deals in one clean, lightning - fast CRM built for modern businesses.</p>
                </div>
            </div>
        </>

    )
}

export default Landing