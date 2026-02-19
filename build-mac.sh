#!/bin/bash
# Build EGIEdit distributable for macOS (DMG for arm64 and x64)
set -e

cd "$(dirname "$0")"

echo "Building EGIEdit for macOS..."
npm run build
npx electron-builder --mac

echo ""
echo "Done. Output files:"
ls -lh release/*.dmg
