#!/bin/bash
# Build EGIEdit distributable for Windows (zip, x64)
# Run this on macOS or Linux. For an NSIS installer (.exe setup), run on Windows instead.
set -e

cd "$(dirname "$0")"

echo "Building EGIEdit for Windows..."
npm run build
npx electron-builder --win

echo ""
echo "Done. Output files:"
ls -lh release/*.zip
