import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {

            const response = await fetch("http://localhost:4800/api/auth/forget-password", {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email }),
                credentials: "include"
            })
            const data = await response.json()
            console.log(data)

            if (response.ok) {
                navigate(`/reset-password/${data.resetToken}`)
                setMessage("Password reset link sent! Check your console/email.")
            } else {
                setMessage(data.message || "Something went wrong.")
            }
        } catch (error) {
            console.log("Error:", error)
            setMessage("Server error.")
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-100">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Forgot Password</h2>

                {message && (
                    <div className="mb-4 p-3 text-sm text-indigo-700 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
                        <input type="email" placeholder='Enter your email' value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type='submit'
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200 mt-4"
                    >
                        Send Reset Link
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link to="/login" className="text-sm text-indigo-600 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword