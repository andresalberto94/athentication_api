const router= require('express').Router()
const bodyParser = require('body-parser')
const cors =require('cors');
const multer = require('multer') // v1.0.5
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const pool= require('../database.js')
const {check, validationResult} =require('express-validator')

router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const upload = multer() // for parsing multipart/form-data




router.get('/',async (req, res) => {
    const data = await pool.query('SELECT * FROM categories')
    
    res.send(data.rows)
  });


router.post('/',upload.array(),async (req, res) => {
    const { name } = req.body;
    const x= req.body
    console.log(x)
    await pool.query('INSERT INTO categories(name) VALUES($1)', [name])
    res.status(200).send("SuccesfullY  added")

  });

router.post('/register',[
  check('email', "email must contain @").isEmail().isLength({min:6, max:30}),
  check('password', "")
],upload.array(),async(req, res) => {
  try {
    const { username, email, password } = req.body;
    const errors=validationResult(req);

    // Check if the user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: "User already exists" });
    }
    
    if (!username || !password || !email){
      return res.status(400).json({ message: "Enter all of the fields" });
    }
    if (!errors.isEmpty()){
      let dat=errors.array()
      let s =dat.map(error => error.msg)
      console.log(s.toString())
     
      return res.status(400).json(errors);
      
    }
    
    


    // If the user doesn't exist, proceed with registration
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [username, hashedPassword, email]);
    
    res.status(200).json({ message: "User registered successfully" });

} catch (error) {
    console.error('Error processing registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
  
  router.post('/login', upload.array(), async (req, res) => { 
    const { username, password } = req.body;
    console.log(req.body)

  try {
      const data = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

      if (data.rows.length === 0) {
        console.log("user does not exit")
          return res.status(400).json({ message: "User not found" });
      }

      const user = data.rows[0];

      if (!await bcrypt.compare(password, user.password)) {
          console.log("Wrong password")
          
          return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id }, "secret", { expiresIn: '20m' }); // Corrected options object
      res.cookie('jwt', token, { httpOnly: true, maxAge: 20 * 60 * 1000 }); // Corrected syntax for res.cookie()


      // If user and password are correct, you can send the user data back if needed
      console.log("user authenticated")
      return res.status(200).json({ message: "successful login" });
      res.json(user);
  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

  module.exports= router;