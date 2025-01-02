# OpenHands Development Guide

This guide provides instructions for developing Chronicle Sync using OpenHands.

## Environment Setup

1. Configure git credentials:
```bash
git config --global user.name "openhands"
git config --global user.email "openhands@all-hands.dev"
```

2. Set up Node.js environment:
```bash
# Install nvm and Node.js 20.10.0
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 20.10.0
nvm use 20.10.0
```

3. Run the setup script:
```bash
./scripts/setup.sh
```

## Development Workflow

### Starting Development

1. Start the development server:
```bash
npm start
```

2. For specific platforms:
- iOS: `npm run ios`
- Android: `npm run android`
- Web: `npm run web`
- Chrome Extension: `cd apps/chrome && npm start`
- Firefox Extension: `cd apps/firefox && npm start`

### Testing

Run tests in the OpenHands environment:
```bash
# Unit tests
npm test

# End-to-end tests
npm run test:e2e

# Linting
npm run lint
```

### Building

Build specific platforms:
```bash
# iOS app
npm run build:ios

# Android app
npm run build:android

# Chrome extension
npm run build:chrome

# Firefox extension
npm run build:firefox

# Web interface
npm run build:web
```

## Project Structure

The project follows a monorepo structure:

```
chronicle-sync/
├── apps/
│   ├── mobile/          # React Native mobile app
│   ├── web/             # Web interface
│   ├── chrome/          # Chrome extension
│   └── firefox/         # Firefox extension
├── packages/
│   ├── core/            # Shared business logic
│   ├── ui/              # Shared UI components
│   └── sync/            # RxDB sync implementation
├── e2e/                 # End-to-end tests
└── infrastructure/      # Backend services
```

## Common Tasks

### Adding Dependencies

1. For shared dependencies:
```bash
npm install <package-name>
```

2. For platform-specific dependencies:
```bash
cd apps/<platform>
npm install <package-name>
```

### Running Platform-Specific Code

1. Navigate to the platform directory:
```bash
cd apps/<platform>
```

2. Run the development server:
```bash
npm start
```

### Debugging

1. For mobile apps:
- iOS: Use Xcode's built-in debugger
- Android: Use Android Studio's debugger or Chrome DevTools

2. For web and extensions:
- Use Chrome DevTools or Firefox Developer Tools

3. For backend services:
- Use standard Node.js debugging tools

## Troubleshooting

1. If the development server fails to start:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

2. For iOS build issues:
```bash
cd apps/mobile/ios
pod install
```

3. For Android build issues:
```bash
cd apps/mobile/android
./gradlew clean
```