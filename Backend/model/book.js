const mongoose = require('mongoose');
const { Schema } = mongoose;
const SchemaBooks = new Schema({
    title: String,
    desc: String,
    price: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

const Book = mongoose.model("Book", SchemaBooks);

module.exports = Book