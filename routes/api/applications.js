const express = require('express');
const router = express.Router();
const Application = require("../../models/Application");
const config = require("config");

const multer = require('multer');
const bodyParser = require('body-parser');



// Route pour obtenir toutes les applications
router.get('/get', async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});



// Configuration de multer pour spécifier le dossier de stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.get("path_file")); // Le dossier où les fichiers seront sauvegardés
  },
  filename: function (req, file, cb) {
    // Utilisez un nom de fichier unique, par exemple, le timestamp actuel
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Utilisation de body-parser pour analyser les données du formulaire
router.use(bodyParser.urlencoded({ extended: true }));

// ...

router.post('/', upload.single('resume'), async (req, res) => {
  const { author, jobid, name, email, coverletter, published } = req.body;

  // Le fichier sera disponible dans req.file
  const resume = req.file ? req.file.path : null;

  const newApplication = new Application({
    author,
    jobid,
    name,
    email,
    resume,
    coverletter,
    published,
  });

  try {
    const savedApplication = await newApplication.save();
    // Formater la réponse pour correspondre au format souhaité
    const formattedResponse = {
      id: savedApplication._id,
      author: savedApplication.author,
      jobid: savedApplication.jobid,
      name: savedApplication.name,
      email: savedApplication.email,
      resume: savedApplication.resume,
      coverletter: savedApplication.coverletter,
      published: savedApplication.published,
    };

    res.json(formattedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});


module.exports = router;
