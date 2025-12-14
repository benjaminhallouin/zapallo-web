# Zapallo Web

A web-based backoffice interface for managing trading card exchange data through the Zapallo API.

## Overview

Zapallo Web is a Next.js application that provides a user-friendly interface for managing:

- **Exchanges**: Trading card platforms and marketplaces
- **Exchange Users**: Sellers and buyers on these platforms
- **Exchange Cards**: Trading cards listed on various exchanges

This application consumes the [Zapallo REST API](https://github.com/benjaminhallouin/zapallo) as its backend.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **HTTP Client**: Fetch API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Access to a running Zapallo API instance

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your API URL
```

### Environment Configuration

The application requires the following environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:8000` | Base URL of the Zapallo API |
| `NEXT_PUBLIC_API_TIMEOUT` | No | `30000` | API request timeout in milliseconds |

**Setup steps:**

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and set your API URL:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_API_TIMEOUT=30000
   ```

3. The configuration is validated on application startup. If required variables are missing, the application will throw an error with details about which variables need to be set.

**Note**: Never commit `.env.local` to version control. Use `.env.local.example` to document required variables.

### Development

```bash
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Project Structure

```
zapallo-web/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and API client
│   └── styles/          # Global styles
├── tests/               # Test files
└── docs/                # Documentation
```

## Related Projects

- [Zapallo API](https://github.com/benjaminhallouin/zapallo) - Backend REST API
- [Zapallo Scrapers](https://github.com/benjaminhallouin/zapallo-scrapers) - Data collection tools

## License

See LICENSE file for details.
