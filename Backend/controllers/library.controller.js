const Book = require("../model/book");

// get library
const getLibrary = async (req, res) => {
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
};

//post library

const postLibrary = async (req, res) => {
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
}

// put library

const putLibrary = async (req, res) => {
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
}

// delete library

const deleteLibrary = async (req, res) => {
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
}


module.exports = {
    getLibrary,
    postLibrary,
    putLibrary,
    deleteLibrary
}