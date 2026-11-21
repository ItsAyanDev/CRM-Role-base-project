import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('')
    const { token } = useParams() // 👈 URL se token automatically aa jayega
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch(`http://localhost:4800/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ newPassword }),
                credentials: 'include'
            })
            
            const data = await response.json()
            console.log(data)

            if (response.ok) {
                alert("Password reset successfully!")
                navigate('/login') // Success ke baad login page par bhej dega
            }
        } catch (error) {
            console.log("Error:", error)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-100">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Reset Password</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">New Password</label>
                        <input 
                            type="password" 
                            placeholder='Enter new password' 
                            value={newPassword} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)} 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button 
                        type='submit' 
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200 mt-4"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword