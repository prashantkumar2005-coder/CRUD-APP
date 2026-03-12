const express = require("express");
const router = express.Router();
const Book = require("../model/book.js");
const authVerify = require('../auth/authVerify.js');
const User = require('../model/user.js');
const { getLibrary , postLibrary , putLibrary , deleteLibrary} = require("../controllers/library.controller.js");
const { getStore , postStore , putStore , deleteStore} = require("../controllers/protectedStore.js");


// ── GET /library ──────────────────────────────────────────────────────────────
// Fetches all books from the database and returns them
router.get("/library", getLibrary);


// ── POST /library ─────────────────────────────────────────────────────────────
// ✏️ EDITED: added authVerify — only logged in users can create books
router.post("/library", authVerify, postLibrary);


// ── PUT /library/:id ──────────────────────────────────────────────────────────
// ✏️ EDITED: entire route added — update an existing book (protected)
router.put("/library/:id", authVerify, putLibrary);


// ── DELETE /library/:id ───────────────────────────────────────────────────────
// ✏️ EDITED: entire route added — delete a book (protected)
router.delete("/library/:id", authVerify, deleteLibrary);


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


// ── GET /store ────────────────────────────────────────────────────────────────
router.get('/store', authVerify, getStore);


// ── POST /store ───────────────────────────────────────────────────────────────
// Logged-in user apni nayi book banaye, createdBy automatically set hoga
router.post('/store', authVerify, postStore)
    

// ── PUT /store/:id ────────────────────────────────────────────────────────────
// Store se sirf apni book update karo (createdBy check hoga)
router.put('/store/:id', authVerify, putStore)


// ── DELETE /store/:id ─────────────────────────────────────────────────────────
// Store se sirf apni book delete karo (createdBy check hoga)
router.delete('/store/:id', authVerify, deleteStore);


module.exports = router;