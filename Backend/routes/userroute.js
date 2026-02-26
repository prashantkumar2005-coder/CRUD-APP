const express = require('express')
const router = express.Router();
const User = require('../model/user')
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    try {
        let { name, email, password } = req.body

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
        let newUser = new User({
            name,
            email,
            password
        });
        await newUser.save()
        res.status(200).json({
            success: true,
            message: "user created successfull"
        })

    } catch (error) {
        console.log("register route err", error);
        res.status(500).json({ success: false, message: "Server Error" });

    }
})

router.post("/login", async(req, res) => {
    try {
        let { email, password } = req.body
        if(!email || !password) {
            return res.status(400).json({
                success:false,
                message: "please fill all details"
            })
        }
                let existingUser = await User.findOne({ email: email });


                if(existingUser.password !== password){
return res.status(400).json({
                success:false,
                message: "Password is Wrong"
            })
                }


          
                if(!existingUser){
                    return res.status(400).json({
                        success:false,
                        message:"User not Exist"
                    })
                }

                const JWT_SECRET_KEY = "firstproject123";

                const token = jwt.sign({existingUser }, JWT_SECRET_KEY , {expiresIn : "20h"})

                    
                res.status(200).json({
                    success : true,
                    token,
                    message : "user registered succesfully"
                })

    } catch (err) {
        console.log("login route err " , err);
    return res.status(500),json({
        success : false,
        message : "internal server error"
    })
    
    
    }})

module.exports = router;