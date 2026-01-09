import type { VercelRequest, VercelResponse } from '@vercel/node';

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

// Widget HTML that reads from window.openai.toolOutput
const widgetHtml = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden}
body{font-family:system-ui,sans-serif;background:#1a1a2e}
canvas{display:block;width:100%;height:100%}
.info{position:absolute;bottom:16px;left:16px;color:rgba(255,255,255,.9);font-size:16px;font-weight:600;text-shadow:0 1px 3px rgba(0,0,0,.5)}
</style>
</head>
<body>
<canvas id="c"></canvas>
<div class="info" id="info"></div>
<script>
(function(){
  // Get config from ChatGPT's toolOutput or use default
  var toolOutput = window.openai?.toolOutput || {};
  var cfg = toolOutput.config || {
    name: 'Starry Night',
    background: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',
    particles: { count: 200, color: '#ffffff', size: [1, 3], speed: 0.3, type: 'star', twinkle: true }
  };
  
  document.body.style.background = cfg.background;
  document.getElementById('info').textContent = cfg.name;
  
  var canvas = document.getElementById('c');
  var ctx = canvas.getContext('2d');
  
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();
  
  var particles = [];
  for (var i = 0; i < cfg.particles.count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      s: cfg.particles.size[0] + Math.random() * (cfg.particles.size[1] - cfg.particles.size[0]),
      vx: (Math.random() - 0.5) * cfg.particles.speed,
      vy: (Math.random() - 0.5) * cfg.particles.speed,
      o: 0.3 + Math.random() * 0.7,
      ph: Math.random() * Math.PI * 2
    });
  }
  
  function getColor(p) {
    if (cfg.particles.color === 'rainbow') return 'hsl(' + ((Date.now()/50 + p.ph*100) % 360) + ',80%,60%)';
    if (cfg.particles.color === 'multi') {
      var cs = ['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7'];
      return cs[Math.floor(p.ph * cs.length) % cs.length];
    }
    return cfg.particles.color;
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var t = cfg.particles.type;
      
      if (t === 'star') { p.x += p.vx * 0.1; p.y += p.vy * 0.1; if (cfg.particles.twinkle) p.o = 0.3 + Math.abs(Math.sin(Date.now()/1000 + p.ph)) * 0.7; }
      else if (t === 'snow') { p.x += Math.sin(Date.now()/2000 + p.ph) * 0.5; p.y += cfg.particles.speed * 0.5; if (p.y > canvas.height) { p.y = -p.s; p.x = Math.random() * canvas.width; } }
      else if (t === 'rain') { p.y += cfg.particles.speed; if (p.y > canvas.height) { p.y = -p.s; p.x = Math.random() * canvas.width; } }
      else if (t === 'bubble') { p.x += Math.sin(Date.now()/1500 + p.ph) * 0.5; p.y -= cfg.particles.speed * 0.3; if (p.y < -p.s) { p.y = canvas.height + p.s; p.x = Math.random() * canvas.width; } }
      else if (t === 'petal') { p.x += Math.sin(Date.now()/1000 + p.ph); p.y += cfg.particles.speed; if (p.y > canvas.height) { p.y = -p.s; p.x = Math.random() * canvas.width; } }
      else if (t === 'glow') { p.x += Math.sin(Date.now()/2000 + p.ph) * 0.5; p.y += Math.cos(Date.now()/2000 + p.ph) * 0.5; if (cfg.particles.pulse) p.o = 0.2 + Math.abs(Math.sin(Date.now()/500 + p.ph)) * 0.8; }
      else if (t === 'wave') { p.x += cfg.particles.speed; p.y += Math.sin(Date.now()/1000 + p.ph) * 0.5; if (p.x > canvas.width) p.x = -p.s; }
      else if (t === 'aurora') { p.x += Math.sin(Date.now()/3000 + p.ph) * 2; p.y += Math.cos(Date.now()/4000 + p.ph) * 0.5; p.o = 0.3 + Math.abs(Math.sin(Date.now()/2000 + p.ph)) * 0.5; }
      else if (t === 'galaxy') { var cx = canvas.width/2, cy = canvas.height/2, a = Math.atan2(p.y-cy, p.x-cx) + cfg.particles.speed * 0.01, d = Math.sqrt((p.x-cx)*(p.x-cx) + (p.y-cy)*(p.y-cy)); p.x = cx + Math.cos(a) * d; p.y = cy + Math.sin(a) * d; }
      else if (t === 'fire') { p.y -= cfg.particles.speed * (0.5 + Math.random() * 0.5); p.x += Math.sin(Date.now()/500 + p.ph) * 0.5; p.o -= 0.01; if (p.o <= 0 || p.y < 0) { p.y = canvas.height; p.x = canvas.width/2 + (Math.random() - 0.5) * 100; p.o = 0.8; } }
      else { p.x += p.vx; p.y += p.vy; }
      
      if (p.x < -p.s) p.x = canvas.width + p.s;
      if (p.x > canvas.width + p.s) p.x = -p.s;
      if (t !== 'snow' && t !== 'rain' && t !== 'bubble' && t !== 'petal' && t !== 'fire') {
        if (p.y < -p.s) p.y = canvas.height + p.s;
        if (p.y > canvas.height + p.s) p.y = -p.s;
      }
      
      ctx.globalAlpha = p.o;
      var color = getColor(p);
      
      if (t === 'rain') { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y + p.s * 3); ctx.strokeStyle = color; ctx.stroke(); }
      else if (t === 'bubble') { ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.strokeStyle = color; ctx.stroke(); }
      else if (t === 'glow' || t === 'aurora' || t === 'fire') { var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s * 3); g.addColorStop(0, color); g.addColorStop(1, 'transparent'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 3, 0, Math.PI * 2); ctx.fill(); }
      else { ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fillStyle = color; if (t === 'star') { ctx.shadowColor = color; ctx.shadowBlur = p.s * 2; } ctx.fill(); ctx.shadowBlur = 0; }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
