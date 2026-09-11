// Grainient — PENDOOROOTS green theme
// Exact port of React Grainient component with green colors
(function() {
  var c = document.getElementById('heroGrainient');
  if (!c) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var hex = function(h) {
    var r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    if (!r) return [1,1,1];
    return [parseInt(r[1],16)/255, parseInt(r[2],16)/255, parseInt(r[3],16)/255];
  };

  var vs = '#version 300 es\nin vec2 position;\nvoid main(){gl_Position=vec4(position,0.0,1.0);}';

  var fs = '#version 300 es\nprecision highp float;\nuniform vec2 iResolution;\nuniform float iTime;\nuniform float uTimeSpeed;\nuniform float uColorBalance;\nuniform float uWarpStrength;\nuniform float uWarpFrequency;\nuniform float uWarpSpeed;\nuniform float uWarpAmplitude;\nuniform float uBlendAngle;\nuniform float uBlendSoftness;\nuniform float uRotationAmount;\nuniform float uNoiseScale;\nuniform float uGrainAmount;\nuniform float uGrainScale;\nuniform float uGrainAnimated;\nuniform float uContrast;\nuniform float uGamma;\nuniform float uSaturation;\nuniform vec2 uCenterOffset;\nuniform float uZoom;\nuniform vec3 uColor1;\nuniform vec3 uColor2;\nuniform vec3 uColor3;\nuniform float uLightMode;\nout vec4 fragColor;\n#define S(a,b,t) smoothstep(a,b,t)\nmat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}\nvec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}\nfloat noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}\nvoid mainImage(out vec4 o,vec2 C){float t=iTime*uTimeSpeed;vec2 uv=C/iResolution.xy;float ratio=iResolution.x/iResolution.y;vec2 tuv=uv-0.5+uCenterOffset;tuv/=max(uZoom,0.001);float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);tuv.y*=1.0/ratio;tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));tuv.y*=ratio;float frequency=uWarpFrequency;float ws=max(uWarpStrength,0.001);float amplitude=uWarpAmplitude/ws;float warpTime=t*uWarpSpeed;tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);vec3 colLav=uColor1;vec3 colOrg=uColor2;vec3 colDark=uColor3;float b=uColorBalance;float s=max(uBlendSoftness,0.0);mat2 blendRot=Rot(radians(uBlendAngle));float blendX=(tuv*blendRot).x;float edge0=-0.3-b-s;float edge1=0.2-b+s;float v0=0.5-b+s;float v1=-0.3-b-s;vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));vec2 grainUv=uv*max(uGrainScale,0.001);if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);col+=(grain-0.5)*uGrainAmount;col=(col-0.5)*uContrast+0.5;float luma=dot(col,vec3(0.2126,0.7152,0.0722));col=mix(vec3(luma),col,uSaturation);col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));col=clamp(col,0.0,1.0);if(uLightMode>0.5){float energy=max(max(col.r,col.g),col.b);vec3 hue=col/max(energy,0.001);float chroma=length(col-vec3(dot(col,vec3(0.333333))));float coverage=clamp(0.12+chroma*1.15+energy*0.18,0.0,0.88);col=mix(vec3(1.0),clamp(hue*0.58+col*0.18,0.0,1.0),coverage);}o=vec4(col,1.0);}\nvoid main(){vec4 o=vec4(0.0);mainImage(o,gl_FragCoord.xy);fragColor=o;}';

  var gl = c.getContext('webgl2');
  if (!gl) return;

  function mk(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; }
    return s;
  }

  var v = mk(gl.VERTEX_SHADER, vs);
  var f = mk(gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return;

  var p = gl.createProgram();
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return;
  gl.useProgram(p);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  var pos = gl.getAttribLocation(p, 'position');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  var u = function(n) { return gl.getUniformLocation(p, n); };
  var uRes = u('iResolution');
  var uTime = u('iTime');
  var uTS = u('uTimeSpeed');
  var uCB = u('uColorBalance');
  var uWS = u('uWarpStrength');
  var uWF = u('uWarpFrequency');
  var uWSp = u('uWarpSpeed');
  var uWA = u('uWarpAmplitude');
  var uBA = u('uBlendAngle');
  var uBS = u('uBlendSoftness');
  var uRA = u('uRotationAmount');
  var uNS = u('uNoiseScale');
  var uGA = u('uGrainAmount');
  var uGS = u('uGrainScale');
  var uGAn = u('uGrainAnimated');
  var uCo = u('uContrast');
  var uGa = u('uGamma');
  var uSa = u('uSaturation');
  var uCO = u('uCenterOffset');
  var uZ = u('uZoom');
  var uC1 = u('uColor1');
  var uC2 = u('uColor2');
  var uC3 = u('uColor3');
  var uLM = u('uLightMode');

  gl.uniform1f(uTS, 0.25);
  gl.uniform1f(uCB, 0.0);
  gl.uniform1f(uWS, 1.0);
  gl.uniform1f(uWF, 5.0);
  gl.uniform1f(uWSp, 2.0);
  gl.uniform1f(uWA, 50.0);
  gl.uniform1f(uBA, 0.0);
  gl.uniform1f(uBS, 0.05);
  gl.uniform1f(uRA, 500.0);
  gl.uniform1f(uNS, 2.0);
  gl.uniform1f(uGA, 0.25);
  gl.uniform1f(uGS, 2.0);
  gl.uniform1f(uGAn, 0.0);
  gl.uniform1f(uCo, 1.5);
  gl.uniform1f(uGa, 1.0);
  gl.uniform1f(uSa, 1.0);
  gl.uniform2f(uCO, 0.0, 0.0);
  gl.uniform1f(uZ, 0.9);
  gl.uniform3fv(uC1, hex('#ccff00'));
  gl.uniform3fv(uC2, hex('#004b1c'));
  gl.uniform3fv(uC3, hex('#002e11'));
  gl.uniform1f(uLM, 0.0);

  var canvas = gl.canvas;
  canvas.style.cssText = 'width:100%;height:100%;display:block;position:absolute;top:0;left:0;';
  c.appendChild(canvas);

  var t0 = performance.now();
  var raf = 0;
  var vis = true;
  var pageVis = !document.hidden;

  function frame(t) {
    gl.uniform1f(uTime, (t - t0) * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(frame);
  }
  function start() { if (vis && pageVis && raf === 0) raf = requestAnimationFrame(frame); }
  function stop() { if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; } }

  function resize() {
    var r = c.getBoundingClientRect();
    var w = Math.max(1, Math.floor(r.width));
    var h = Math.max(1, Math.floor(r.height));
    var d = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * d);
    canvas.height = Math.floor(h * d);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  new ResizeObserver(resize).observe(c);
  resize();

  new IntersectionObserver(function(e) {
    vis = e[0].isIntersecting;
    vis ? start() : stop();
  }, { threshold: 0 }).observe(c);

  document.addEventListener('visibilitychange', function() {
    pageVis = !document.hidden;
    pageVis ? start() : stop();
  });

  start();
})();
