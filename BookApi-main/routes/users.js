require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require("../models/user")
const UserVerification = require("../models/userVerification")


const nodemailer = require("nodemailer")

//unique string
const { v4: uuidv4 } = require("uuid")


let mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
})

mailer.verify((error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log("ready for transprot")

    }
})

//send verification email

const sendVerificationEmail = ({ _id, email }, res) => {
    const currentUrl = "http://localhost:8000/";

    const uniqueString = uuidv4() + _id;


    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        Subject: 'Verify your email',
        html: `<p>Verify your email address to complete signup process.</p>.<p>This link <b>expires in 6 hours</b>.</p>
        <a href=${currentUrl + "user/verify/" + _id + "/" + uniqueString}>Click here </a>`

    }

    const saltRounds = 10
    bcrypt.hash(uniqueString, saltRounds).then(
        (hashedUniqueString) => {
            const newVerification = new UserVerification({
                userId: _id,
                uniqueString: hashedUniqueString,
                createdAt: Date.now(),
                expiredAt: Date.now() + 2160000
            })

            newVerification.save().then(
                () => {
                    mailer.sendMail(mailOptions).then(
                        () => {
                            res.json({
                                status: 'PENDING',
                                message: 'VERIFICATION'
                            })
                        }
                    ).catch((e) => {
                        res.json({
                            status: "SUCCESS",
                            message: "Sending Verification email failed"
                        })
                    })
                }
            ).catch(
                () => {
                    res.json({
                        status: 'FAILED',
                        message: 'Couldnt save verification detail!'
                    })
                }
            )
        }
    ).catch(() => {
        res.json({
            status: 'FAILED',
            message: 'An error occurred while hashing email data!'
        })
    })


}
const jwt = require('jsonwebtoken')
const requireAuth = require("../middleware/requireAuth")
const bcrypt = require('bcrypt')
const createToken = async (email) => {
    return await jwt.sign({ email }, process.env.SECRET, { expiresIn: '1H' })
}

router.get("/verify/:userId/:uniqueString", (req, res) => {

    let { userId, uniqueString } = req.params;
  //  console.log(userId)
    UserVerification.find({ userId }).then((result) => {
      console.log(result)
        if (result.length > 0) {
            const { expiresAt } = result[0]
            const hashedUniqueString = result[0].uniqueString
            if (expiresAt < Date.now()) {
                UserVerification.deleteOne({ userId }).then(
                    result => {
                        User.deleteOne({ _id: userId }).then(
                            () => {
                                let message = "Link has expired.Please sign up again"
                                res.redirect(`/user/verified?error=true&message=${message}`)
                            }
                        ).catch((e) => {
                            let message = "Account record could not be deleted"
                            res.redirect(`/user/verified?error=true&message=${message}`)
                        })
                    }
                ).catch(
                    (e) => {
                        let message = "Error occurred while deleting verification details"
                        res.redirect(`/user/verified?error=true&message=${message}`)
                    })
            }
            else {
                bcrypt.compare(uniqueString, hashedUniqueString).then(
                    result => {
                        if (result) {
                            User.updateOne({ _id: userId }, { verfied: true }).then(
                                () => {
                                    UserVerification.deleteOne({ userId }).then(
                                        () => {
                                            console.log("135:hii")
                                            res.redirect(`/user/verified?error=false&message=${"Verification done"}`)
                                        }
                                    ).catch(e => {
                                        
                                        let message = "An error occurred"
                                        res.redirect(`/user/verified?error=true&message=${message}`)
                                    })
                                }
                            ).catch(e => {
                                let message = "An error occurred while updating user record to show verified"
                                res.redirect(`/user/verified?error=true&message=${message}`)
                            })
                        } else {
                            let message = "Invalid verification details"
                            res.redirect(`/user/verified?error=true&message=${message}`)
                        }
                    }
                ).catch(
                    e => {
                        let message = "An error occurred while comparing unique string"
                        res.redirect(`/user/verified?error=true&message=${message}`)
                    }
                )
            }

        } else {
            let message = "Account record doesn't exist"
            res.redirect(`/user/verified?error=true&message=${message}`)
        }
    }).catch(
        (error) => {
            let message = "An error occurred while checking for existing user verification record"
            res.redirect(`/user/verified?error=true&message=${message}`)
        }
    )

})

router.get("/verified", (req, res) => {
let {error,message}=req.query
res.render('pages/page',{error,message})
})

router.post('/signup', async (req, res) => {

    const { name, email, password } = req.body
    try {

        const user = await User.signup(name, email, password)

        // const token=await createToken(email)
        // res.json({name,email,token})
        sendVerificationEmail(user,res)
        // res.json({ message: "Verification mail has been sent" })
    } catch (e) {
        res.status(400).json({ error: e.message })
    }

})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)
        const name = user.name
        const image = user.image
        const token = await createToken(email)
        res.json({ name, email, token, image })
    } catch (e) {
        res.status(400).json({ error: e.message })
    }
})

router.patch('/profilepic', requireAuth, async (req, res) => {
    req.user.image = req.body.image
    console.log(req.user.image)
    try {
        let resp = await req.user.save()
        const image = req.user.image
        res.json({ image: image })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }

})


router.get('/profilepic', requireAuth, async (req, res) => {
    try {
        const image = req.user.image
        res.json({ image: image })

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

router.post('/changepassword', requireAuth, async (req, res) => {
    try {
        console.log(req.body)
        const { oldPassword, newPassword } = req.body

        const match = await bcrypt.compare(oldPassword, req.user.password)

        if (!match) {
            return res.status(400).json({ error: "Old Password is incorrect" })
        }
        console.log("second")
        const salt = await bcrypt.genSalt()

        const hash = await bcrypt.hash(newPassword, salt)
        req.user.password = hash

        let resp = await req.user.save()
        return res.json({ message: "Password changed successfully!!!" })
    } catch (e) {
        console.log("h:", e.message)
        res.status(500).json({ error: e.message })
    }
})


module.exports = router