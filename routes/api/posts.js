const router = require("express").Router();
const config = require("config");
const Post = require("../../models/Post");
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
// Définissez le stockage pour multer
const storage = multer.memoryStorage(); // Stocke les fichiers en mémoire
// Configurez multer avec le stockage
const upload = multer({ storage: storage });

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

// Endpoint de suppression d'un post par son ID
router.delete('/delete/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    // Supprimez le post par son ID
    const deletedPost = await Post.findByIdAndDelete(postId);

    // Si le post n'est pas trouvé, renvoyez une réponse d'erreur
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Renvoyez une réponse de succès
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.post('/DownloadPDF', upload.single('file'), (req, res) => {
  try {
    // Obtenez le fichier depuis req.file.buffer
    const fileBuffer = req.file.buffer;
    const filename = req.file.originalname
    // Faites quelque chose avec le fichier, par exemple, enregistrez-le dans un répertoire
    const filePath = path.join(config.get("path_file"), filename);
    fs.writeFileSync(filePath, fileBuffer);

    // Répondez au client avec une confirmation
    res.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;