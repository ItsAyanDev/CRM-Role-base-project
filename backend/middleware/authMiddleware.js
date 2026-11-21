import jwt from 'jsonwebtoken'

export const isVerify = (req, resp, next) => {
    try {

        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return resp.status(401).json({ success: false, message: "Access denied: No Token provided!" })
        }

        const token = authHeader.split(' ')[1]

        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        req.user = decoded

        next()

    } catch (error) {
        return resp.status(401).json({ success: false, error: "Invalid or expired token" })
    }
}

export const isOwner = (req, resp, next) => {
    if (req.user?.role !== "owner") {
        return resp.status(403).json({
            success: false,
            message: "Only owner allowed!"
        })
    }

    next()
}