// Bruit simplex 3D — Ashima Arts / Stefan Gustavson (MIT)
export const SNOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

/* ---------------- Particules ---------------- */

export const particleVertex = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uChaos;
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uMouse;
uniform float uMouseRadius;
attribute vec3 aFrom;
attribute vec3 aTo;
attribute vec4 aRand;
varying float vAlpha;
varying float vMix;
varying float vHot;
${SNOISE}

float easeInOutCubic(float t){
  return t < 0.5 ? 4.0*t*t*t : 1.0 - pow(-2.0*t + 2.0, 3.0) / 2.0;
}

void main(){
  // Chaque particule part avec un léger décalage : la forme se défait en vague
  float delay = aRand.w * 0.4;
  float lp = clamp((uProgress - delay) / 0.6, 0.0, 1.0);
  float e = easeInOutCubic(lp);
  vec3 pos = mix(aFrom, aTo, e);

  // Au milieu du trajet, les particules s'envolent dans un courant de bruit
  float flight = sin(3.14159265 * lp);
  vec3 q = pos * 0.45 + aRand.xyz * 2.0;
  vec3 drift = vec3(
    snoise(q + vec3(0.0, uTime * 0.12, 0.0)),
    snoise(q + vec3(13.7, 0.0, uTime * 0.12)),
    snoise(q + vec3(uTime * 0.12, 27.1, 0.0))
  );
  pos += drift * (flight * (0.9 + aRand.x * 1.8) * uChaos + 0.035 + 0.03 * aRand.y);

  vec4 world = modelMatrix * vec4(pos, 1.0);

  // Le curseur repousse les particules
  vec3 dir = world.xyz - uMouse;
  float d = length(dir.xy);
  float push = smoothstep(uMouseRadius, 0.0, d);
  world.xyz += normalize(dir + vec3(0.0001)) * push * 0.55;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;

  float size = uSize * (0.35 + aRand.y * aRand.y * 1.3);
  gl_PointSize = size * uPixelRatio * (10.0 / -mv.z);

  vHot = step(0.965, aRand.z);
  vMix = clamp(aRand.y * 0.75 + (pos.y + 2.4) / 9.0, 0.0, 1.0);
  float twinkle = 0.65 + 0.35 * sin(uTime * (1.2 + aRand.x * 2.5) + aRand.z * 6.2831);
  vAlpha = twinkle * (0.55 + 0.45 * aRand.x) + push * 0.6 + flight * 0.25;
}
`;

export const particleFragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
varying float vAlpha;
varying float vMix;
varying float vHot;

void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float core = smoothstep(0.5, 0.0, d);
  core = pow(core, 1.7);
  vec3 col = mix(uColorA, uColorB, vMix);
  col = mix(col, vec3(1.0, 0.97, 0.92), vHot * 0.7);
  gl_FragColor = vec4(col, core * vAlpha * uOpacity);
}
`;

/* ---------------- Fond texturé plein écran ---------------- */

export const bgVertex = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export const bgFragment = /* glsl */ `
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uInk;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uSide;
uniform float uGlow;
varying vec2 vUv;
${SNOISE}

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main(){
  vec2 p = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 q = vec2((p.x - 0.5) * aspect, p.y - 0.5);

  // Deux nappes de couleur qui dérivent du côté des particules
  vec2 c1 = vec2(uSide * 0.42 * aspect + sin(uTime * 0.11) * 0.18, 0.05 + cos(uTime * 0.13) * 0.12);
  vec2 c2 = vec2(uSide * 0.1 * aspect - 0.35 + cos(uTime * 0.09) * 0.25, -0.38 + sin(uTime * 0.07) * 0.1);
  float warp = snoise(vec3(q * 1.4, uTime * 0.04)) * 0.18;
  float g1 = smoothstep(0.95, 0.0, length(q - c1) + warp);
  float g2 = smoothstep(0.85, 0.0, length(q - c2) - warp);

  vec3 col = uInk;
  col += uColorA * g1 * g1 * 0.42 * uGlow;
  col += uColorB * g2 * g2 * 0.26 * uGlow;

  // Texture « papier » : fibres basse fréquence + grain fin animé
  float fiber = snoise(vec3(q.x * 9.0, q.y * 2.2, 1.7)) * 0.5 + snoise(vec3(q * 34.0, 3.1)) * 0.5;
  col *= 0.94 + fiber * 0.06;
  float grain = hash(floor(gl_FragCoord.xy) + floor(uTime * 18.0) * 7.31);
  col += (grain - 0.5) * 0.05;

  // Vignette
  col *= 1.0 - smoothstep(0.55, 1.15, length(q * vec2(0.8, 1.0)));

  gl_FragColor = vec4(col, 1.0);
}
`;
