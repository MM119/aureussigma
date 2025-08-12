# Aureus Sigma Capital - React Website

Modern React-based website for Aureus Sigma Capital, built with Vite and deployed via GitHub Pages.

## 🚀 Features

- **Modern React 18** with functional components and hooks
- **Vite** for fast development and optimized builds
- **Framer Motion** for smooth animations
- **Responsive design** optimized for all devices
- **GitHub Pages** deployment with automatic CI/CD

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment
The website automatically deploys to GitHub Pages via GitHub Actions:

1. **Automatic**: Push to `main` branch triggers automatic build and deployment
2. **Manual**: Use the `deploy.sh` script for local builds
3. **GitHub Pages**: Configured to serve from the `dist/` folder

## 📁 Project Structure

```
src/
├── App.jsx          # Main application component
├── main.jsx         # Application entry point
public/               # Static assets (images, logos)
dist/                 # Production build output (auto-generated)
.github/workflows/    # GitHub Actions deployment workflows
```

## 🌐 Live Site

- **GitHub Pages**: https://mm119.github.io/aureussigma/
- **Repository**: https://github.com/MM119/aureussigma

## 🔧 Build Process

1. **Development**: `npm run dev` - Hot reload development server
2. **Build**: `npm run build` - Creates optimized production files in `dist/`
3. **Deploy**: GitHub Actions automatically builds and deploys on push

## 📱 Technologies

- **Frontend**: React 18, Vite
- **Styling**: CSS3 with responsive design
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: GitHub Pages + GitHub Actions

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/MM119/aureussigma.git
cd aureussigma

# Install dependencies
npm install

# Start development
npm run dev

# Open http://localhost:5173
```

## 📝 Notes

- The website is automatically deployed to GitHub Pages
- All changes pushed to `main` branch trigger automatic deployment
- The `dist/` folder contains the production-ready website
- GitHub Actions handles the build and deployment process
