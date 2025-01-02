#!/bin/bash

# Check if nvm is installed
if ! command -v nvm &> /dev/null; then
    echo "nvm is not installed. Please install nvm first:"
    echo "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash"
    exit 1
fi

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install and use the correct Node.js version
nvm install
nvm use

# Install dependencies
npm install

echo "Setup complete! Node.js $(node -v) and npm $(npm -v) are now configured."