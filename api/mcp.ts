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

const tools = [
  { name: 'create_particles', description: 'Create a soothing particle animation. Try: starry night, ocean, fireflies, cherry blossoms, snow, aurora, rain, bubbles, galaxy, fire, zen', inputSchema: { type: 'object', properties: { prompt: { type: 'string', description: 'Describe the scene' }, mood: { type: 'string', enum: ['calm', 'dreamy', 'energetic', 'peaceful', 'mystical'] } }, required: ['prompt'] } },
  { name: 'list_presets', description: 'Show all particle presets', inputSchema: { type: 'object', properties: {} } },
  { name: 'quick_preset', description: 'Show a preset animation', inputSchema: { type: 'object', properties: { preset: { type: 'string', enum: Object.keys(presets) } }, required: ['preset'] } },
];

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
  return { name: 'Custom', background: 'linear-gradient(to bottom, #1a1a2e, #16213e, #0f3460)', particles: { count: 100, color: '#ffffff', size: [2, 4], speed: 0.5, type: 'float' } };
}

function genWidget(cfg: any): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box}body{overflow:hidden;width:100%;height:400px;background:${cfg.background}}canvas{width:100%;height:100%}.i{position:absolute;bottom:16px;left:16px;color:rgba(255,255,255,.9);font:600 16px system-ui;text-shadow:0 1px 3px rgba(0,0,0,.5)}</style></head><body><canvas id="c"></canvas><div class="i">${cfg.name}</div><script>!function(){const c=${JSON.stringify(cfg)},v=document.getElementById("c"),x=v.getContext("2d");v.width=innerWidth;v.height=400;const p=[];for(let i=0;i<c.particles.count;i++)p.push({x:Math.random()*v.width,y:Math.random()*v.height,s:c.particles.size[0]+Math.random()*(c.particles.size[1]-c.particles.size[0]),vx:(Math.random()-.5)*c.particles.speed,vy:(Math.random()-.5)*c.particles.speed,o:.3+Math.random()*.7,ph:Math.random()*Math.PI*2});function col(p){if(c.particles.color==="rainbow")return"hsl("+((Date.now()/50+p.ph*100)%360)+",80%,60%)";if(c.particles.color==="multi"){const cs=["#ff6b6b","#4ecdc4","#45b7d1","#96ceb4","#ffeaa7"];return cs[Math.floor(p.ph*cs.length)%cs.length]}return c.particles.color}function draw(){x.clearRect(0,0,v.width,v.height);p.forEach(p=>{const t=c.particles.type;if(t==="star"){p.x+=p.vx*.1;p.y+=p.vy*.1;if(c.particles.twinkle)p.o=.3+Math.abs(Math.sin(Date.now()/1000+p.ph))*.7}else if(t==="snow"){p.x+=Math.sin(Date.now()/2000+p.ph)*.5;p.y+=c.particles.speed*.5;if(p.y>v.height){p.y=-p.s;p.x=Math.random()*v.width}}else if(t==="rain"){p.y+=c.particles.speed;if(p.y>v.height){p.y=-p.s;p.x=Math.random()*v.width}}else if(t==="bubble"){p.x+=Math.sin(Date.now()/1500+p.ph)*.5;p.y-=c.particles.speed*.3;if(p.y<-p.s){p.y=v.height+p.s;p.x=Math.random()*v.width}}else if(t==="petal"){p.x+=Math.sin(Date.now()/1000+p.ph);p.y+=c.particles.speed;if(p.y>v.height){p.y=-p.s;p.x=Math.random()*v.width}}else if(t==="glow"){p.x+=Math.sin(Date.now()/2000+p.ph)*.5;p.y+=Math.cos(Date.now()/2000+p.ph)*.5;if(c.particles.pulse)p.o=.2+Math.abs(Math.sin(Date.now()/500+p.ph))*.8}else if(t==="wave"){p.x+=c.particles.speed;p.y+=Math.sin(Date.now()/1000+p.ph)*.5;if(p.x>v.width)p.x=-p.s}else if(t==="aurora"){p.x+=Math.sin(Date.now()/3000+p.ph)*2;p.y+=Math.cos(Date.now()/4000+p.ph)*.5;p.o=.3+Math.abs(Math.sin(Date.now()/2000+p.ph))*.5}else if(t==="galaxy"){const cx=v.width/2,cy=v.height/2,a=Math.atan2(p.y-cy,p.x-cx)+c.particles.speed*.01,d=Math.sqrt((p.x-cx)**2+(p.y-cy)**2);p.x=cx+Math.cos(a)*d;p.y=cy+Math.sin(a)*d}else if(t==="fire"){p.y-=c.particles.speed*(.5+Math.random()*.5);p.x+=Math.sin(Date.now()/500+p.ph)*.5;p.o-=.01;if(p.o<=0||p.y<0){p.y=v.height;p.x=v.width/2+(Math.random()-.5)*100;p.o=.8}}else{p.x+=p.vx;p.y+=p.vy}if(p.x<-p.s)p.x=v.width+p.s;if(p.x>v.width+p.s)p.x=-p.s;if(t!=="snow"&&t!=="rain"&&t!=="bubble"&&t!=="petal"&&t!=="fire"){if(p.y<-p.s)p.y=v.height+p.s;if(p.y>v.height+p.s)p.y=-p.s}x.globalAlpha=p.o;const cl=col(p);if(t==="rain"){x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x,p.y+p.s*3);x.strokeStyle=cl;x.stroke()}else if(t==="bubble"){x.beginPath();x.arc(p.x,p.y,p.s,0,Math.PI*2);x.strokeStyle=cl;x.stroke()}else if(t==="glow"||t==="aurora"||t==="fire"){const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.s*3);g.addColorStop(0,cl);g.addColorStop(1,"transparent");x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,p.s*3,0,Math.PI*2);x.fill()}else{x.beginPath();x.arc(p.x,p.y,p.s,0,Math.PI*2);x.fillStyle=cl;if(t==="star"){x.shadowColor=cl;x.shadowBlur=p.s*2}x.fill();x.shadowBlur=0}});requestAnimationFrame(draw)}draw()}();</script></body></html>`;
}

function handleTool(name: string, args: any): any {
  if (name === 'create_particles') {
    const cfg = matchPreset(args.prompt);
    cfg.prompt = args.prompt;
    return { content: [{ type: 'text', text: `✨ ${cfg.name} created` }, { type: 'resource', resource: { uri: 'ui://particle-widget', mimeType: 'text/html+skybridge', text: genWidget(cfg) } }], structuredContent: cfg };
  }
  if (name === 'list_presets') {
    return { content: [{ type: 'text', text: `✨ Presets:\n${Object.values(presets).map((v: any) => `• ${v.name}`).join('\n')}` }] };
  }
  if (name === 'quick_preset') {
    const cfg = { ...presets[args.preset] || presets.starryNight };
    return { content: [{ type: 'text', text: `✨ ${cfg.name}` }, { type: 'resource', resource: { uri: 'ui://particle-widget', mimeType: 'text/html+skybridge', text: genWidget(cfg) } }], structuredContent: cfg };
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
  
  if (method === 'initialize') return res.json({ jsonrpc: '2.0', id, result: { protocolVersion: '2024-11-05', capabilities: { tools: {}, resources: {} }, serverInfo: { name: 'particle-presentations', version: '1.0.0' } } });
  if (method === 'tools/list') return res.json({ jsonrpc: '2.0', id, result: { tools } });
  if (method === 'tools/call') return res.json({ jsonrpc: '2.0', id, result: handleTool(params.name, params.arguments || {}) });
  if (method === 'resources/list') return res.json({ jsonrpc: '2.0', id, result: { resources: [{ uri: 'ui://particle-widget', name: 'Particle Widget', mimeType: 'text/html+skybridge' }] } });
  if (method === 'resources/read') return res.json({ jsonrpc: '2.0', id, result: { contents: [{ uri: 'ui://particle-widget', mimeType: 'text/html+skybridge', text: genWidget(presets.starryNight) }] } });
  
  return res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } });
}
