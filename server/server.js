const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const https = require('https');
const fs = require('fs');

const httpsOptions = {
  cert: fs.readFileSync('/etc/letsencrypt/live/api.aureussigmacapital.com/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/api.aureussigmacapital.com/privkey.pem')
};


// Generate a secure random JWT secret if not provided in environment variables
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 443; // Standard HTTPS port

// Security Middleware
// Apply Helmet for securing HTTP headers
app.use(helmet());

// Set up rate limiting to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: { success: false, message: 'Too many login attempts, please try again later' }
});

// Apply less restrictive CORS for development/testing
app.use(cors({
  origin: '*', // Allow all origins during testing
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Basic middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Custom middleware to disable directory indexing
const disableDirectoryListing = (req, res, next) => {
  if (req.path.endsWith('/') && req.path !== '/') {
    return res.status(403).send('Directory listing is not allowed');
  }
  next();
};

// Serve static files with security measures
app.use(disableDirectoryListing);
app.use(express.static(path.join(__dirname, '../'), {
  dotfiles: 'ignore',
  etag: false,
  index: false, // Disable directory index
  maxAge: '1d',
  redirect: false,
  setHeaders: (res) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
  }
}));

// Initialize database
const db = new sqlite3.Database('./users.db');

// Create users table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Check if users exist; if not, create the initial users
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (err) {
      console.error("Error checking users:", err);
      return;
    }
    
    if (row.count === 0) {
      // Create initial users
      const saltRounds = 10;
      
      // User: minh, Password: minh
      bcrypt.hash('minh', saltRounds, (err, hash) => {
        if (err) console.error("Error hashing password:", err);
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", ['minh', hash]);
      });
      
      // User: duc, Password: asc
      bcrypt.hash('asc', saltRounds, (err, hash) => {
        if (err) console.error("Error hashing password:", err);
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", ['duc', hash]);
      });
      
      console.log("Initial users created");
    }
  });
});

// Login route with rate limiting
app.post('/api/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;
  
  // Find user by username
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }
    
    // Compare password
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }
      
      if (!result) {
        return res.status(401).json({ success: false, message: "Invalid username or password" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '8h' } // Token expires in 8 hours
      );
      
      return res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username
        }
      });
    });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected route example
app.get('/api/user', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Verify JWT token middleware
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: "Invalid token" });
      }
      
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Start server
https.createServer(httpsOptions, app).listen(PORT, '0.0.0.0', () => {
  console.log(`HTTPS Server running on port ${PORT}`);
  console.log(`JWT Secret: ${JWT_SECRET.substr(0, 8)}...` + ' (first 8 chars shown)');
});
