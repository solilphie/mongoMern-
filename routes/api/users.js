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

router.post('/signup', async (req, res) => {
  const { first_name, last_name, categoryy, usertypes, email, password,adress } = req.body;

  if (!first_name || !last_name || !categoryy || !usertypes || !email || !password || !adress) {
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
    const token = jwt.sign(
      { email, first_name, last_name },
      config.get('jwtSecret'),
      { expiresIn: config.get('tokenExpire') }
    );
    const newUser = new User({ last_name, first_name, email, password, categoryy, usertypes,adress,token });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);

    newUser.password = hashedPassword;

    const savedUser = await newUser.save();

    // const token = jwt.sign(
    //   { id: savedUser.id },
    //   config.get('jwtSecret'),
    //   { expiresIn: config.get('tokenExpire') }
    // );

    res.json({
      token,
      user: {
        id: savedUser.id,
        name: savedUser.first_name,
        surname: savedUser.last_name,
        email: savedUser.email,
        type_user: savedUser.usertypes,
        categorie: savedUser.categoryy,
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
          (err, refesh) => {
            if (err) throw err;
            res.json({
              token:user.token,
              refesh,
              user: {
                id: user.id,
                name: user.first_name, // Assurez-vous que vos propriétés sont correctes ici
                email: user.email,
                type_user: user.usertypes,
                categorie: user.categoryy,
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



router.get('/getuser', async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const tokenget = req.headers['authorization'];
    const token =tokenget.replace('Bearer ', '').replace('JWT ', '')
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Missing token' });
    }

    // Recherche de l'utilisateur dans la base de données par le champ 'token'
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Renvoie les détails de l'utilisateur
    res.json({
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      adress: user.adress,
      usertypes: user.usertypes,
      categoryy: user.categoryy,
    });
  } catch (error) {
    console.error(error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized - Token has expired' });
    }

    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
});



module.exports = router;
