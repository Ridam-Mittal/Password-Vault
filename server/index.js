import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import { connectToDB } from './db/db.js';
import { decrypt, encrypt } from './EncryptionHandler.js';
import { hashPassword, comparePassword } from './helper/auth.helper.js';
import verifyJWT from './middleware/auth.middleware.js';
const app = express();

const db = connectToDB();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());





app.post('/addpassword', verifyJWT, (req, res) => {
    const { sitename, siteusername, sitepassword, note } = req.body;

    // Check if required fields are missing
    if (!sitename || !siteusername.length || !sitepassword) {
      console.log(` values are not present`);
      return res.status(400).send("Missing required fields.");
    }
  
    const encryptedPassword = encrypt(sitepassword);
    // If user_id is static for now (e.g., user_id = 1)
    const user_id = req.user.id;
    const query = `INSERT INTO passwords (user_id, site_name, site_username, site_password, notes, created_at, iv) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [user_id, sitename, siteusername, encryptedPassword.password, note, new Date(), encryptedPassword.iv];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("DB Insert Error:", err);  // Log the error
        return res.status(500).send("Something went wrong with DB insert.");
      }
      res.status(200).send("Password saved successfully.");
    });
  });
  





app.get('/showpasswords', verifyJWT, (req, res) => {
  db.query('SELECT * FROM PASSWORDS where user_id = ?', req.user.id , (err, result)=>{
    if(err){
      console.error("DB Insert Error:", err);  // Log the error
      return res.status(500).send("Something went wrong fetching passwords.");
    }
    console.log(result);
    console.log(req.user);
    res.status(200).send({
      data: result,
      message: 'Data fetched successfully'
    });
  });
})







app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !username || !password) {
    console.log('Values are not present');
    return res.status(400).send('Missing required fields.');
  }

  try {
    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).send('Server error.');
      }

      if (results.length > 0) {
        return res.status(400).send('User already exists.');
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Store user in DB
      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).send('Server error.');
        }

        res.status(201).send('User registered successfully!');
      });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Server error.');
  }
});









app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Missing email or password.");
  }

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error("DB error during login:", err);
        return res.status(500).send("Server error.");
      }

      if (results.length === 0) {
        console.log(`Invalid email or password`);
        return res.status(401).send("Invalid email or password.");
      }

      const user = results[0];
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(401).send("Invalid email or password.");
      }

      // ✅ Generate JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN
        }
      );

      // Set token in cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // only over HTTPS in production
        sameSite: 'Lax', // can be 'Strict' or 'None' depending on frontend location
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      // Optional: also return user data in response
      res.status(200).send({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error.");
  }
});






app.get('/logout', verifyJWT, (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });
  console.log(`logged out`);
  res.status(200).send('Logged out successfully');
});





app.post('/decryptpassword', (req, res) => {
  res.send(decrypt(req.body));
})


app.get('/verify-token', verifyJWT, (req, res) => {
  return res.status(200).json({ loggedIn: true, user: req.user }); // user decoded from JWT
});


app.delete('/deletepassword/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM PASSWORDS WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).send("Something went wrong while deleting the password.");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Password not found.");
    }

    res.status(200).send({
      data: result,
      message: 'Password deleted successfully'
    });
  });
});



app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});





