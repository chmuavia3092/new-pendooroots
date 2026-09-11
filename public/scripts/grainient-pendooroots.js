// Grainient — PENDOOROOTS variant
// Vanilla WebGL2 port of React Bits Grainient component
// Colors: bright lime → deep forest green → darkest green

(function () {
  'use strict';

  const VERTEX = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

  const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uLightMode;
out vec4 fragColor;

#define S(a,b,t) smoothstep(a,b,t)

mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}

vec2 hash(vec2 p){
  p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));
  return fract(sin(p)*43758.5453);
}

float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
  float n=mix(
    mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),
        dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),
    mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),
        dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),
    u.y);
  return 0.5+0.5*n;
}

void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);

  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;

  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);

  vec3 colLav=uColor1;
  vec3 colOrg=uColor2;
  vec3 colDark=uColor3;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));

  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;

  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);

  if(uLightMode>0.5){
    float energy=max(max(col.r,col.g),col.b);
    vec3 hue=col/max(energy,0.001);
    float chroma=length(col-vec3(dot(col,vec3(0.333333))));
    float coverage=clamp(0.12+chroma*1.15+energy*0.18,0.0,0.88);
    col=mix(vec3(1.0),clamp(hue*0.58+col*0.18,0.0,1.0),coverage);
  }

  o=vec4(col,1.0);
}

