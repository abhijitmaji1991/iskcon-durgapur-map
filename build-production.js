/**
 * Unified Build Script for ISKCON Community Map
 * This script builds the React frontend and copies the assets into Laravel's public/ folder.
 * This enables single-server hosting (Nginx/Apache serves Laravel, which serves the React app).
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
const backendPublicDir = path.join(rootDir, 'backend', 'public');

console.log('🚀 Starting production build process...');

// Step 1: Run frontend build
try {
  console.log('📦 Building React frontend...');
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Frontend built successfully.');
} catch (err) {
  console.error('❌ Frontend build failed:', err.message);
  process.exit(1);
}

// Step 2: Clean up previous assets in backend/public
console.log('🧹 Cleaning up old public assets in backend...');
const oldAssetsDir = path.join(backendPublicDir, 'assets');
const oldIndexFile = path.join(backendPublicDir, 'index.html');

if (fs.existsSync(oldAssetsDir)) {
  fs.rmSync(oldAssetsDir, { recursive: true, force: true });
}
if (fs.existsSync(oldIndexFile)) {
  fs.unlinkSync(oldIndexFile);
}

// Helper to recursively copy directories
function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

// Step 3: Copy new built files to backend/public
try {
  console.log('🚚 Copying new build files to Laravel public folder...');
  
  // Copy index.html
  fs.copyFileSync(
    path.join(distDir, 'index.html'),
    oldIndexFile
  );
  
  // Copy assets folder
  copyFolderSync(
    path.join(distDir, 'assets'),
    oldAssetsDir
  );
  
  console.log('✅ Copy complete. All frontend assets are now inside backend/public/.');
  console.log('\n🎉 Platform Ready for Deployment!');
  console.log('You can now deploy the contents of the "backend" directory to your production server.');
  console.log('Ensure your web server points to "backend/public" as the document root.');
} catch (err) {
  console.error('❌ Failed to copy build files:', err.message);
  process.exit(1);
}
