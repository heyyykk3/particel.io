/**
 * Particle Presentations App for ChatGPT
 * 
 * Creates beautiful, soothing particle animations based on user prompts.
 * Built with OpenAI Apps SDK (MCP).
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express, { Request, Response } from 'express';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadWidget(name: string): string {
  const widgetPath = path.join(__dirname, '..', 'widgets', `${name}.html`);
  if (fs.existsSync(widgetPath)) {
    return fs.readFileSync(widgetPath, 'utf-8');
  }
  return '';
}

const server = new McpServer({
  name: 'particle-presentations',
  version: '1.0.0',
});

// Preset themes with particle configurations
const presets: Record<string, any> = {
  starryNight: {
    name: 'Starry Night',
    background: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',
    particles: { count: 200, color: '#ffffff', size: [1, 3], speed: 0.3, type: 'star', twinkle: true },
  },
  ocean: {
    name: 'Calm Ocean',
    background: 'linear-gradient(to bottom, #1a3a52, #2d5a7b, #1e4d6b)',
    particles: { count: 80, color: '#87ceeb', size: [2, 6], speed: 0.8, type: 'wave', flow: 'horizontal' },
  },
  fireflies: {
    name: 'Fireflies',
    background: 'linear-gradient(to bottom, #1a1a2e, #16213e, #0f0f23)',
    particles: { count: 50, color: '#ffeb3b', size: [2, 5], speed: 0.5, type: 'glow', pulse: true },
  },
  sakura: {
    name: 'Cherry Blossoms',
    background: 'linear-gradient(to bottom, #fce4ec, #f8bbd9, #f48fb1)',
    particles: { count: 60, color: '#ff69b4', size: [8, 15], speed: 1.2, type: 'petal', rotate: true },
  },
  snow: {
    name: 'Gentle Snow',
    background: 'linear-gradient(to bottom, #2c3e50, #4a6572, #232526)',
    particles: { count: 150, color: '#ffffff', size: [2, 5], speed: 1, type: 'snow', drift: true },
  },
  aurora: {
    name: 'Northern Lights',
    background: 'linear-gradient(to bottom, #0a0a1a, #1a1a3a, #0f0f2f)',
    particles: { count: 100, color: 'rainbow', size: [2, 4], speed: 0.4, type: 'aurora', wave: true },
  },
  rain: {
    name: 'Peaceful Rain',
    background: 'linear-gradient(to bottom, #373b44, #4286f4, #373b44)',
    particles: { count: 200, color: '#a8d8ea', size: [1, 3], speed: 8, type: 'rain', streak: true },
  },
  bubbles: {
    name: 'Floating Bubbles',
    background: 'linear-gradient(to bottom, #e0f7fa, #b2ebf2, #80deea)',
    particles: { count: 40, color: '#ffffff', size: [10, 30], speed: 0.6, type: 'bubble', float: true },
  },
  galaxy: {
    name: 'Galaxy Spiral',
    background: 'radial-gradient(ellipse at center, #1a0a2e, #0d0015, #000000)',
    particles: { count: 300, color: 'multi', size: [1, 3], speed: 0.2, type: 'galaxy', spiral: true },
  },
  spiral: {
    name: 'Spiral Bloom',
    background: 'radial-gradient(circle at center, #1b1f3b, #0f1226)',
    particles: { count: 220, color: '#f6d365', size: [1, 3], speed: 0.2, type: 'glow', pulse: true },
    pattern: { type: 'spiral', turns: 3 },
  },
  ring: {
    name: 'Halo Ring',
    background: 'radial-gradient(circle at center, #0b132b, #1c2541)',
    particles: { count: 200, color: '#a1c4fd', size: [1, 3], speed: 0.2, type: 'star', twinkle: true },
    pattern: { type: 'ring' },
  },
  heart: {
    name: 'Heart Bloom',
    background: 'linear-gradient(to bottom, #2b0f1f, #1a0b14)',
    particles: { count: 180, color: '#ff6b6b', size: [2, 4], speed: 0.2, type: 'glow', pulse: true },
    pattern: { type: 'heart' },
  },
  wave: {
    name: 'Sine Wave',
    background: 'linear-gradient(to bottom, #0c2d48, #145374)',
    particles: { count: 160, color: '#7de2fc', size: [2, 4], speed: 0.2, type: 'wave' },
    pattern: { type: 'wave', amplitude: 0.25, frequency: 2 },
  },
  mandala: {
    name: 'Mandala Rose',
    background: 'radial-gradient(circle at center, #2d1b3f, #120a1a)',
    particles: { count: 240, color: '#ffd86f', size: [1, 3], speed: 0.2, type: 'glow', pulse: true },
    pattern: { type: 'mandala', petals: 8 },
  },
  zen: {
    name: 'Zen Garden',
    background: 'linear-gradient(to bottom, #f5f5dc, #e8e4c9, #d4cfb4)',
    particles: { count: 30, color: '#8b7355', size: [3, 6], speed: 0.3, type: 'sand', ripple: true },
  },
};

// Main tool: Create particle presentation
server.tool(
  'create_particles',
  'Create a beautiful, soothing particle animation. Try: starry night, ocean waves, fireflies, cherry blossoms, snow, aurora, rain, bubbles, galaxy, spiral, ring, heart, wave, mandala, or zen garden.',
  {
    prompt: z.string().describe('Describe the particle scene (e.g., "starry night sky", "gentle snowfall")'),
    mood: z.enum(['calm', 'dreamy', 'energetic', 'peaceful', 'mystical']).optional().describe('The mood of the animation'),
  },
  async ({ prompt, mood = 'calm' }) => {
    const promptLower = prompt.toLowerCase();

    // Match prompt to preset or create custom config
    let config: any;
    
    if (promptLower.includes('star') || promptLower.includes('night sky')) {
      config = { ...presets.starryNight };
    } else if (promptLower.includes('ocean') || promptLower.includes('sea')) {
      config = { ...presets.ocean };
    } else if (promptLower.includes('firefl') || promptLower.includes('glow')) {
      config = { ...presets.fireflies };
    } else if (promptLower.includes('cherry') || promptLower.includes('sakura') || promptLower.includes('blossom') || promptLower.includes('petal')) {
      config = { ...presets.sakura };
    } else if (promptLower.includes('snow')) {
      config = { ...presets.snow };
    } else if (promptLower.includes('aurora') || promptLower.includes('northern light')) {
      config = { ...presets.aurora };
    } else if (promptLower.includes('rain')) {
      config = { ...presets.rain };
    } else if (promptLower.includes('bubble')) {
      config = { ...presets.bubbles };
    } else if (promptLower.includes('galaxy') || promptLower.includes('space') || promptLower.includes('cosmos')) {
      config = { ...presets.galaxy };
    } else if (promptLower.includes('spiral')) {
      config = { ...presets.spiral };
    } else if (promptLower.includes('ring') || promptLower.includes('halo')) {
      config = { ...presets.ring };
    } else if (promptLower.includes('heart')) {
      config = { ...presets.heart };
    } else if (promptLower.includes('wave')) {
      config = { ...presets.wave };
    } else if (promptLower.includes('mandala') || promptLower.includes('rose') || promptLower.includes('flower')) {
      config = { ...presets.mandala };
    } else if (promptLower.includes('zen') || promptLower.includes('sand') || promptLower.includes('garden')) {
      config = { ...presets.zen };
    } else {
      // Default: create a custom calm particle scene
      config = {
        name: 'Custom Scene',
        background: 'linear-gradient(to bottom, #1a1a2e, #16213e, #0f3460)',
        particles: { count: 100, color: '#ffffff', size: [2, 4], speed: 0.5, type: 'float', glow: true },
      };
    }

    // Adjust based on mood
    if (mood === 'energetic') {
      config.particles.speed *= 2;
      config.particles.count = Math.min(config.particles.count * 1.5, 300);
    } else if (mood === 'peaceful' || mood === 'calm') {
      config.particles.speed *= 0.7;
    } else if (mood === 'dreamy') {
      config.particles.glow = true;
      config.particles.blur = true;
    } else if (mood === 'mystical') {
      config.particles.color = 'rainbow';
      config.particles.glow = true;
    }

    config.prompt = prompt;
    config.mood = mood;

    // Return with widget metadata for Apps SDK
    return {
      content: [{ 
        type: 'text' as const, 
        text: `✨ Created "${config.name}" particle presentation for: "${prompt}"\n\n` +
              `🎨 Widget data: ${JSON.stringify(config)}`
      }],
      _meta: {
        'openai/outputTemplate': 'ui://widget/particles.html',
      },
      structuredContent: config,
    };
  }
);

// Tool: List available presets
server.tool(
  'list_presets',
  'Show all available particle presentation presets',
  {},
  async () => {
    const list = Object.entries(presets).map(([key, val]) => ({
      id: key,
      name: val.name,
      type: val.particles.type,
    }));

    return {
      content: [{ 
        type: 'text' as const, 
        text: `✨ Available Particle Presets:\n\n${list.map(p => `• ${p.name} (${p.type})`).join('\n')}\n\nUse create_particles with any of these themes!` 
      }],
    };
  }
);

// Tool: Quick preset
server.tool(
  'quick_preset',
  'Instantly show a preset particle animation',
  {
    preset: z.enum(['starryNight', 'ocean', 'fireflies', 'sakura', 'snow', 'aurora', 'rain', 'bubbles', 'galaxy', 'spiral', 'ring', 'heart', 'wave', 'mandala', 'zen']).describe('Preset name'),
  },
  async ({ preset }) => {
    const config = presets[preset] || presets.starryNight;
    return {
      content: [{ 
        type: 'text' as const, 
        text: `✨ Showing ${config.name} preset\n\n🎨 Widget data: ${JSON.stringify(config)}`
      }],
      _meta: {
        'openai/outputTemplate': 'ui://widget/particles.html',
      },
      structuredContent: { ...config, prompt: config.name },
    };
  }
);

// MCP Resource for widget
server.resource(
  'particles-widget',
  'ui://widget/particles.html',
  { mimeType: 'text/html' },
  async () => ({
    contents: [{
      uri: 'ui://widget/particles.html',
      mimeType: 'text/html+skybridge',
      text: loadWidget('particles'),
    }],
  })
);

// Express server
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, mcp-session-id');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', app: 'particle-presentations', version: '1.0.0' });
});

const sessions = new Map<string, StreamableHTTPServerTransport>();

app.post('/mcp', async (req: Request, res: Response) => {
  const sessionId = req.headers['mcp-session-id'] as string || `session_${Date.now()}`;
  
  let transport = sessions.get(sessionId);
  if (!transport) {
    transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => sessionId });
    sessions.set(sessionId, transport);
    await server.connect(transport);
  }

  try {
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('MCP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/mcp', async (req: Request, res: Response) => {
  const sessionId = req.headers['mcp-session-id'] as string;
  const transport = sessions.get(sessionId);
  if (transport) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    await transport.handleRequest(req, res, undefined);
  } else {
    res.status(400).json({ error: 'No session' });
  }
});

app.delete('/mcp', (req: Request, res: Response) => {
  const sessionId = req.headers['mcp-session-id'] as string;
  if (sessionId) sessions.delete(sessionId);
  res.json({ message: 'Session closed' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║         ✨ Particle Presentations for ChatGPT ✨              ║
╠═══════════════════════════════════════════════════════════════╣
║  Server:  http://localhost:${PORT}                               ║
║  MCP:     http://localhost:${PORT}/mcp                           ║
╠═══════════════════════════════════════════════════════════════╣
║  Presets: starry night, ocean, fireflies, cherry blossoms,    ║
║           snow, aurora, rain, bubbles, galaxy, zen garden     ║
╠═══════════════════════════════════════════════════════════════╣
║  Usage in ChatGPT:                                            ║
║  "Show me a starry night sky"                                 ║
║  "Create peaceful rain animation"                             ║
║  "Make floating bubbles"                                      ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});
