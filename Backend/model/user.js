const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        // select: false
    },
    books: [
        {
            type: Schema.Types.ObjectId,
            ref: "Book"
        }
    ]
}, { timestamps: true }
)

let User = mongoose.model('User', userSchema);
module.exports = User;