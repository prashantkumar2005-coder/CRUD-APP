const User = require("../model/user");
const jwt = require("jsonwebtoken");


const JWT_SECRET_KEY = "firstproject123"; // ✏️ EDITED: moved to top so both routes can use it



// post registeruser controller
const registerPost = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "please fill all details "
            })
        }

        let existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already Registered"
            })
        }

        let newUser = new User({ name, email, password });
        await newUser.save()

        res.status(200).json({
            success: true,
            message: "user created successfully"
        })

    } catch (error) {
        console.log("register route err", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}


// post login controller

const loginPost = async (req, res) => {
    try {
        let { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please fill all details"
            })
        }

        let existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "Register first"
            })
        }

        if (existingUser.password != password) {
            return res.status(400).json({ // ✏️ EDITED: added "return" — without this token was still being generated even on wrong password
                success: false,
                message: "Password is Wrong"
            })
        }

        const token = jwt.sign({ existingUser }, JWT_SECRET_KEY, { expiresIn: "20h" })

        res.status(200).json({
            success: true,
            token,
            user: { name: existingUser.name, email: existingUser.email }, // ✏️ EDITED: added user info so frontend can show name after login
            message: "Logged in successfully" // ✏️ EDITED: fixed message — was saying "user registered" on login
        })

    } catch (err) {
        console.log("login route err ", err);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

module.exports = {
    registerPost,
    loginPost
}