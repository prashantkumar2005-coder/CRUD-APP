const express = require("express");
const router = express.Router(); // Creates a mini express app to define routes separately
const Book = require("../model/book.js");
const authVerify = require('../auth/authVerify.js'); // Middleware that checks if user is logged in via JWT
const User = require('../model/user.js');


// ── GET /library ──────────────────────────────────────────────────────────────
// Fetches all books from the database and returns them
router.get("/library", async (req, res) => {
    try {
        const book = await Book.find(); // Get all books from MongoDB
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


// ── GET /store ────────────────────────────────────────────────────────────────
// Returns the logged-in user's details
// authVerify runs first — it checks the token and attaches user info to req.user
router.get('/store', authVerify, async (req, res) => {
    try {
        const user = req.user;      // User info extracted from the JWT token by authVerify
        const { email } = user;

        // Find the user in the database using their email
        const userDetails = await User.findOne({ email: email })
        console.log(userDetails);

        return res.status(200).json({
            success: true,
            data: userDetails,
        });

    } catch (err) {
        console.log("store route err", err);
        return res.status(500).json({
            success: false,
            message: "Internal sever error" || err.name, // ⚠️ || doesn't work here — "Internal server error" is always truthy so err.name is never used. Fix: err.message || "Internal server error"
        });
    }
}); 1
k    

// ── POST /library ─────────────────────────────────────────────────────────────
// Creates a new book and saves it to the database
router.post("/library", async (req, res) => {
    try {
        const { title, author, price } = req.body; // Extract book details from the request body

        // Validation: return an error if any required field is missing
        if (!title || !author || !price) {
            return res.status(400).json({
                success: false,
                message: "please fill all details (title , author , price )"
            });
        }

        // Create a new Book instance with the provided data
        let newBook = new Book({
            title,
            author,
            price
        });

        await newBook.save(); // Save the book to MongoDB

        res.status(200).json({
            success: true,
            message: "Book Created Successfully",
            data: newBook,
        });

    } catch (err) {
        console.log("creation error - 111", err.message);
        return res.status(500).json({
            success: false,
            message: "Server not working",
        });
    }
});


// ── PUT /library/:id ──────────────────────────────────────────────────────────
// Updates an existing book's details using its ID
// :id is a URL parameter — e.g. PUT /library/64abc123...
router.put("/library/:id", async (req, res) => {
    try {
        const { id } = req.params;                    // Extract book ID from the URL
        const { title, author, price } = req.body;    // Extract updated fields from request body
        console.log(req.body);

        // Find the book by ID and update it with new data
        // { new: true } makes MongoDB return the updated document instead of the old one
        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { title, author, price },
            { new: true }
        );

        // If no book was found with that ID, return an error
        if (!updatedBook) {
            return res.status(400).json({  // ⚠️ should be 404 (Not Found) since the book doesn't exist
                success: false,
                message: "Invalid Id"
            });
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


// ── DELETE /library/:id ───────────────────────────────────────────────────────
// Deletes a book from the database using its ID
router.delete('/library/:id', async (req, res) => {
    const { id } = req.params; // Extract book ID from the URL
    console.log(id);

    // ⚠️ findOneAndDelete(id) is wrong — it treats the id as a filter object, not an ID
    // Fix: use Book.findByIdAndDelete(id) instead
    const result = await Book.findByIdAndDelete(id);  // ⚠️ no try/catch — if this throws, the server will crash
    console.log(result);

    if (result) {
        return res.status(200).json({
            success: true,
            message: "deleted succesfully"  // ⚠️ typo: "succesfully" → "successfully"
        });
    }

    // If result is null, the book wasn't found — 404 is more accurate than 500 here
    res.status(500).json({  // ⚠️ should be 404 (Not Found), not 500 (Server Error)
        success: false,
        message: "invalid id"
    });
});

module.exports = router; // Export the router so it can be used in the main server file