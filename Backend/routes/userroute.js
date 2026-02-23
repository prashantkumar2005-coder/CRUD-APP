const express = require('express')
const router = express.Router();
const User = require('../model/user')


router.post("/register", async (req, res) => {
    try {
        let { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "please fill all details "
            })
        }
   
        let existingUser = await User.findOne({email : email});
        
        if(existingUser){
          
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
            success:true,
            message:"user created successfull"
        })

    } catch (error) {
        console.log("register route err", error);
    res.status(500).json({ success: false, message: "Server Error" });

    }
})

module.exports = router;