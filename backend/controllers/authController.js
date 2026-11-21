import User from '../model/user.js'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../utils/sendEmail.js'


export const singup = async (req, resp) => {

    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return resp.status(400).json({
                message: "all fields are required"
            })
        }

        const existEmail = await User.findOne({ email: email.toLowerCase().trim() })
        if (existEmail) {
            return resp.status(400).json({ message: "Email already exist! try with new email." })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpire = Date.now() + 10 * 60 * 1000

        const newUser = new User({
            name, email, password: hashPassword, role: 'owner', isVerified: false, otp, otpExpire
        })
        await newUser.save()

        const message = `
        <h1>Email Verification OTP</h1>
        <p>This is your OTP registration code : </p>
        <h1 style="color: #4f46e5;" >${otp}</h1>
        <p>This code is expire in 10 minuts.</p>
    `

        await sendEmail({
            email: newUser.email,
            subject: "Verify Your Email - OTP Code",
            message
        })

        resp.status(201).json({
            success: true,
            user: { name: newUser.name, email: newUser.email, role: newUser.role },
            message: "OTP send your email Please verify to complete registration."
        })
    } catch (error) {
        return resp.status(500).json({ error: "Internal server error!" })
    }
}
export const verifyOTP = async (req, resp) => {

    try {

        const { otp, email } = req.body

        if (!otp || !email) {
            return resp.status(400).json({ message: "All fields are required!" })
        }

        const user = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } })
        if (!user) {
            return resp.status(400).json({ message: "Invalid Otp or maybe OTP has Expired." })
        }

        user.isVerified = true
        user.otp = undefined
        user.otpExpire = undefined
        await user.save()

        resp.status(200).json({
            success: true,
            message: "Email verification successful. you can login."
        })

    } catch (error) {
        resp.status(500).json({ error: "internal server error!" })
    }

}
export const login = async (req, resp) => {

    try {

        const { email, password } = req.body

        if (!email || !password) {
            return resp.status(400).json({
                success: false,
                message: "email & password are required!"
            })
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() })
        if (!user) {
            return resp.status(400).json({
                success: false,
                message: "Invalid email or password!"
            })
        }

        if (!user.isVerified) {
            return resp.status(400).json({
                success: false,
                message: "Please verify your email with OTP before loggin in.",
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return resp.status(401).json({
                success: false,
                message: "Invalid Password",
            })
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
                workspaceId: user.workspaceId
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '7d'
            }
        )

        resp.status(200).json({
            success: true,
            message: "login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                workspaceId: user.workspaceId,
                isVerified: user.isVerified
            }
        })

    } catch (error) {
        return resp.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}
export const forgotPassword = async (req, resp) => {
    try {

        const { email } = req.body

        const user = await User.findOne({ email: email?.toLowerCase().trim() })
        if (!user) {
            return resp.status(400).json({
                success: false,
                message: "enter correct email!"
            })
        }

        const resetToken = crypto.randomBytes(32).toString('hex')

        user.resetPasswordToken = resetToken
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000
        await user.save()

        resp.status(200).json({
            success: true,
            resetToken,
            message: "password forgot ready type new password to change!"
        })

    } catch (error) {
        return resp.status(500).json({ success: false, message: "internal server error!" })
    }
}
export const resetPassword = async (req, resp) => {
    try {

        const { token } = req.params
        const { newPassword } = req.body

        if (!newPassword) {
            return resp.status(400).json({
                success: false,
                message: "password entered required!"
            })
        }

        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } })
        if (!user) {
            return resp.status(400).json({
                success: false,
                message: 'user not found. time expired!'
            })
        }

        const hashpassword = await bcrypt.hash(newPassword, 10)

        user.password = hashpassword
        user.resetPasswordExpire = undefined
        user.resetPasswordToken = undefined
        await user.save()

        resp.status(200).json({
            success: true,
            message: "Password successfully changed."
        })

    } catch (error) {
        return resp.status(500).json({ success: false, message: "internal server error!" })
    }
}
