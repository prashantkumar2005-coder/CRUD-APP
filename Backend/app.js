const express = require("express");
const mongoose = require("mongoose");
const Book = require("./model/model");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//  Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(" MongoDB Connected"))
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

// Routes
app.get("/library", async (req, res) => {
    try {
        const book = await Book.find();
        res.status(200).json({
            success: true,
            data: book
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching books"
        });
    }
});

// Create Route
app.post("/library", async (req, res) => {
    try {
        const { title, author, price } = req.body;

        let newBook = new Book({
            title,
            author,
            price
        });

        await newBook.save();


        res.status(200).json({
            success: true,
            message: "Book Created Successfully",
            data: newBook,
        });

    } catch (err) {
        console.log("creation error(post)", err);
        return res.status(500).json({
            success: false,
            message: "Server not working",
        });
    }
});

//Update Route

app.put("/library/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, price } = req.body;
        console.log(req.body);

        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { title, author, price },
            { new: true } // return updated document
        );
        if (!updatedBook) {
            return res.status(400).json({
                success: false,
                message: "Invalid Id"
            })
        }

        res.status(200).json({
            success: true,
            message: "Book Updated Successfully",
            data: updatedBook
        });

    } catch (err) {
        console.log("update error", err);
        res.status(500).json({
            success: false,
            message: "Update failed"
        });
    }
});
app.delete('/library/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);

    const result = await Book.findOneAndDelete(id);
    console.log(result);
    if (result) {
        return res.status(200).json({
            success: true,
            message: "deleted succesfully"
        })
    }

    res.status(500).json({
        success: false,
        message: "invalid id"
    })

})

app.listen(3000, () => {
    console.log("🚀 Server is running on port 3000");
});
