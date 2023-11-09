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
router.post("/register", (req, res) => {
  let { nom,prenom,categorie,type, email, password } = req.body;
  if (!nom || !email || !password || !prenom || !categorie || !type )
    return res.status(400).send({ msg: "Please enter all data" });
  User.findOne({ email: email }).then((user) => {
    if (user) return res.status(400).send({ msg: "Email alreadyexist" });
  });
  let newUser = new User({ prenom,nom, email, password, categorie,type });
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save().then((user) => {
        jwt.sign(
          { id: user.id },
          config.get("jwtSecret"),
          { expiresIn: config.get("tokenExpire") },
          (err, token) => {
            if (err) throw err;
            res.json({
              token,
              user: {
                id: user.id,
                name: user.prenom,
                name: user.nom,
                email: user.email,
                type_user: user.type,
                categorie: user.categorie,
              },
            });
          }
        );
      });
    });
  });
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
