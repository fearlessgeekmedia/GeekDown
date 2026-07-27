#!/usr/bin/env bash
# Build script for Linux and macOS

echo "Building GeekDown..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Build frontend
echo "Building frontend..."
npm run build

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux build
    echo "Building Tauri binary for Linux..."
    cd src-tauri
    cargo build --release
    
    # Create AppImage if linuxdeploy is available
    if command -v linuxdeploy &> /dev/null; then
        echo "Attempting AppImage creation..."
        # Try Tauri bundler first (from project root)
        cd ..
        if npm run tauri build 2>&1 | tee /tmp/tauri-build.log | grep -q "failed to run linuxdeploy"; then
            # Fallback: manually create AppImage from AppDir
            echo "Tauri bundler failed, creating AppImage manually..."
            if [ -d "src-tauri/target/release/bundle/appimage/GeekDown.AppDir" ]; then
                APPIMAGE_EXTRACT_AND_RUN=1 linuxdeploy \
                    --appdir src-tauri/target/release/bundle/appimage/GeekDown.AppDir \
                    --output appimage
                mv GeekDown-x86_64.AppImage src-tauri/target/release/bundle/appimage/ 2>/dev/null || true
            fi
        else
            echo "AppImage created successfully!"
        fi
    else
        echo "linuxdeploy not found, skipping AppImage creation"
        echo "Binary available at: src-tauri/target/release/geekdown"
    fi
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS build
    echo "Building Tauri app for macOS..."
    npm run tauri build
    echo "Build complete! App bundle available at: src-tauri/target/release/bundle/"
fi

echo "Build complete!"