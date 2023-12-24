const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    company: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    excerpt: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
    },
    published: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Remplacez 'User' par le nom du modèle d'utilisateur si nécessaire
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
