import nodemailter from 'nodemailer'

export const sendEmail = async (options) => {
    try {
        const transporter = nodemailter.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOption = {
            from: `MERN Auth App <${process.env.EMAIL}> `,
            to: options.email,
            subject: options.subject,
            html: options.message
        }

        const info = await transporter.sendMail(mailOption)
        console.log(`Email send successfully : `, info.response )
    } catch (error) {
        console.log("Email sending error : ", error)
    }
}