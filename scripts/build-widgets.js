/**
 * Build script for widget HTML files
 * Copies widgets from src/widgets to dist/widgets
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '..', 'src', 'widgets');
const distDir = path.join(__dirname, '..', 'dist', 'widgets');

// Create dist/widgets directory
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy all HTML files
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const src = path.join(srcDir, file);
  const dest = path.join(distDir, file);
  fs.copyFileSync(src, dest);
  console.log(`✓ Copied ${file}`);
}

console.log(`\n✅ Built ${files.length} widgets to dist/widgets/`);
