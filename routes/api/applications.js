const express = require('express');
const router = express.Router();
const Application = require("../../models/Application");
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

// Route pour créer une nouvelle application
router.post('/create', async (req, res) => {
  const { author, jobid, name, email, resume, coverletter, published } = req.body;

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
    res.json(savedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
