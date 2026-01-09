# <img src="src/public/images/cedar.png" alt="Cedar Logo" width="30"> Cedar

A modern, cross-platform chatbot interface built with React, TypeScript, and Tauri. Cedar provides a unified interface for interacting with multiple AI providers through an intuitive chat experience.

## Features

- **Multi-Provider Support**: Seamlessly switch between different AI providers
- **Cross-Platform**: Available as a web application and desktop app (via Tauri)
- **Modern UI**: Built with React and styled with Tailwind CSS
- **Real-time Chat**: Smooth, responsive conversation interface
- **Chat History**: Persistent chat threads and history management
- **MCP Integration**: Model Context Protocol support for enhanced AI interactions
- **Web Search Integration**: Powered by Exa AI, enables AI models to search the web for current information and cite sources with automatic reference formatting

## Supported Providers

- Anthropic
- DeepInfra
- Fireworks AI
- OpenAI
- OpenRouter

## Web Search Integration

Cedar includes optional web search capabilities powered by Exa. When enabled, AI models can search the web for current information, recent articles, and up-to-date facts during conversations.

### Setup

To enable web search, add your Exa AI API key to your environment variables:

```env
EXA_API_KEY=your_exa_api_key_here
```

Once configured, the web search toggle will appear in the chat interface. The feature is automatically available to all AI models when enabled for a conversation.

## Deployment

### Prerequisites

- Bun runtime
- PostgreSQL server
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
    # Database
    DATABASE_URL=postgresql://username:password@localhost:5432/cedar

    # Authentication
    BETTER_AUTH_SECRET=...
    BETTER_AUTH_URL=... # base url of your cedar deployment

    # AI Provider Configuration
    OPENAI_API_KEY=...
    OPENROUTER_API_KEY=...
    DEEPINFRA_API_KEY=...
    FIREWORKS_API_KEY=...

    # Web Search (Optional)
    EXA_API_KEY=... # Exa AI API key for web search functionality
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
   bun run start
   ```

### Desktop Application

To build the desktop application:

```bash
bun run tauri build
```
