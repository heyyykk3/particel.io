# ✨ Particle Presentations for ChatGPT

Soothing particle animations that run inside ChatGPT. Describe what you want, and it creates beautiful animated scenes.

## Try It

Ask ChatGPT:
- "Show me a starry night sky"
- "Create peaceful rain"
- "Make floating bubbles"
- "Show cherry blossoms falling"

## Presets

🌟 Starry Night | 🌊 Ocean | 🔥 Fireflies | 🌸 Cherry Blossoms | ❄️ Snow
🌌 Aurora | 🌧️ Rain | 🫧 Bubbles | 🌀 Galaxy | 🧘 Zen Garden

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel: https://vercel.com/new
3. Deploy (no config needed)

Or use CLI:
```bash
npm i -g vercel
vercel
```

## Connect to ChatGPT

1. Get your Vercel URL (e.g., `https://particle-presentations.vercel.app`)
2. ChatGPT → Settings → Apps & Connectors → Developer Mode
3. Add MCP server:

```json
{
  "mcpServers": {
    "particles": {
      "url": "https://YOUR-APP.vercel.app/mcp",
      "transport": "streamable-http"
    }
  }
}
```

4. Ask: "Show me a starry night"

## Local Dev

```bash
npm install
npm run dev
```

## Tech

- OpenAI Apps SDK (MCP)
- Vercel Serverless Functions
- Canvas particle animations
