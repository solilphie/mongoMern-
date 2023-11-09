const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const bcr = require('bcrypt');

// @route POST api/users
// @desc Register new user
// @access Public
const validator = require('validator');

router.post('/register', async (req, res) => {
  const { nom, prenom, categorie, type, email, password,adresse } = req.body;

  if (!nom || !prenom || !categorie || !type || !email || !password || !adresse) {
    return res.status(400).json({ error: 'Please enter all data' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = new User({ nom, prenom, email, password, categorie, type,adresse });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);

    newUser.password = hashedPassword;

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser.id },
      config.get('jwtSecret'),
      { expiresIn: config.get('tokenExpire') }
    );

    res.json({
      token,
      user: {
        id: savedUser.id,
        name: savedUser.prenom,
        surname: savedUser.nom,
        email: savedUser.email,
        type_user: savedUser.type,
        categorie: savedUser.categorie,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

  

router.post('/login', async (req, res) => {
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Veuillez entrer à la fois l\'email et le mot de passe' });
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ msg: 'Utilisateur non trouvé' });
    }

    // Vérifiez le mot de passe
    bcr.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;

      if (isMatch) {
        // Créez un token JWT
        jwt.sign(
          { id: user.id },
          config.get('jwtSecret'),
          { expiresIn: config.get('tokenExpire') },
          (err, token) => {
            if (err) throw err;
            res.json({
              token,
              user: {
                id: user.id,
                name: user.prenom, // Assurez-vous que vos propriétés sont correctes ici
                email: user.email,
                type_user: user.type,
                categorie: user.categorie,
              },
            });
          }
        );
      } else {
        return res.status(400).json({ msg: 'Mot de passe incorrect' });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
