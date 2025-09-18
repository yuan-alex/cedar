# <img src="src/public/images/cedar.png" alt="Cedar Logo" width="30"> Cedar

A modern, cross-platform chatbot interface built with React, TypeScript, and Tauri. Cedar provides a unified interface for interacting with multiple AI providers through an intuitive chat experience.

## Features

- **Multi-Provider Support**: Seamlessly switch between different AI providers
- **Cross-Platform**: Available as a web application and desktop app (via Tauri)
- **Modern UI**: Built with React and styled with Tailwind CSS
- **Real-time Chat**: Smooth, responsive conversation interface
- **Chat History**: Persistent chat threads and history management
- **MCP Integration**: Model Context Protocol support for enhanced AI interactions

## Supported Providers

- OpenAI
- Anthropic
- OpenRouter
- Fireworks AI
- DeepInfra

## Deployment

### Prerequisites

- Bun runtime
- Database (PostgreSQL recommended)
- API keys for your chosen AI providers

### Production Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cedar
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   FIREWORKS_API_KEY=your_fireworks_api_key_here
   DEEPINFRA_API_KEY=your_deepinfra_api_key_here
   DATABASE_URL=your_production_database_url_here
   NODE_ENV=production
   PORT=3000
   ```

4. **Set up the database**

   ```bash
   bun run db:migrate
   ```

5. **Build for production**

   ```bash
   bun run build
   ```

6. **Start the production server**

   ```bash
   bun run preview
   ```

### Desktop Application

To build the desktop application:

```bash
bun run tauri build
```

## Usage

### Web Application

Cedar runs as a web application accessible through your browser. Navigate to your deployed instance or local development server.

### Key Features

- **Chat Interface**: Send messages to AI models through an intuitive chat interface
- **Provider Selection**: Choose from multiple AI providers for each conversation
- **Chat History**: Access previous conversations and continue threads
- **Settings**: Customize your experience with theme preferences and provider configurations

## Development

### Prerequisites

- Bun (recommended) or Node.js
- Tauri CLI (for desktop builds)

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cedar
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up development environment**

   Create a `.env` file for development:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   FIREWORKS_API_KEY=your_fireworks_api_key_here
   DEEPINFRA_API_KEY=your_deepinfra_api_key_here
   DATABASE_URL=your_database_url_here
   NODE_ENV=development
   # Add other provider keys as needed
   ```

   See the `config/config.dev.yml` file for configuration examples and available models.

4. **Set up the database**

   ```bash
   bun run db:migrate
   ```

5. **Start the development server**

   ```bash
   bun run dev
   ```

6. **Open your browser** to `http://localhost:3000`
