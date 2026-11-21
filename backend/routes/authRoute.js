import express, { Router } from 'express'
import { forgotPassword, login, resetPassword, singup, verifyOTP } from '../controllers/authController.js'
import { addWorkspaceMember, createWorkspace, getSingleWorkspace, getWorkspace } from '../controllers/workspaceController.js'
import { isOwner, isVerify } from '../middleware/authMiddleware.js'

const router = express.Router()


router.get('/workspaces', isVerify, isOwner, getWorkspace)
router.get('/workspace/:id', isVerify, getSingleWorkspace)
router.post('/register', singup)
router.post('/login', login)
router.post('/otp-verify', verifyOTP)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.post('/create-workspace', isVerify, isOwner, createWorkspace)
router.post('/workspace/:id/members', isVerify, addWorkspaceMember);

export default router