#!/bin/bash
# AIPGBD v4 — Fresh install script
# Run: bash /e/Projects/install-aipgbd-v4.sh

TARGET="/e/Projects/aipgbd-react-site"
SRC="$TARGET/src"

echo "🚀 Installing AIPGBD v4..."
echo "📁 Target: $TARGET"

# Create all directories
mkdir -p "$SRC/admin" "$SRC/db" "$SRC/sections" "$SRC/components" "$SRC/hooks" "$SRC/styles" "$SRC/data" "$TARGET/public"

echo "📝 Writing files..."

# ── package.json ──
cat > "$TARGET/package.json" << 'EOF'
{
  "name": "aipgbd-v4",
  "version": "4.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "eslintConfig": { "extends": ["react-app"] },
  "browserslist": {
    "production": [">0.2%","not dead","not op_mini all"],
    "development": ["last 1 chrome version","last 1 firefox version","last 1 safari version"]
  }
}
EOF

# ── public/index.html ──
cat > "$TARGET/public/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AI Playground BD — Cinematic AI Production, Dhaka</title>
  <meta name="description" content="30-second unbroken cinematic shots. AI-engineered production, human-directed vision." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>
EOF

# ── src/index.js ──
cat > "$SRC/index.js" << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
EOF

echo "✅ Base files written."
echo ""
echo "⚠️  The source files are too large to write via bash."
echo "    Please extract the zip file manually:"
echo ""
echo "    1. Download aipgbd-v4.zip from Claude"
echo "    2. Extract the 'aipgbd' folder contents into:"
echo "       $TARGET"
echo "       (overwriting existing files)"
echo "    3. Run: cd $TARGET && npm install && npm start"
echo ""
echo "📌 Admin Panel: Go to http://localhost:3000/admin"
echo "   Default PIN: 1234 (change immediately in Security tab)"
