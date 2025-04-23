import jwt from 'jsonwebtoken';

const verifyJWT = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).send('User not logged in');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: attach user info to request
    req.user = decoded;

    next(); // ✅ move to the next middleware or route
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).send('Invalid or expired token');
  }
};

export default verifyJWT;
