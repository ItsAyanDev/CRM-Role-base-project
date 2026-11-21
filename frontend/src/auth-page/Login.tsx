import { Link, useNavigate } from 'react-router-dom'
import heroVideo from '../assets/Hero_Video.mp4'
import Toast, { type ToastData } from '../component/Toast'
import { Lock, X } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'

interface LoginUser {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  message: string
  token: string
  user: {
    id: string
    name: string
    email: string
    role: string
    workspaceId?: string
    isVerified: boolean
  }
}

interface LoginProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}



function Login({ setIsAuthenticated }: LoginProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginUser>({ email: '', password: '' })
  const [toast, setToast] = useState<ToastData | null>(null)

  // Forgot & Reset Modal States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalStep, setModalStep] = useState<'forgot' | 'reset'>('forgot')
  const [forgotEmail, setForgotEmail] = useState<string>('')
  const [resetToken, setResetToken] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3500) // 3.5 seconds baad khud gayab
  }


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // 1. Login Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const response = await fetch('http://localhost:4800/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(formData)
    })
    const data: LoginResponse = await response.json()
    console.log(data)

    if (response.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setIsAuthenticated(true)
      showToast(data.message || "Login successful.", 'success')
      setFormData({ email: '', password: '' })
      navigate('/workspaces')
    } else {
      showToast(data.message || 'Invalid email or password!', 'error')
    }
  }

  // 2. Forgot Password Handler (Email -> resetToken)
  const handleForgotSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:4800/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      })
      const data = await response.json()

      if (response.ok && data.resetToken) {
        setResetToken(data.resetToken)
        setModalStep('reset')
      } else {
        alert(data.message || 'Enter correct email!')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
    } finally {
      setLoading(false)
    }
  }

  // 3. Reset Password Handler (resetToken + newPassword)
  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`http://localhost:4800/api/auth/reset-password/${resetToken}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ newPassword })
      })
      const data = await response.json()

      if (response.ok) {
        alert(data.message || 'Password successfully changed.')
        closeModal()
      } else {
        alert(data.message || 'User not found or time expired!')
      }
    } catch (error) {
      console.error('Reset password error:', error)
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalStep('forgot')
    setForgotEmail('')
    setResetToken('')
    setNewPassword('')
  }

  return (
    <div className='flex justify-center py-[10%]'>
      <video src={heroVideo} loop playsInline muted autoPlay className='fixed inset-0 -z-20 h-full w-full object-cover' />

      <div className='flex justify-center py-[10%]'>
        <Toast toast={toast} onClose={() => setToast(null)} />
        {/* Baqi video aur login card */}
      </div>

      {/* Main Login Card */}
      <div className='border-white/15 h-120 border-2 w-full max-w-md mx-4 rounded-2xl flex flex-col gap-8 items-center justify-center shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-xl backdrop-saturate-150'>
        <div className='flex justify-center items-center gap-2 bg-white/30 border-white/50 border-2 rounded-2xl px-4 py-1'>
          <span className='w-2 h-2 rounded-full bg-green-500'></span>
          <Lock size={12} color='green' />
          <h4 className='text-slate-600 text-sm font-semibold'>Secure Workspace Access</h4>
        </div>
        <div className='text-center'>
          <h2 className='font-bold text-3xl text-slate-800'>Welcome Back</h2>
          <p className='text-slate-600 text-sm text-center px-4'>Access your team workspace and customer dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className='flex justify-center items-center flex-col gap-3 w-full'>
          <input type='email' placeholder='Work Email' value={formData.email} onChange={handleChange} name='email' required
            className='bg-white/30 border-white/30 outline-none border-2 py-2 px-4 rounded-2xl w-[80%] shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-xl backdrop-saturate-150' />
          <input type='password' placeholder='Password' value={formData.password} onChange={handleChange} name='password' required
            className='bg-white/30 border-white/30 outline-none border-2 py-2 px-4 rounded-2xl w-[80%] shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-xl backdrop-saturate-150' />
          <div className='flex justify-between w-[80%] text-sm'>
            <div className='flex items-center gap-2 text-slate-800 font-semibold'>
              <input type='checkbox' id='remember' />
              <label htmlFor='remember'>Remember Me</label>
            </div>
            <button type='button' onClick={() => setIsModalOpen(true)} className='cursor-pointer text-blue-600 underline font-medium'>Forgot Password?</button>
          </div>
          <button type='submit' className='cursor-pointer w-[80%] bg-slate-800 hover:bg-blue-600 transition-colors py-2.5 rounded-3xl text-white font-semibold'>Sign In</button>
          <p className='text-slate-600 text-sm'> Don't have a workspace?{' '}<Link to={'/register'} className='text-blue-600 hover:underline font-medium'>Create One</Link></p>
        </form>
      </div>

      {isModalOpen && (
        <div onClick={closeModal} className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm px-4'>
          <div onClick={(e) => e.stopPropagation()} className='relative w-full max-w-md rounded-3xl border border-white/80 bg-white/75 p-8 flex flex-col items-center gap-4 shadow-[0_20px_50px_rgba(15,23,42,0.15),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-2xl backdrop-saturate-150'>

            <button type='button' onClick={closeModal} className='cursor-pointer absolute top-4 right-4 rounded-full p-1.5 text-slate-500 hover:bg-white/60 hover:text-slate-800'>
              <X size={18} />
            </button>

            <div className='inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-1 shadow-sm'>
              <span className='h-2 w-2 rounded-full bg-blue-600 animate-pulse'></span>
              <span className='text-xs font-semibold text-slate-600'>{modalStep === 'forgot' ? 'Account Recovery' : 'Set New Password'}</span>
            </div>

            {modalStep === 'forgot' ? (
              <>
                <div className='text-center'>
                  <h3 className='text-2xl font-extrabold text-slate-900'>Forgot Password</h3>
                  <p className='mt-1 text-sm text-slate-500'> Enter your registered work email to reset your password </p>
                </div>

                <form onSubmit={handleForgotSubmit} className='mt-2 flex w-full flex-col gap-4'>
                  <input type='email' placeholder='Work Email' value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required
                    className='w-full rounded-2xl border border-slate-200/80 bg-white/80 py-2.5 px-4 text-slate-900 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10' />
                  <button type='submit' disabled={loading}
                    className='cursor-pointer w-full rounded-full bg-slate-900 hover:bg-blue-600 transition-colors py-2.5 text-sm font-semibold text-white disabled:opacity-50'>{loading ? 'Verifying...' : 'Continue'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className='text-center'>
                  <h3 className='text-2xl font-extrabold text-slate-900'>Create New Password</h3>
                  <p className='mt-1 text-sm text-slate-500'>Enter a new password for <span className='font-semibold text-slate-800'>{forgotEmail}</span></p>
                </div>

                <form onSubmit={handleResetSubmit} className='mt-2 flex w-full flex-col gap-4'>
                  <input type='password' placeholder='New Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className='w-full rounded-2xl border border-slate-200/80 bg-white/80 py-2.5 px-4 text-slate-900 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10' />
                  <button type='submit' disabled={loading} className='cursor-pointer w-full rounded-full bg-slate-900 hover:bg-blue-600 transition-colors py-2.5 text-sm font-semibold text-white disabled:opacity-50'>{loading ? 'Updating...' : 'Update Password'}</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Login