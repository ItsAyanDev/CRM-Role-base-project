import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import authRoute from './routes/authRoute.js'

const app = express()

connectDB()

app.use(cors({ credentials: true, origin: "http://localhost:5173" }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/auth', authRoute)





app.listen(4800)