import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASE_URL = 'https://particel-io-vdbc.vercel.app';

const presets: Record<string, any> = {
  starryNight: { name: 'Starry Night', background: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)', particles: { count: 200, color: '#ffffff', size: [1, 3], speed: 0.3, type: 'star', twinkle: true } },
  ocean: { name: 'Calm Ocean', background: 'linear-gradient(to bottom, #1a3a52, #2d5a7b, #1e4d6b)', particles: { count: 80, color: '#87ceeb', size: [2, 6], speed: 0.8, type: 'wave' } },
  fireflies: { name: 'Fireflies', background: 'linear-gradient(to bottom, #1a1a2e, #16213e, #0f0f23)', particles: { count: 50, color: '#ffeb3b', size: [2, 5], speed: 0.5, type: 'glow', pulse: true } },
  sakura: { name: 'Cherry Blossoms', background: 'linear-gradient(to bottom, #fce4ec, #f8bbd9, #f48fb1)', particles: { count: 60, color: '#ff69b4', size: [8, 15], speed: 1.2, type: 'petal' } },
  snow: { name: 'Gentle Snow', background: 'linear-gradient(to bottom, #2c3e50, #4a6572, #232526)', particles: { count: 150, color: '#ffffff', size: [2, 5], speed: 1, type: 'snow' } },
  aurora: { name: 'Northern Lights', background: 'linear-gradient(to bottom, #0a0a1a, #1a1a3a, #0f0f2f)', particles: { count: 100, color: 'rainbow', size: [2, 4], speed: 0.4, type: 'aurora' } },
  rain: { name: 'Peaceful Rain', background: 'linear-gradient(to bottom, #373b44, #4286f4, #373b44)', particles: { count: 200, color: '#a8d8ea', size: [1, 3], speed: 8, type: 'rain' } },
  bubbles: { name: 'Floating Bubbles', background: 'linear-gradient(to bottom, #e0f7fa, #b2ebf2, #80deea)', particles: { count: 40, color: '#ffffff', size: [10, 30], speed: 0.6, type: 'bubble' } },
  galaxy: { name: 'Galaxy Spiral', background: 'radial-gradient(ellipse at center, #1a0a2e, #0d0015, #000000)', particles: { count: 300, color: 'multi', size: [1, 3], speed: 0.2, type: 'galaxy' } },
  fire: { name: 'Warm Fire', background: 'linear-gradient(to bottom, #1a0a00, #2d1810, #0f0500)', particles: { count: 120, color: '#ff6b35', size: [2, 6], speed: 2, type: 'fire' } },
  zen: { name: 'Zen Garden', background: 'linear-gradient(to bottom, #f5f5dc, #e8e4c9, #d4cfb4)', particles: { count: 30, color: '#8b7355', size: [3, 6], speed: 0.3, type: 'sand' } },
};

function matchPreset(prompt: string): any {
  const p = prompt.toLowerCase();
  if (p.includes('star') || p.includes('night')) return { ...presets.starryNight };
  if (p.includes('ocean') || p.includes('sea') || p.includes('wave')) return { ...presets.ocean };
  if (p.includes('firefl') || p.includes('glow')) return { ...presets.fireflies };
  if (p.includes('cherry') || p.includes('sakura') || p.includes('blossom')) return { ...presets.sakura };
  if (p.includes('snow')) return { ...presets.snow };
  if (p.includes('aurora') || p.includes('northern')) return { ...presets.aurora };
  if (p.includes('rain')) return { ...presets.rain };
  if (p.includes('bubble')) return { ...presets.bubbles };
  if (p.includes('galaxy') || p.includes('space')) return { ...presets.galaxy };
  if (p.includes('fire') || p.includes('flame')) return { ...presets.fire };
  if (p.includes('zen') || p.includes('sand')) return { ...presets.zen };
  return { ...presets.starryNight };
}

// Tools with ui.resource pointing to widget URL
const tools = [
  { 
    name: 'create_particles', 
    description: 'Create a soothing particle animation. Try: starry night, ocean, fireflies, cherry blossoms, snow, aurora, rain, bubbles, galaxy, fire, zen',
    inputSchema: { type: 'object', properties: { prompt: { type: 'string', description: 'Describe the particle scene' } }, required: ['prompt'] },
    ui: { type: 'html', resource: `${BASE_URL}/widget.html` }
  },
  { 
    name: 'list_presets', 
    description: 'Show all available particle presets',
    inputSchema: { type: 'object', properties: {} } 
  },
  { 
    name: 'quick_preset', 
    description: 'Show a preset particle animation',
    inputSchema: { type: 'object', properties: { preset: { type: 'string', enum: Object.keys(presets) } }, required: ['preset'] },
    ui: { type: 'html', resource: `${BASE_URL}/widget.html` }
  },
];

function handleTool(name: string, args: any): any {
  if (name === 'create_particles') {
    const cfg = matchPreset(args.prompt || '');
    return { config: cfg, preset: cfg.name, prompt: args.prompt };
  }
  
  if (name === 'list_presets') {
    const list = Object.entries(presets).map(([k, v]: [string, any]) => ({ id: k, name: v.name }));
    return { presets: list, message: 'Available presets - use quick_preset to show one!' };
  }
  
  if (name === 'quick_preset') {
    const cfg = presets[args.preset] || presets.starryNight;
    return { config: cfg, preset: args.preset };
  }
  
  return { error: 'Unknown tool' };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, mcp-session-id');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { method, id, params } = req.body;
  
  if (method === 'initialize') {
    return res.json({ 
      jsonrpc: '2.0', id, 
      result: { 
        protocolVersion: '2024-11-05', 
        capabilities: { tools: {}, resources: {} }, 
        serverInfo: { name: 'particle-presentations', version: '1.0.0' } 
      } 
    });
  }
  
  if (method === 'tools/list') {
    return res.json({ jsonrpc: '2.0', id, result: { tools } });
  }
  
  if (method === 'tools/call') {
    const result = handleTool(params.name, params.arguments || {});
    return res.json({ 
      jsonrpc: '2.0', 
      id, 
      result: {
        content: [{ type: 'text', text: JSON.stringify(result) }],
        structuredContent: result
      }
    });
  }
  
  if (method === 'resources/list') {
    return res.json({ 
      jsonrpc: '2.0', id, 
      result: { resources: [{ uri: `${BASE_URL}/widget.html`, name: 'Particle Widget', mimeType: 'text/html' }] } 
    });
  }
  
  return res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } });
}
