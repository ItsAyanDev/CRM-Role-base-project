import { Link, useNavigate } from 'react-router-dom'
import heroVideo from '../assets/Hero_Video.mp4'
import { useState, type ChangeEvent, type FormEvent } from 'react'

interface Registers {
  name: string,
  email: string,
  password: string
}

function Register() {

  const navigate = useNavigate()
  const [formData, setFormData] = useState<Registers>({ name: '', email: '', password: '' })
  const [otpEmail, setOtpEmail] = useState<string>('')
  const [otp, setOTP] = useState<string>('')
  const [isOTPEmailOpen, setIsOTPEmailOpen] = useState<boolean>(false)




  const handleChagne = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleOTPSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:4800/api/auth/otp-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: otpEmail,
          otp: otp
        })
      })

      const data = await response.json()
      console.log(data)

      if (response.ok) {
        setOTP('')
        setOtpEmail('')
        setIsOTPEmailOpen(false)
        navigate('/login') // Verify hote hi Login page par bhej dega
      } else {
        alert(data.message || "Invalid or expired OTP")
      }
    } catch (error) {
      console.log("OTP verification error:", error)
    }
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()

    const response = await fetch("http://localhost:4800/api/auth/register", {
      method: "POST",
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: "include"
    })
    const data: Registers = await response.json()
    console.log(data)
    if (response.ok) {
      setIsOTPEmailOpen(true)
      setOtpEmail(formData.email)
      setFormData({ name: '', email: '', password: '' })
    }
  }

  return (
    <div className='flex justify-center py-[10%]' >

      <video src={heroVideo} loop playsInline muted autoPlay className='fixed inset-0 -z-20 h-full w-full object-cover ' />



      {isOTPEmailOpen ? (
        <>
          <div className="w-full max-w-md mx-4 rounded-3xl border border-white/80 bg-white/65 p-8 flex flex-col items-center gap-4 shadow-[0_20px_50px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-2xl backdrop-saturate-150">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-600">Email Verification</span>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-slate-900">Verify Your Email</h2>
              <p className="mt-1 text-sm text-slate-500">We sent a 6-digit code to <span className="font-semibold text-slate-800">{otpEmail}</span></p>
            </div>
            <form onSubmit={handleOTPSubmit} className="mt-2 flex w-full flex-col gap-4">
              <input type="text" maxLength={6} placeholder="• • • • • •" value={otp} onChange={(e) => setOTP(e.target.value)}
                className="w-full rounded-2xl border border-slate-200/80 bg-white/80 py-3 px-4 text-center text-xl font-bold tracking-[0.5em] text-slate-900 placeholder:tracking-[0.3em] placeholder:text-slate-400 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10" />

              <button type="submit" className="w-full cursor-pointer rounded-full bg-slate-900 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(15,23,42,0.18)] transition-all hover:bg-blue-600 hover:shadow-blue-600/30">
                Verify & Continue</button>
            </form>
            <button type="button" onClick={() => setIsOTPEmailOpen(false)}
              className="mt-1 cursor-pointer text-xs font-medium text-slate-500 hover:text-blue-600 hover:underline">Entered wrong email? Go back</button>
          </div>
        </>
      ) :
        <div className='border-white/15 h-120 border-2 w-[30%] rounded-2xl py-5 flex flex-col gap-10 items-center justify-center shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-xl backdrop-saturate-150 ' >

          <div className='flex justify-center items-center gap-2 bg-white/60 border-white/15 rounded-2xl w-[70%] ' >
            <span className='w-2 h-2 rounded-full bg-blue-600'></span>
            <h4 className='text-slate-600 text-lg' >Owner Workspace Setup</h4>
          </div>
          <div className='text-center flex gap-3 flex-col' >
            <h2 className='font-bold text-3xl text-slate-800 ' >Create Your Workspace</h2>
            <p className='text-slate-600 text-sm' >Start managing yout team and leads is seconds</p>
          </div>
          <form onSubmit={handleRegister} className='flex justify-center items-center flex-col gap-3 w-full' >
            <input type="text" placeholder='Full Name' onChange={handleChagne} value={formData.name} name='name'
              className='bg-white/30 border-white/30 outline-none border-2 py-1 px-3 rounded-2xl w-[80%] shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-xl backdrop-saturate-150 ' />
            <input type="email" placeholder='Work Email' onChange={handleChagne} value={formData.email} name='email'
              className='bg-white/30 border-white/30 outline-none border-2 py-1 px-3 rounded-2xl w-[80%] shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-xl backdrop-saturate-150 ' />
            <input type="password" placeholder='Password' onChange={handleChagne} value={formData.password} name='password'
              className='bg-white/30 border-white/30 outline-none border-2 py-1 px-3 rounded-2xl w-[80%] shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-xl backdrop-saturate-150 ' />
            <button type='submit' className='w-[80%] bg-slate-800 py-2 rounded-3xl text-white font-semibold' >Create Account</button>
            <p className='text-slate-600' >Already have a workspace? <Link to={'/login'} className='text-blue-600 hover:underline' >Log in</Link> </p>
          </form>

        </div>
      }

    </div>
  )
}

export default Register