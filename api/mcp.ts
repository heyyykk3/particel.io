import type { VercelRequest, VercelResponse } from '@vercel/node';

// Particle presets
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
  zen: {
    name: 'Zen Garden',
    background: 'linear-gradient(to bottom, #f5f5dc, #e8e4c9, #d4cfb4)',
    particles: { count: 30, color: '#8b7355', size: [3, 6], speed: 0.3, type: 'sand', ripple: true },
  },
};

// MCP tool definitions
const tools = [
  {
    name: 'create_particles',
    description: 'Create a beautiful, soothing particle animation. Try: starry night, ocean waves, fireflies, cherry blossoms, snow, aurora, rain, bubbles, galaxy, or zen garden.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Describe the particle scene' },
        mood: { type: 'string', enum: ['calm', 'dreamy', 'energetic', 'peaceful', 'mystical'] },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'list_presets',
    description: 'Show all available particle presentation presets',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'quick_preset',
    description: 'Instantly show a preset particle animation',
    inputSchema: {
      type: 'object',
      properties: {
        preset: { type: 'string', enum: Object.keys(presets) },
      },
      required: ['preset'],
    },
  },
];

function matchPreset(prompt: string): any {
  const p = prompt.toLowerCase();
  if (p.includes('star') || p.includes('night sky')) return { ...presets.starryNight };
  if (p.includes('ocean') || p.includes('sea') || p.includes('wave')) return { ...presets.ocean };
  if (p.includes('firefl') || p.includes('glow')) return { ...presets.fireflies };
  if (p.includes('cherry') || p.includes('sakura') || p.includes('blossom') || p.includes('petal')) return { ...presets.sakura };
  if (p.includes('snow')) return { ...presets.snow };
  if (p.includes('aurora') || p.includes('northern light')) return { ...presets.aurora };
  if (p.includes('rain')) return { ...presets.rain };
  if (p.includes('bubble')) return { ...presets.bubbles };
  if (p.includes('galaxy') || p.includes('space') || p.includes('cosmos')) return { ...presets.galaxy };
  if (p.includes('zen') || p.includes('sand') || p.includes('garden')) return { ...presets.zen };
  return {
    name: 'Custom Scene',
    background: 'linear-gradient(to bottom, #1a1a2e, #16213e, #0f3460)',
    particles: { count: 100, color: '#ffffff', size: [2, 4], speed: 0.5, type: 'float', glow: true },
  };
}

function handleToolCall(name: string, args: any, baseUrl: string): any {
  switch (name) {
    case 'create_particles': {
      const config = matchPreset(args.prompt);
      const mood = args.mood || 'calm';
      
      if (mood === 'energetic') {
        config.particles.speed *= 2;
        config.particles.count = Math.min(config.particles.count * 1.5, 300);
      } else if (mood === 'peaceful' || mood === 'calm') {
        config.particles.speed *= 0.7;
      } else if (mood === 'dreamy') {
        config.particles.glow = true;
      } else if (mood === 'mystical') {
        config.particles.color = 'rainbow';
        config.particles.glow = true;
      }
      
      config.prompt = args.prompt;
      config.mood = mood;
      
      // Generate inline widget HTML with data embedded
      const widgetWithData = generateWidgetHtml(config);
      
      return {
        content: [
          { type: 'text', text: `✨ Created "${config.name}" for: "${args.prompt}"` },
          { 
            type: 'resource',
            resource: {
              uri: `ui://widget/particles-${Date.now()}.html`,
              mimeType: 'text/html+skybridge',
              text: widgetWithData
            }
          }
        ],
      };
    }
    
    case 'list_presets': {
      const list = Object.entries(presets).map(([k, v]) => `• ${v.name}`).join('\n');
      return {
        content: [{ type: 'text', text: `✨ Available Presets:\n\n${list}` }],
      };
    }
    
    case 'quick_preset': {
      const config = { ...presets[args.preset] || presets.starryNight, prompt: args.preset };
      const widgetWithData = generateWidgetHtml(config);
      
      return {
        content: [
          { type: 'text', text: `✨ Showing ${config.name}` },
          {
            type: 'resource',
            resource: {
              uri: `ui://widget/particles-${Date.now()}.html`,
              mimeType: 'text/html+skybridge',
              text: widgetWithData
            }
          }
        ],
      };
    }
    
    default:
      return { content: [{ type: 'text', text: 'Unknown tool' }], isError: true };
  }
}