</script>
</body></html>`;

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

const tools = [
  { 
    name: 'create_particles', 
    description: 'Create a soothing particle animation. Try: starry night, ocean, fireflies, cherry blossoms, snow, aurora, rain, bubbles, galaxy, fire, zen',
    inputSchema: { type: 'object', properties: { prompt: { type: 'string', description: 'Describe the particle scene' } }, required: ['prompt'] },
    _meta: { 'openai/outputTemplate': 'ui://widget/particles.html' }
  },
  { 
    name: 'list_presets', 
    description: 'Show all available particle animation presets',
    inputSchema: { type: 'object', properties: {} } 
  },
  { 
    name: 'quick_preset', 
    description: 'Show a specific preset particle animation',
    inputSchema: { type: 'object', properties: { preset: { type: 'string', enum: Object.keys(presets) } }, required: ['preset'] },
    _meta: { 'openai/outputTemplate': 'ui://widget/particles.html' }
  },
];

function handleTool(name: string, args: any): any {
  if (name === 'create_particles') {
    const cfg = matchPreset(args.prompt || '');
    return {
      content: [{ type: 'text', text: `✨ ${cfg.name} particles created!` }],
      structuredContent: { config: cfg },
      _meta: {
        'openai/outputTemplate': {
          type: 'resource',
          resource: { uri: 'ui://widget/particles.html', mimeType: 'text/html+skybridge', text: widgetHtml }
        }
      }
    };
  }
  
  if (name === 'list_presets') {
    const list = Object.entries(presets).map(([k, v]: [string, any]) => `• ${k}: ${v.name}`).join('\n');
    return { content: [{ type: 'text', text: `✨ Available Presets:\n\n${list}\n\nUse quick_preset or describe what you want!` }] };
  }
  
  if (name === 'quick_preset') {
    const cfg = presets[args.preset] || presets.starryNight;
    return {
      content: [{ type: 'text', text: `✨ ${cfg.name}` }],
      structuredContent: { config: cfg },
      _meta: {
        'openai/outputTemplate': {
          type: 'resource',
          resource: { uri: 'ui://widget/particles.html', mimeType: 'text/html+skybridge', text: widgetHtml }
        }
      }
    };
  }
  
  return { content: [{ type: 'text', text: 'Unknown tool' }], isError: true };
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
    return res.json({ jsonrpc: '2.0', id, result: handleTool(params.name, params.arguments || {}) });
  }
  
  if (method === 'resources/list') {
    return res.json({ 
      jsonrpc: '2.0', id, 
      result: { 
        resources: [{ 
          uri: 'ui://widget/particles.html', 
          name: 'Particle Animation', 
          mimeType: 'text/html+skybridge',
          _meta: { 'openai/widgetDescription': 'Soothing particle animation widget' }
        }] 
      } 
    });
  }
  
  if (method === 'resources/read') {
    return res.json({ 
      jsonrpc: '2.0', id, 
      result: { contents: [{ uri: 'ui://widget/particles.html', mimeType: 'text/html+skybridge', text: widgetHtml }] } 
    });
  }
  
  return res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } });
}
