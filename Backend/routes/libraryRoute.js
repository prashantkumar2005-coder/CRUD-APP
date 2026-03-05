const express = require("express");
const router = express.Router();
const Book = require("../model/book.js");
const authVerify = require('../auth/authVerify.js');
const User = require('../model/user.js');


// ── GET /library ──────────────────────────────────────────────────────────────
// Fetches all books from the database and returns them
router.get("/library", async (req, res) => {
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


// ── GET /store ────────────────────────────────────────────────────────────────
router.get('/store', authVerify, async (req, res) => {
    try {
        const user = req.user;

        // ✏️ EDITED: pehle sirf userDetails return ho raha tha
        // Ab user ki apni books fetch ho rahi hain createdBy se filter karke
        const books = await Book.find({ createdBy: user._id });

        return res.status(200).json({
            success: true,
            data: books, // ✏️ EDITED: userDetails ki jagah books return ho rahi hain
        });

    } catch (err) {
        console.log("store route err", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error",
        });
    }
});


// ── POST /store ───────────────────────────────────────────────────────────────
// Logged-in user apni nayi book banaye, createdBy automatically set hoga
router.post('/store', authVerify, async (req, res) => {
    try {
        const { title, author, price } = req.body;

        if (!title || !author || !price) {
            return res.status(400).json({
                success: false,
                message: "Please fill all details (title, author, price)"
            });
        }

        const newBook = new Book({
            title,
            author,
            price,
            createdBy: req.user._id  // logged-in user ki id automatically save hogi
        });

        await newBook.save();

        res.status(200).json({
            success: true,
            message: "Book Created Successfully",
            data: newBook,
        });

    } catch (err) {
        console.log("store create error", err.message);
        res.status(500).json({ success: false, message: "Create failed" });
    }
});

// ── PUT /store/:id ────────────────────────────────────────────────────────────
// Store se sirf apni book update karo (createdBy check hoga)
router.put('/store/:id', authVerify, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, price } = req.body;

        // ✏️ createdBy: req.user._id — dono check ho rahe hain, koi aur ki book edit nahi kar sakta
        const updatedBook = await Book.findOneAndUpdate(
            { _id: id, createdBy: req.user._id },
            { title, author, price },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ success: false, message: "Book not found or not authorized" });
        }

        res.status(200).json({ success: true, message: "Book Updated", data: updatedBook });

    } catch (err) {
        console.log("store update error", err.message);
        res.status(500).json({ success: false, message: "Update failed" });
    }
});


// ── DELETE /store/:id ─────────────────────────────────────────────────────────
// Store se sirf apni book delete karo (createdBy check hoga)
router.delete('/store/:id', authVerify, async (req, res) => {
    try {
        const { id } = req.params;

        // ✏️ createdBy: req.user._id — sirf owner hi delete kar sakta hai
        const result = await Book.findOneAndDelete({ _id: id, createdBy: req.user._id });

        if (!result) {
            return res.status(404).json({ success: false, message: "Book not found or not authorized" });
        }

        res.status(200).json({ success: true, message: "Book deleted successfully" });

    } catch (err) {
        console.log("store delete error", err.message);
        res.status(500).json({ success: false, message: "Delete failed" });
    }
});

// ── POST /library ─────────────────────────────────────────────────────────────
// ✏️ EDITED: added authVerify — only logged in users can create books
router.post("/library", authVerify, async (req, res) => {
    try {
        const { title, author, price } = req.body;

        if (!title || !author || !price) {
            return res.status(400).json({
                success: false,
                message: "please fill all details (title , author , price )"
            });
        }

        let newBook = new Book({
            title,
            author,
            price,
            createdBy: req.user._id // ✏️ EDITED: saving who created the book using req.user from authVerify
        });

        await newBook.save();

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
// ✏️ EDITED: entire route added — update an existing book (protected)
router.put("/library/:id", authVerify, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, price, description, image } = req.body;

        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { title, author, price, description, image },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        res.status(200).json({
            success: true,
            message: "Book Updated Successfully",
            data: updatedBook
        });

    } catch (err) {
        console.log("update error", err.message);
        res.status(500).json({ success: false, message: "Update failed" });
    }
});


// ── DELETE /library/:id ───────────────────────────────────────────────────────
// ✏️ EDITED: entire route added — delete a book (protected)
router.delete("/library/:id", authVerify, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        res.status(200).json({ success: true, message: "Book deleted successfully" });

    } catch (err) {
        console.log("delete error", err.message);
        res.status(500).json({ success: false, message: "Delete failed" });
    }
});


// ── POST /library/:id/buy ─────────────────────────────────────────────────────
// ✏️ EDITED: entire route added — buy a book, saves it to user's purchasedBooks (protected)
router.post("/library/:id/buy", authVerify, async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        const user = await User.findById(req.user._id);

        // check if already purchased
        if (user.purchasedBooks.includes(id)) {
            return res.status(400).json({ success: false, message: "Book already purchased" });
        }

        user.purchasedBooks.push(id);
        await user.save();

        res.status(200).json({ success: true, message: "Book purchased successfully" });

    } catch (err) {
        console.log("buy error", err.message);
        res.status(500).json({ success: false, message: "Purchase failed" });
    }
});


module.exports = router;