void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}`;

  function hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!r) return [1, 1, 1];
    return [parseInt(r[1], 16) / 255, parseInt(r[2], 16) / 255, parseInt(r[3], 16) / 255];
  }

  function createGrainient(container) {
    if (!container || container._grainient) return;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl2', { alpha: true, antialias: false });
    if (!gl) { console.warn('Grainient: WebGL2 not supported'); return; }

    // Compile shaders
    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Grainient shader error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Grainient link error:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Full-screen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const u = {};
    ['iTime', 'iResolution', 'uTimeSpeed', 'uColorBalance', 'uWarpStrength',
     'uWarpFrequency', 'uWarpSpeed', 'uWarpAmplitude', 'uBlendAngle', 'uBlendSoftness',
     'uRotationAmount', 'uNoiseScale', 'uGrainAmount', 'uGrainScale', 'uGrainAnimated',
     'uContrast', 'uGamma', 'uSaturation', 'uCenterOffset', 'uZoom',
     'uColor1', 'uColor2', 'uColor3', 'uLightMode'
    ].forEach(name => { u[name] = gl.getUniformLocation(prog, name); });

    // State
    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const t0 = performance.now();

    // Config (will be set from data attributes or defaults)
    const config = {
      color1: '#ccff00',
      color2: '#004b1c',
      color3: '#002e11',
      timeSpeed: 0.25,
      colorBalance: 0.0,
      warpStrength: 1.0,
      warpFrequency: 5.0,
      warpSpeed: 2.0,
      warpAmplitude: 50.0,
      blendAngle: 0.0,
      blendSoftness: 0.05,
      rotationAmount: 500.0,
      noiseScale: 2.0,
      grainAmount: 0.18,
      grainScale: 8.0,
      grainAnimated: false,
      contrast: 1.5,
      gamma: 1.0,
      saturation: 1.8,
      centerX: 0.0,
      centerY: 0.0,
      zoom: 0.9,
      lightMode: false
    };

    // Read data attributes if present
    if (container.dataset.color1) config.color1 = container.dataset.color1;
    if (container.dataset.color2) config.color2 = container.dataset.color2;
    if (container.dataset.color3) config.color3 = container.dataset.color3;
    if (container.dataset.timeSpeed) config.timeSpeed = parseFloat(container.dataset.timeSpeed);
    if (container.dataset.colorBalance) config.colorBalance = parseFloat(container.dataset.colorBalance);
    if (container.dataset.warpStrength) config.warpStrength = parseFloat(container.dataset.warpStrength);
    if (container.dataset.warpFrequency) config.warpFrequency = parseFloat(container.dataset.warpFrequency);
    if (container.dataset.warpSpeed) config.warpSpeed = parseFloat(container.dataset.warpSpeed);
    if (container.dataset.warpAmplitude) config.warpAmplitude = parseFloat(container.dataset.warpAmplitude);
    if (container.dataset.blendAngle) config.blendAngle = parseFloat(container.dataset.blendAngle);
    if (container.dataset.blendSoftness) config.blendSoftness = parseFloat(container.dataset.blendSoftness);
    if (container.dataset.rotationAmount) config.rotationAmount = parseFloat(container.dataset.rotationAmount);
    if (container.dataset.noiseScale) config.noiseScale = parseFloat(container.dataset.noiseScale);
    if (container.dataset.grainAmount) config.grainAmount = parseFloat(container.dataset.grainAmount);
    if (container.dataset.grainScale) config.grainScale = parseFloat(container.dataset.grainScale);
    if (container.dataset.grainAnimated) config.grainAnimated = container.dataset.grainAnimated === 'true';
    if (container.dataset.contrast) config.contrast = parseFloat(container.dataset.contrast);
    if (container.dataset.gamma) config.gamma = parseFloat(container.dataset.gamma);
    if (container.dataset.saturation) config.saturation = parseFloat(container.dataset.saturation);
    if (container.dataset.centerX) config.centerX = parseFloat(container.dataset.centerX);
    if (container.dataset.centerY) config.centerY = parseFloat(container.dataset.centerY);
    if (container.dataset.zoom) config.zoom = parseFloat(container.dataset.zoom);
    if (container.dataset.lightMode) config.lightMode = container.dataset.lightMode === 'true';

    function setUniforms() {
      gl.uniform1f(u.uTimeSpeed, config.timeSpeed);
      gl.uniform1f(u.uColorBalance, config.colorBalance);
      gl.uniform1f(u.uWarpStrength, config.warpStrength);
      gl.uniform1f(u.uWarpFrequency, config.warpFrequency);
      gl.uniform1f(u.uWarpSpeed, config.warpSpeed);
      gl.uniform1f(u.uWarpAmplitude, config.warpAmplitude);
      gl.uniform1f(u.uBlendAngle, config.blendAngle);
      gl.uniform1f(u.uBlendSoftness, config.blendSoftness);
      gl.uniform1f(u.uRotationAmount, config.rotationAmount);
      gl.uniform1f(u.uNoiseScale, config.noiseScale);
      gl.uniform1f(u.uGrainAmount, config.grainAmount);
      gl.uniform1f(u.uGrainScale, config.grainScale);
      gl.uniform1f(u.uGrainAnimated, config.grainAnimated ? 1.0 : 0.0);
      gl.uniform1f(u.uContrast, config.contrast);
      gl.uniform1f(u.uGamma, config.gamma);
      gl.uniform1f(u.uSaturation, config.saturation);
      gl.uniform2f(u.uCenterOffset, config.centerX, config.centerY);
      gl.uniform1f(u.uZoom, config.zoom);
      gl.uniform3fv(u.uColor1, hexToRgb(config.color1));
      gl.uniform3fv(u.uColor2, hexToRgb(config.color2));
      gl.uniform3fv(u.uColor3, hexToRgb(config.color3));
      gl.uniform1f(u.uLightMode, config.lightMode ? 1.0 : 0.0);
    }

    function resize() {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.iResolution, canvas.width, canvas.height);
    }

    function render(t) {
      gl.uniform1f(u.iTime, (t - t0) * 0.001);
      setUniforms();
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function loop(t) {
      render(t);
      raf = requestAnimationFrame(loop);
    }

    function tryStart() {
      if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
    }

    function tryStop() {
      if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; }
    }

    // ResizeObserver
    const ro = new ResizeObserver(() => { resize(); });
    ro.observe(container);
    resize();

    // IntersectionObserver — pause when offscreen
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      isVisible ? tryStart() : tryStop();
    }, { threshold: 0 });
    io.observe(container);

    // Visibility change — pause when tab hidden
    const onVis = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener('visibilitychange', onVis);

    tryStart();

    // Store reference for cleanup
    container._grainient = {
      destroy() {
        tryStop();
        ro.disconnect();
        io.disconnect();
        document.removeEventListener('visibilitychange', onVis);
        try { container.removeChild(canvas); } catch (e) {}
        delete container._grainient;
      },
      updateConfig(newConfig) {
        Object.assign(config, newConfig);
      }
    };
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  function initAll() {
    document.querySelectorAll('[data-grainient]').forEach(el => {
      createGrainient(el);
    });
  }

  // Expose for manual init
  window.Grainient = { init: createGrainient };
})();