function generateWidgetHtml(config: any): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; overflow: hidden; width: 100%; height: 400px; background: ${config.background}; }
    canvas { display: block; width: 100%; height: 100%; }
    .info { position: absolute; bottom: 16px; left: 16px; color: rgba(255,255,255,0.9); font-size: 14px; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }
    .title { font-size: 16px; font-weight: 600; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <div class="info"><div class="title">${config.name}</div></div>
  <script>
    (function(){
      const cfg = ${JSON.stringify(config)};
      const canvas = document.getElementById('c');
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = 400;
      
      const particles = [];
      for(let i = 0; i < cfg.particles.count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: cfg.particles.size[0] + Math.random() * (cfg.particles.size[1] - cfg.particles.size[0]),
          speedX: (Math.random() - 0.5) * cfg.particles.speed,
          speedY: (Math.random() - 0.5) * cfg.particles.speed,
          opacity: 0.3 + Math.random() * 0.7,
          phase: Math.random() * Math.PI * 2
        });
      }
      
      function getColor(p) {
        if(cfg.particles.color === 'rainbow') {
          return 'hsl(' + ((Date.now()/50 + p.phase*100) % 360) + ',80%,60%)';
        }
        if(cfg.particles.color === 'multi') {
          const colors = ['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7'];
          return colors[Math.floor(p.phase * colors.length) % colors.length];
        }
        return cfg.particles.color;
      }
      
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
          const type = cfg.particles.type;
          
          if(type === 'star') {
            p.x += p.speedX * 0.1;
            p.y += p.speedY * 0.1;
            if(cfg.particles.twinkle) p.opacity = 0.3 + Math.abs(Math.sin(Date.now()/1000 + p.phase)) * 0.7;
          } else if(type === 'snow') {
            p.x += Math.sin(Date.now()/2000 + p.phase) * 0.5;
            p.y += cfg.particles.speed * 0.5;
            if(p.y > canvas.height) { p.y = -p.size; p.x = Math.random() * canvas.width; }
          } else if(type === 'rain') {
            p.y += cfg.particles.speed;
            if(p.y > canvas.height) { p.y = -p.size; p.x = Math.random() * canvas.width; }
          } else if(type === 'bubble') {
            p.x += Math.sin(Date.now()/1500 + p.phase) * 0.5;
            p.y -= cfg.particles.speed * 0.3;
            if(p.y < -p.size) { p.y = canvas.height + p.size; p.x = Math.random() * canvas.width; }
          } else if(type === 'petal') {
            p.x += Math.sin(Date.now()/1000 + p.phase);
            p.y += cfg.particles.speed;
            if(p.y > canvas.height) { p.y = -p.size; p.x = Math.random() * canvas.width; }
          } else if(type === 'glow') {
            p.x += Math.sin(Date.now()/2000 + p.phase) * 0.5;
            p.y += Math.cos(Date.now()/2000 + p.phase) * 0.5;
            if(cfg.particles.pulse) p.opacity = 0.2 + Math.abs(Math.sin(Date.now()/500 + p.phase)) * 0.8;
          } else if(type === 'wave') {
            p.x += cfg.particles.speed;
            p.y += Math.sin(Date.now()/1000 + p.phase) * 0.5;
            if(p.x > canvas.width) p.x = -p.size;
          } else if(type === 'aurora') {
            p.x += Math.sin(Date.now()/3000 + p.phase) * 2;
            p.y += Math.cos(Date.now()/4000 + p.phase) * 0.5;
            p.opacity = 0.3 + Math.abs(Math.sin(Date.now()/2000 + p.phase)) * 0.5;
          } else if(type === 'galaxy') {
            const cx = canvas.width/2, cy = canvas.height/2;
            const angle = Math.atan2(p.y - cy, p.x - cx) + cfg.particles.speed * 0.01;
            const dist = Math.sqrt((p.x-cx)**2 + (p.y-cy)**2);
            p.x = cx + Math.cos(angle) * dist;
            p.y = cy + Math.sin(angle) * dist;
          } else {
            p.x += p.speedX;
            p.y += p.speedY;
          }
          
          // Wrap
          if(p.x < -p.size) p.x = canvas.width + p.size;
          if(p.x > canvas.width + p.size) p.x = -p.size;
          if(type !== 'snow' && type !== 'rain' && type !== 'bubble' && type !== 'petal') {
            if(p.y < -p.size) p.y = canvas.height + p.size;
            if(p.y > canvas.height + p.size) p.y = -p.size;
          }
          
          // Draw
          ctx.globalAlpha = p.opacity;
          const color = getColor(p);
          
          if(type === 'rain') {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y + p.size * 3);
            ctx.strokeStyle = color;
            ctx.stroke();
          } else if(type === 'bubble') {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.stroke();
          } else if(type === 'glow' || type === 'aurora') {
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
            g.addColorStop(0, color);
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            if(type === 'star') { ctx.shadowColor = color; ctx.shadowBlur = p.size * 2; }
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
        
        requestAnimationFrame(animate);
      }
      animate();
    })();
  </script>
