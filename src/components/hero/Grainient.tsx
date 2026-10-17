import React, { useEffect, useRef } from 'react';
import './Grainient.css';

export default function Grainient({
  colors = ['#120f17', '#2a0f0a', '#9a3412', '#f97316', '#fed7aa'],
  type = 'linear',
  angle = 55,
  bands = 1,
  speed = 1,
  flow = 0.8,
  scale = 1,
  softness = 1,
  silk = 0.35,
  grainAmount = 0.08,
  grainSize = 1.2,
  grainAnimated = true,
  contrast = 1,
  saturation = 1,
  variation = 0,
  interactive = true,
  stir = 1,
  clickSwirl = true,
  intro = true,
  lightMode = false,
  className = '',
  style,
  ...rest
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'grainient-canvas';
    container.appendChild(canvas);

    // WebGL2 context
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl) return;

    // PENDOOROOTS green colors
    const pendooColors = ['#0a2e0a', '#1b5e20', '#2e7d32', '#4caf50', '#ccff00'];

    // Shader sources (simplified - just the field shader)
    const vertSrc = `#version 300 es
    in vec2 position;
    void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

    const fragSrc = `#version 300 es
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;
    uniform vec3 uColor1, uColor2, uColor3;
    out vec4 fragColor;
    #define S(a,b,t) smoothstep(a,b,t)
    mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
    vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);return 0.5+0.5*mix(mix(dot(-1.0+2.0*hash(i),f),dot(-1.0+2.0*hash(i+vec2(1,0)),f-vec2(1,0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0,1)),f-vec2(0,1)),dot(-1.0+2.0*hash(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);}
    void mainImage(out vec4 o,vec2 C){
      float t=iTime*0.25;vec2 uv=C/iResolution.xy;float ratio=iResolution.x/iResolution.y;vec2 tuv=uv-0.5;tuv/=max(0.85,0.001);
      float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*2.0);tuv.y*=1.0/ratio;tuv*=Rot(radians((degree-0.5)*400.0+180.0));tuv.y*=ratio;
      float warpTime=t*1.8;tuv.x+=sin(tuv.y*4.5+warpTime)/60.0;tuv.y+=sin(tuv.x*6.75+warpTime)/30.0;
      float b=0.02;float s=0.08;mat2 blendRot=Rot(radians(15.0));float blendX=(tuv*blendRot).x;
      float edge0=-0.3-b-s;float edge1=0.2-b+s;float v0=0.5-b+s;float v1=-0.3-b-s;
      vec3 layer1=mix(uColor3,uColor2,S(edge0,edge1,blendX));vec3 layer2=mix(uColor2,uColor1,S(edge0,edge1,blendX));
      vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));vec2 grainUv=uv*10.0;float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
      col+=(grain-0.5)*0.22;col=(col-0.5)*1.6+0.5;float luma=dot(col,vec3(0.2126,0.7152,0.0722));col=mix(vec3(luma),col,2.0);
      col=pow(max(col,0.0),vec3(0.95));col=clamp(col,0.0,1.0);o=vec4(col,1.0);
    }
    void main(){vec4 o=vec4(0.0);mainImage(o,gl_FragCoord.xy);fragColor=o;}`;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; }
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, vertSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'iResolution');
    const uTime = gl.getUniformLocation(prog, 'iTime');
    const uC1 = gl.getUniformLocation(prog, 'uColor1');
    const uC2 = gl.getUniformLocation(prog, 'uColor2');
    const uC3 = gl.getUniformLocation(prog, 'uColor3');

    gl.uniform3fv(uC1, [0.8, 1.0, 0.0]); // lime
    gl.uniform3fv(uC2, [0.0, 0.294, 0.110]); // deep green
    gl.uniform3fv(uC3, [0.0, 0.122, 0.043]); // darkest

    function resize() {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }

    const t0 = performance.now();
    let raf = 0;

    function frame(t) {
      gl.uniform1f(uTime, (t - t0) * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resize);
    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  }, []);

  return (
    <div ref={containerRef} className={`grainient-container ${className}`} style={style} {...rest}>
    </div>
  );
}
