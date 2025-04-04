# Aureus Sigma Authentication Server

This server provides secure authentication for the Aureus Sigma Capital client portal using Node.js, Express, SQLite, and JWT tokens.

## Features

- Secure password storage using bcrypt encryption
- JWT-based authentication
- SQLite database storage
- API endpoints for authentication

## Setup and Deployment

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Local Development Setup

1. Install dependencies:
   ```
   cd /path/to/aureussigma/server
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. The server will run on http://localhost:3000

### Production Deployment to SSH Server

#### Option 1: Direct deployment to lvd_server (192.168.1.4)

1. Copy the server directory to your SSH server:
   ```
   scp -r /Users/raymond/aureussigma/server user@192.168.1.4:/path/to/deploy
   ```

2. SSH into your server:
   ```
   ssh user@192.168.1.4
   ```

3. Install dependencies and start the server:
   ```
   cd /path/to/deploy/server
   npm install
   npm start
   ```

4. For production use, consider using a process manager like PM2:
   ```
   npm install -g pm2
   pm2 start server.js --name "aureus-auth"
   pm2 startup
   pm2 save
   ```

#### Option 2: Remote access deployment (lvd_server_remote at 123.20.200.222)

1. Copy the server directory to your remote SSH server:
   ```
   scp -r /Users/raymond/aureussigma/server user@123.20.200.222:/path/to/deploy
   ```

2. SSH into your remote server:
   ```
   ssh user@123.20.200.222
   ```

3. Follow steps 3-4 from Option 1 to install dependencies and start the server.

### Important Security Considerations

1. Update the JWT_SECRET in server.js to a secure, random string
2. In production, use HTTPS (SSL/TLS) to encrypt data in transit
3. Set up proper firewall rules to limit access to the server
4. Configure the Express server to use secure headers
5. Regularly backup the SQLite database file
6. Consider moving to a more robust database like PostgreSQL for high-traffic scenarios

## API Documentation

### Authentication Endpoints

- `POST /api/login`: Authenticate user and get JWT token
  - Request body: `{ "username": "username", "password": "password" }`
  - Response: `{ "success": true, "message": "Login successful", "token": "jwt_token", "user": { "id": 1, "username": "username" } }`

- `GET /api/user`: Get authenticated user data (protected route)
  - Headers: `Authorization: Bearer your_jwt_token`
  - Response: `{ "user": { "userId": 1, "username": "username" } }`

## Port Forwarding Setup

Since your server is accessed remotely, ensure that:

1. Your router forwards port 3000 to your internal server at 192.168.1.4
2. Or change the port in server.js to 22 which is already forwarded as per your configuration
