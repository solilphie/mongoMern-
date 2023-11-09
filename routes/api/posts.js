const router = require("express").Router();
const config = require("config");
const Post = require("../../models/Post");
const jwt = require('jsonwebtoken');

// @route POST api/posts
// @desc Register new post
// @access Public
router.post('/create', async (req, res) => {
  try {
    const { company, title, excerpt, category, content, slug, author, status } = req.body;

    const newPost = new Post({
      company,
      title,
      excerpt,
      category,
      content,
      slug,
      author,
      status
    });

    // Enregistrez le nouveau post
    const post = await newPost.save();

    res.json({
      post: {
        id: post.id,
        // Ajoutez d'autres propriétés du post que vous voulez inclure dans la réponse ici
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;