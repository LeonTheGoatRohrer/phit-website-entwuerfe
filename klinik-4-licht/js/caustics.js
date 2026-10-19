/* P.H.I.T – Klinik 4 „Licht“
   Wasser-Kaustiken als eigener WebGL-Fragment-Shader (Vanilla, ohne Bibliothek).
   - nur Desktop/Tablet (>= 768 px) und ohne prefers-reduced-motion; sonst bleibt das Standbild
   - reduzierte Auflösung (DPR <= 1.5, Renderfaktor 0.6), ~30 fps
   - pausiert außerhalb des Viewports und bei document.hidden */
(function () {
  'use strict';
  var canvas = document.querySelector('[data-caustics]');
  if (!canvas) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var wide = window.matchMedia('(min-width: 768px)');
  if (reduce.matches || !wide.matches) return;

  function init() {
  var gl;
  try {
    gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true, preserveDrawingBuffer: false, powerPreference: 'low-power' });
  } catch (e) { gl = null; }
  if (!gl) return;
  // Software-Rendering (kein GPU) → Standbild behalten, statt CPU zu belasten
  var dbg = gl.getExtension('WEBGL_debug_renderer_info');
  var renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
  if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return;

  var VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  var FRAG = [
    'precision mediump float;',
    'uniform vec2 uRes;uniform float uTime;uniform float uAmp;',
    'vec2 h2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}',
    // Abstand zur nächsten Zellkante (F2 - F1) – ergibt das typische Lichtnetz
    'float net(vec2 p,float t){',
    '  vec2 n=floor(p),f=fract(p);float d1=8.,d2=8.;',
    '  for(int j=-1;j<=1;j++){for(int i=-1;i<=1;i++){',
    '    vec2 g=vec2(float(i),float(j));vec2 o=h2(n+g);',
    '    o=.5+.42*sin(vec2(t,t*.83)+6.2831*o);',
    '    vec2 r=g+o-f;float d=dot(r,r);',
    '    if(d<d1){d2=d1;d1=d;}else if(d<d2){d2=d;}',
    '  }}',
    '  return sqrt(d2)-sqrt(d1);',
    '}',
    'void main(){',
    '  vec2 q=gl_FragCoord.xy/uRes;',
    '  vec2 p=gl_FragCoord.xy/uRes.y*6.2;',
    '  float t=uTime;',
    '  p+=.22*vec2(sin(p.y*1.3+t*.6),cos(p.x*1.1-t*.5));',
    '  float e1=net(p,t*.55);',
    '  float e2=net(p+vec2(.15*sin(p.y+t*.3),.15*cos(p.x-t*.4))+3.7,t*.7+1.7);',
    '  float l1=pow(1.-smoothstep(0.,.075,e1),2.);',
    '  float l2=pow(1.-smoothstep(0.,.13,e2),2.);',
    '  float c=clamp(l1*.75+l2*.45+l1*l2*.6,0.,1.);',
    // unten weich auslaufen, links (Text) zurückhaltender
    '  float m=smoothstep(.02,.5,q.y)*(.32+.68*smoothstep(.2,.9,q.x));',
    '  float a=c*m*uAmp;',
    '  vec3 col=mix(vec3(.47,.81,.91),vec3(.62,.9,.97),l1*l2);',
    '  gl_FragColor=vec4(col*a,a);',
    '}'
  ].join('\n');

  function shader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
    return s;
  }
  var vs = shader(gl.VERTEX_SHADER, VERT);
  var fs = shader(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var uRes = gl.getUniformLocation(prog, 'uRes');
  var uTime = gl.getUniformLocation(prog, 'uTime');
  var uAmp = gl.getUniformLocation(prog, 'uAmp');
  gl.uniform1f(uAmp, 0.42);
  gl.clearColor(0, 0, 0, 0);

  var host = canvas.parentElement;
  var RENDER_SCALE = 0.75;
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = Math.max(1, Math.round(canvas.clientWidth * dpr * RENDER_SCALE));
    var h = Math.max(1, Math.round(canvas.clientHeight * dpr * RENDER_SCALE));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    }
  }

  var visible = true, raf = 0, last = 0, clock = 0, started = false, lost = false;
  var FRAME = 1000 / 30;
  var SPEED = 0.00032; // sehr langsam
  var seed = 12.0 + Math.random() * 40.0;

  function draw(now) {
    raf = 0;
    if (!running()) return;
    raf = requestAnimationFrame(draw);
    if (last && now - last < FRAME) return;
    var dt = last ? Math.min(now - last, 100) : FRAME;
    last = now;
    clock += dt;
    resize();
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime, seed + clock * SPEED);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!started) { started = true; host.classList.add('is-live'); }
  }
  function running() { return visible && !document.hidden && !lost; }
  function kick() { if (!raf && running()) { last = 0; raf = requestAnimationFrame(draw); } }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      kick();
    }, { rootMargin: '80px 0px' }).observe(canvas);
  }
  document.addEventListener('visibilitychange', kick);
  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); lost = true; host.classList.remove('is-live'); });
  reduce.addEventListener && reduce.addEventListener('change', function (e) { if (e.matches) { lost = true; host.classList.remove('is-live'); } });
  window.addEventListener('resize', function () { if (!wide.matches) { lost = true; host.classList.remove('is-live'); } }, { passive: true });

  kick();
  }
  // erst nach dem Laden und im Leerlauf initialisieren – der Shader belastet den kritischen Pfad nicht
  function start() { setTimeout(function () { (window.requestIdleCallback || function (f) { setTimeout(f, 50); })(init, { timeout: 1500 }); }, 600); }
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });
})();
