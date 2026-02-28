const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/user.js");


const authVerify = async (req, res, next) => {
    try {
        if (req.headers && req.headers.authorization) {
            let token = req.headers.authorization.split(" ")[1];
            const JWT_SECRET_KEY = "firstproject123";
            const decodedUser = jwt.verify(token, JWT_SECRET_KEY);
            console.log(decodedUser);

            if (!decodedUser) {
                return res.status(400).json({
                    success: false,
                    message: "unauthorized user"
                })
            }

            const email = decodedUser.existingUser.email;
            console.log(email);

            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "UnAuthorized User"
                })
            }
            req.user = user;
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: "no token provided"
            })
        }

    } catch (err) {
        console.log("auth err", err.message);
        return res.status(505).json({
            success: false,
            message: "your token is unauthorized"
        })
    }
}
module.exports = authVerify;