const Book = require("../model/book.js")


// get store
const getStore = async (req, res) => {
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
}

//post store

const postStore = async (req, res) => {
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
};

// put store

const putStore = async (req, res) => {
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

};

// delete store

const deleteStore = async (req, res) => {
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
}


module.exports = {
    getStore,
    postStore,
    putStore,
    deleteStore
}