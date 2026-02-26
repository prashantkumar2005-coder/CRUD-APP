const mongoose = require('mongoose');

const SchemaBooks = new mongoose.Schema({
    title : String,
    author : String,
    price : Number
})

const Book = mongoose.model("Book", SchemaBooks);

module.exports = Book