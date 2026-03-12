const express = require("express");
const mongoose = require("mongoose");
const Book = require("./model/book");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoute");
const libraryRoute = require("./routes/libraryRoute");
const connectDB = require("./config/db")

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//  Connect to MongoDB
// connectDB()

app.use("/", libraryRoute)
app.use("/auth", userRoute);


connectDB().then(()=>{
    app.listen(3000, () => {
        console.log("🚀 Server is running on port 3000");
    });
})
