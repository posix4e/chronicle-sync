# Chronicle Sync

A cross-platform browser history synchronization solution that works across iOS, Android (Firefox), and Chrome, with a web interface for viewing history.

## Features

- 🔄 Real-time synchronization across devices
- 📱 Support for multiple platforms:
  - iOS (App Store)
  - Firefox Android (Firefox Add-ons)
  - Chrome (Chrome Web Store)
  - Web Interface (Read-only history viewer)
- 🔒 Local-first data storage with RxDB
- 🚀 Seamless sync between devices
- 🎯 Single codebase using React Native

## Development

### Prerequisites

- Node.js >= 16
- React Native development environment
- Xcode (for iOS development)
- Android Studio (for Android development)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/openhands/chronicle-sync.git
cd chronicle-sync
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Project Structure

```
chronicle-sync/
├── apps/
│   ├── mobile/          # React Native mobile app (iOS/Android)
│   ├── web/             # Web interface
│   ├── chrome/          # Chrome extension
│   └── firefox/         # Firefox extension
├── packages/
│   ├── core/            # Shared business logic
│   ├── ui/              # Shared UI components
│   └── sync/            # RxDB sync implementation
├── e2e/                 # End-to-end tests
└── infrastructure/      # Backend services for sync
```

### Testing

Run tests:
```bash
npm test               # Unit tests
npm run test:e2e      # End-to-end tests
npm run lint          # Linting
```

### Building

- iOS: `npm run build:ios`
- Android: `npm run build:android`
- Chrome Extension: `npm run build:chrome`
- Firefox Extension: `npm run build:firefox`
- Web Interface: `npm run build:web`

## Deployment

The project uses GitHub Actions for CI/CD:

- Pull requests trigger lint, unit tests, and e2e tests
- Merges to master automatically deploy backend services
- New releases are created via GitHub releases/tags

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details