const express = require("express");
const router = express.Router();
const Book = require("../model/book.js")

// Routes
router.get("/library", async (req, res) => {
    try {
        console.log("helo")
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
router.post("/library", async (req, res) => {
    try {
        const { title, author, price } = req.body;

        if (!title || !author || !price) {
            return res.status(400).json({
                success: false,
                message: "please fill all details (title , author , price )"
            })
        }
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

router.put("/library/:id", async (req, res) => {
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
router.delete('/library/:id', async (req, res) => {
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

module.exports = router;
