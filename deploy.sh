#!/bin/bash

echo "🚀 Building React application..."
npm run build

echo "📁 Contents of dist folder:"
ls -la dist/

echo "✅ Build complete! Ready for deployment."
echo "💡 The dist/ folder contains your production-ready website."
echo "🌐 Push to GitHub to trigger automatic deployment via GitHub Actions."
