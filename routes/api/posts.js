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
const fsP = require('fs').promises;  // Use fs.promises for asynchronous file operations

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


router.post('/DownloadPDF', async (req, res) => {
  try {
    const filePath = req.body.filePath;
    const filename = path.basename(filePath);

    // Read the file asynchronously to get the file buffer
    const fileBuffer = await fsP.readFile(filePath);

    // Assuming config.get("path_download") is a valid path
    const file = path.join(config.get("path_download"), filename);

    // Write the file buffer to the specified file path
    await fsP.writeFile(file, fileBuffer);

    // Respond to the client with a confirmation
    res.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'File not found' });
  }
});



router.get('/specialjoblist', async (req, res) => {
  try {
    const tokenget = req.headers['authorization'];
    const token = tokenget.replace('Bearer ', '').replace('JWT ', '');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Missing token' });
    }

    // Recherche de l'utilisateur dans la base de données par le champ 'token'
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const category = user.categoryy;

    // Recherche de tous les postes avec la catégorie correspondante
    const posts = await Post.find({ category: category });

    // Formater la réponse pour correspondre au format souhaité
    const formattedPosts = posts.map(post => {
      return {
        id: post.id,
        author: post.author,
        company: post.company,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        content: post.content,
        status: post.status,
        published: post.published
      };
    });

    // Renvoie la liste des postes formatée
    res.json(formattedPosts);

  } catch (error) {
    console.error(error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized - Token has expired' });
    }

    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
});


router.get('/allposts', async (req, res) => {
  try {
    // Recherche de tous les postes dans la base de données
    const posts = await Post.find();

    // Formater la réponse pour correspondre au format souhaité
    const formattedPosts = posts.map(post => {
      return {
        id: post._id,
        author: post.author,
        company: post.company,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        content: post.content,
        status: post.status,
        published: post.published
      };
    });

    // Renvoie la liste de tous les postes formatée
    res.json(formattedPosts);

  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: 'Erreur Serveur' });
  }
});


router.get('/getpostbyuser', async (req, res) => {
  try {
    const tokenget = req.headers['authorization'];
    const token = tokenget.replace('Bearer ', '').replace('JWT ', '');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Missing token' });
    }

    // Recherche de l'utilisateur dans la base de données par le champ 'token'
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const author = user.id;

    // Recherche de tous les postes avec la catégorie correspondante
    const posts = await Post.find({ author: author });

    // Formater la réponse pour correspondre au format souhaité
    const formattedPosts = posts.map(post => {
      return {
        id: post.id,
        author: post.author,
        company: post.company,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        content: post.content,
        status: post.status,
        published: post.published
      };
    });

    // Renvoie la liste des postes formatée
    res.json(formattedPosts);

  } catch (error) {
    console.error(error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized - Token has expired' });
    }

    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
});


router.get('/edit/postdetail/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;

    // Recherche du poste dans la base de données par ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Renvoie les détails du poste au format souhaité
    const formattedResponse = {
      id: post._id,
      author: post.author,
      company: post.company,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      content: post.content,
      status: post.status,
      published: post.published,
    };

    res.json(formattedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.put('/edit/:Id', async (req, res) => {
  try {
    const postId = req.params.Id;
    const updateData = req.body;

    // Mettez à jour le post dans la base de données en utilisant findOneAndUpdate
    const updatedPost = await Post.findOneAndUpdate({ _id: postId }, updateData, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Renvoie les détails du post mis à jour
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});




module.exports = router;