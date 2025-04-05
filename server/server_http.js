const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const http = require('http');
const fs = require('fs');

// Generate a secure random JWT secret if not provided in environment variables
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

// Initialize express app
const app = express();

// Security Middleware
// Apply Helmet for securing HTTP headers
app.use(helmet());

// Set up rate limiting to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: { success: false, message: 'Too many login attempts, please try again later' }
});

// Set up CORS to allow requests from your client domain
app.use(cors({
  origin: '*',  // During development/testing allow all origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set up body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (publicly accessible)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Define a mock user database (replace with real database in production)
const users = [
  {
    id: 1,
    username: 'admin',
    // Hashed password: "password123"
    password: '$2b$10$X4hALAkH7yJxY5FzxiaLaONO9wx04wbngEgIUS/9IOUbVpvTbCqCS',
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    // Hashed password: "userpass"
    password: '$2b$10$kKbWRiK5NEwFbMNpSMF3feVX3E9swH1XzDdAWhy9R9oLl0lJ0JzLm',
    role: 'user'
  }
];

// Login endpoint with rate limiting
app.post('/api/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  
  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" });
  }
  
  try {
    // Find user in database
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }
    
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Return successful login with token
    res.json({ success: true, token, username: user.username, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Protected endpoint example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ success: true, message: `Hello, ${req.user.username}!`, data: { role: req.user.role } });
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const bearerHeader = authHeader;
  
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

// Define multiple port options in order of preference - starting with ones most likely to work
const PORT_OPTIONS = [3000, 8443, 2345, 443];

// Start server with port fallback mechanism
function startServer(portIndex = 0) {
  if (portIndex >= PORT_OPTIONS.length) {
    console.error('Failed to start server on any of the configured ports');
    return;
  }
  
  const portToUse = process.env.PORT || PORT_OPTIONS[portIndex];
  
  const server = http.createServer(app);
  server.listen(portToUse, '0.0.0.0', () => {
    console.log(`HTTP Server running on port ${portToUse}`);
    console.log(`JWT Secret: ${JWT_SECRET.substr(0, 8)}...` + ' (first 8 chars shown)');
  }).on('error', (err) => {
    console.log(`Failed to start server on port ${portToUse}: ${err.message}`);
    console.log(`Trying next port option...`);
    startServer(portIndex + 1);
  });
}

// Initialize server
startServer();
