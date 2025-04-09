const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type: String,
        // required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog"
    },
    date: {
        type: Date,
        default: Date.now
    }
})


const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    coverImage: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
const Comments = mongoose.model('Comments', commentSchema);

module.exports = {Blog, Comments};