</body>
</html>`;
}

// Widget HTML (embedded for serverless)
const widgetHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; overflow: hidden; width: 100%; height: 100vh; }
    .container { width: 100%; height: 100%; position: relative; }
    canvas { display: block; width: 100%; height: 100%; }
    .info { position: absolute; bottom: 20px; left: 20px; color: rgba(255,255,255,0.8); font-size: 14px; text-shadow: 0 1px 3px rgba(0,0,0,0.5); z-index: 10; }
    .title { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
    .prompt { font-size: 12px; opacity: 0.7; font-style: italic; }
    .controls { position: absolute; top: 16px; right: 16px; display: flex; gap: 8px; z-index: 10; }
    .btn { background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 12px; transition: all 0.2s; }
    .btn:hover { background: rgba(255,255,255,0.25); }
  </style>
</head>
<body>
  <div class="container">
    <canvas id="canvas"></canvas>
    <div class="info"><div class="title" id="title">Particle Presentation</div><div class="prompt" id="promptText"></div></div>
    <div class="controls"><button class="btn" onclick="togglePause()">⏸️</button><button class="btn" onclick="resetParticles()">🔄</button></div>
  </div>
  <script>
    (function(){const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');let particles=[],config=null,isPaused=false;function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}window.addEventListener('resize',resize);resize();class Particle{constructor(cfg){this.cfg=cfg;this.reset()}reset(){const p=this.cfg.particles;this.x=Math.random()*canvas.width;this.y=Math.random()*canvas.height;this.size=p.size[0]+Math.random()*(p.size[1]-p.size[0]);this.speedX=(Math.random()-0.5)*p.speed;this.speedY=(Math.random()-0.5)*p.speed;this.opacity=0.3+Math.random()*0.7;this.phase=Math.random()*Math.PI*2;this.rotation=Math.random()*360;this.rotationSpeed=(Math.random()-0.5)*2;if(p.type==='rain'||p.type==='snow'){this.y=-this.size;this.speedY=p.speed*(0.5+Math.random()*0.5)}if(p.type==='bubble'){this.y=canvas.height+this.size;this.speedY=-p.speed*(0.3+Math.random()*0.7)}}getColor(){const p=this.cfg.particles;if(p.color==='rainbow'){const hue=(Date.now()/50+this.phase*100)%360;return'hsla('+hue+',80%,60%,'+this.opacity+')'}if(p.color==='multi'){const colors=['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7'];return colors[Math.floor(this.phase*colors.length)%colors.length]}return p.color}update(){const p=this.cfg.particles;switch(p.type){case'star':this.x+=this.speedX*0.1;this.y+=this.speedY*0.1;if(p.twinkle)this.opacity=0.3+Math.abs(Math.sin(Date.now()/1000+this.phase))*0.7;break;case'wave':case'ocean':this.x+=p.speed;this.y+=Math.sin(Date.now()/1000+this.phase)*0.5;if(this.x>canvas.width+this.size)this.x=-this.size;break;case'glow':case'firefly':this.x+=Math.sin(Date.now()/2000+this.phase)*0.5;this.y+=Math.cos(Date.now()/2000+this.phase*1.5)*0.5;if(p.pulse)this.opacity=0.2+Math.abs(Math.sin(Date.now()/500+this.phase))*0.8;break;case'petal':case'sakura':this.x+=Math.sin(Date.now()/1000+this.phase);this.y+=p.speed;if(p.rotate)this.rotation+=this.rotationSpeed;if(this.y>canvas.height+this.size){this.y=-this.size;this.x=Math.random()*canvas.width}break;case'snow':this.x+=Math.sin(Date.now()/2000+this.phase)*(p.drift?1:0.3);this.y+=this.speedY;if(this.y>canvas.height+this.size){this.y=-this.size;this.x=Math.random()*canvas.width}break;case'rain':this.x+=p.streak?0.5:0;this.y+=this.speedY;if(this.y>canvas.height+this.size){this.y=-this.size;this.x=Math.random()*canvas.width}break;case'bubble':this.x+=Math.sin(Date.now()/1500+this.phase)*0.5;this.y+=this.speedY;if(this.y<-this.size){this.y=canvas.height+this.size;this.x=Math.random()*canvas.width}break;case'aurora':this.x+=Math.sin(Date.now()/3000+this.phase)*2;this.y+=Math.cos(Date.now()/4000+this.phase)*0.5;this.opacity=0.3+Math.abs(Math.sin(Date.now()/2000+this.phase))*0.5;break;case'galaxy':const cx=canvas.width/2,cy=canvas.height/2;const angle=Math.atan2(this.y-cy,this.x-cx);const dist=Math.sqrt((this.x-cx)**2+(this.y-cy)**2);const newAngle=angle+p.speed*0.01;this.x=cx+Math.cos(newAngle)*dist;this.y=cy+Math.sin(newAngle)*dist;break;default:this.x+=this.speedX;this.y+=this.speedY;if(p.glow)this.opacity=0.4+Math.abs(Math.sin(Date.now()/1000+this.phase))*0.6}if(p.type!=='rain'&&p.type!=='snow'&&p.type!=='bubble'&&p.type!=='petal'){if(this.x<-this.size)this.x=canvas.width+this.size;if(this.x>canvas.width+this.size)this.x=-this.size;if(this.y<-this.size)this.y=canvas.height+this.size;if(this.y>canvas.height+this.size)this.y=-this.size}}draw(){const p=this.cfg.particles,color=this.getColor();ctx.save();ctx.globalAlpha=this.opacity;if(p.rotate){ctx.translate(this.x,this.y);ctx.rotate(this.rotation*Math.PI/180);ctx.translate(-this.x,-this.y)}switch(p.type){case'star':ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=this.size*2;ctx.fill();break;case'petal':case'sakura':ctx.beginPath();ctx.ellipse(this.x,this.y,this.size,this.size/2,this.rotation*Math.PI/180,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();break;case'rain':ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.x+1,this.y+this.size*3);ctx.strokeStyle=color;ctx.lineWidth=1;ctx.stroke();break;case'bubble':ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.strokeStyle=color;ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.arc(this.x-this.size*0.3,this.y-this.size*0.3,this.size*0.2,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.6)';ctx.fill();break;case'glow':case'firefly':case'aurora':const gradient=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.size*3);gradient.addColorStop(0,color);gradient.addColorStop(1,'transparent');ctx.beginPath();ctx.arc(this.x,this.y,this.size*3,0,Math.PI*2);ctx.fillStyle=gradient;ctx.fill();break;default:ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}ctx.restore()}}function initParticles(){particles=[];if(!config)return;for(let i=0;i<config.particles.count;i++)particles.push(new Particle(config))}function animate(){if(!isPaused){ctx.clearRect(0,0,canvas.width,canvas.height);particles.forEach(p=>{p.update();p.draw()})}requestAnimationFrame(animate)}window.togglePause=function(){isPaused=!isPaused};window.resetParticles=initParticles;function init(data){config=data;document.body.style.background=data.background;document.getElementById('title').textContent=data.name||'Particles';document.getElementById('promptText').textContent=data.prompt?'"'+data.prompt+'"':'';initParticles();animate()}if(window.openai&&window.openai.toolOutput){init(window.openai.toolOutput)}else{init({name:'Starry Night',background:'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',particles:{count:150,color:'#ffffff',size:[1,3],speed:0.3,type:'star',twinkle:true},prompt:'starry night'})}})();
  </script>
</body>
</html>`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, mcp-session-id');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle MCP JSON-RPC requests
  if (req.method === 'POST') {
    const body = req.body;
    
    // Handle different MCP methods
    switch (body.method) {
      case 'initialize':
        return res.json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {}, resources: {} },
            serverInfo: { name: 'particle-presentations', version: '1.0.0' },
          },
        });

      case 'tools/list':
        return res.json({
          jsonrpc: '2.0',
          id: body.id,
          result: { tools },
        });

      case 'tools/call':
        const result = handleToolCall(body.params.name, body.params.arguments || {}, '');
        return res.json({
          jsonrpc: '2.0',
          id: body.id,
          result,
        });

      case 'resources/list':
        return res.json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            resources: [{
              uri: 'ui://widget/particles.html',
              name: 'Particle Widget',
              mimeType: 'text/html+skybridge',
            }],
          },
        });

      case 'resources/read':
        return res.json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            contents: [{
              uri: 'ui://widget/particles.html',
              mimeType: 'text/html+skybridge',
              text: widgetHtml,
            }],
          },
        });

      default:
        return res.json({
          jsonrpc: '2.0',
          id: body.id,
          error: { code: -32601, message: 'Method not found' },
        });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
