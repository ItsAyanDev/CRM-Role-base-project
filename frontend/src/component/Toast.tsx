import { CheckCircle2, AlertCircle, X } from 'lucide-react'

export interface ToastData {
  message: string
  type: 'success' | 'error'
}

interface ToastProps {
  toast: ToastData | null
  onClose: () => void
}

function Toast({ toast, onClose }: ToastProps) {
  if (!toast) return null

  const isSuccess = toast.type === 'success'

  return (
    <div className='fixed top-5 right-5 z-[100] flex items-center gap-3 rounded-2xl border border-white/80 bg-white/85 px-4 py-3 shadow-[0_12px_32px_rgba(15,23,42,0.12)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 animate-[slideIn_0.3s_ease-out]'>
      {isSuccess ? (
        <CheckCircle2 size={20} className='shrink-0 text-emerald-600' />
      ) : (
        <AlertCircle size={20} className='shrink-0 text-rose-600' />
      )}

      <p className='text-sm font-semibold text-slate-800'>{toast.message}</p>

      <button
        type='button'
        onClick={onClose}
        className='cursor-pointer ml-1 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700'
      >
        <X size={15} />
      </button>
    </div>
  )
}

export default Toast