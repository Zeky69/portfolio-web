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
uniform float uPixelRatio;
uniform float uOpacity;
uniform vec3 uColorA;    // palette de la section courante
uniform vec3 uColorB;
attribute vec3 aFrom;
attribute vec3 aTo;
attribute vec4 aRand;
attribute vec3 aColor;   // teinte d'étoile : blanc froid, bleu pâle ou pêche
attribute float aMag;    // magnitude 0..1 : la plupart sont faibles, quelques-unes brillent
attribute vec2 aOffset;  // déplacement (NDC) laissé par le passage du curseur
varying vec3 vColor;
varying float vBright;
varying float vDiameter;
varying float vSpike;
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
  pos += drift * (flight * (0.9 + aRand.x * 1.8) * uChaos + 0.02 + 0.02 * aRand.y);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  // Sillage du curseur : chaque étoile garde son élan puis revient à sa place
  gl_Position.xy += aOffset * gl_Position.w;
  float stir = clamp(length(aOffset) * 12.0, 0.0, 1.0);

  // Étoiles fines : 1 à 4 px, la profondeur ne fait varier la taille que légèrement
  float depth = clamp(10.0 / -mv.z, 0.75, 1.35);
  float diameter = uPixelRatio * (1.0 + aMag * aMag * 2.6) * depth * (1.0 + stir * 0.25);
  vDiameter = diameter;
  vSpike = smoothstep(0.86, 1.0, aMag);
  // La place autour du cœur sert au petit halo et aux aigrettes des plus brillantes
  gl_PointSize = max(diameter * mix(2.6, 6.0, vSpike), 4.0);

  float twinkle = 0.92 + 0.08 * sin(uTime * (0.8 + aRand.x * 1.6) + aRand.z * 6.2831);
  vBright = (0.17 + aMag * 1.05 + stir * 0.35) * twinkle * uOpacity;
  // Thème de section : ~60 % des étoiles prennent une teinte pastel de la palette,
  // les autres gardent leur blanc/bleu/pêche naturel
  vec3 sectionTint = mix(uColorA, uColorB, step(0.5, fract(aRand.z * 3.7)));
  sectionTint = mix(sectionTint, vec3(1.0), 0.32);
  float tinted = mix(0.2, 0.9, step(0.4, fract(aRand.x * 7.13)));
  vColor = mix(aColor, sectionTint, tinted);
}
`;

export const particleFragment = /* glsl */ `
varying vec3 vColor;
varying float vBright;
varying float vDiameter;
varying float vSpike;

void main(){
  vec2 px = (gl_PointCoord - 0.5) * (vDiameter * mix(2.6, 6.0, vSpike));
  float r = length(px);
  float rad = vDiameter * 0.5;

  // Cœur net (bord lissé sur un seul pixel) + halo très court
  float core = 1.0 - smoothstep(rad - 0.5, rad + 0.5, r);
  float halo = pow(max(1.0 - r / (rad * 2.6 + 1.0), 0.0), 3.0) * 0.28;

  // Aigrettes fines en croix sur les étoiles les plus brillantes
  float len = vDiameter * 3.0;
  float spikes = (
    (1.0 - smoothstep(0.0, 0.7, abs(px.y))) * (1.0 - smoothstep(0.0, len, abs(px.x))) +
    (1.0 - smoothstep(0.0, 0.7, abs(px.x))) * (1.0 - smoothstep(0.0, len, abs(px.y)))
  ) * 0.45 * vSpike;

  float light = core + halo + spikes;
  if (light < 0.004) discard;
  gl_FragColor = vec4(vColor * vBright * light, 1.0);
}
`;

/* ---------------- Fond : nébuleuse (basse résolution) ---------------- */

export const bgVertex = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

/** Nuages de gaz + bandes de poussière, teintés par la palette de la section.
 *  Rendu dans une petite texture (formes très douces) pour rester léger. */
export const nebulaFragment = /* glsl */ `
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uInk;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uSide;
uniform float uGlow;
uniform float uScroll;
varying vec2 vUv;
${SNOISE}

float fbm(vec3 p){
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) { s += a * snoise(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return s;
}

void main(){
  vec2 p = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 q = vec2((p.x - 0.5) * aspect, p.y - 0.5);
  float t = uTime * 0.012;

  // Base : nuit bleutée en haut, encre violacée en bas — jamais un noir plat
  vec3 col = mix(uInk + vec3(0.03, 0.02, 0.055), uInk + vec3(0.012, 0.028, 0.055), p.y);

  // Le motif défile plus lentement que la page (parallaxe)
  vec2 nq = q * 1.1 + vec2(0.0, uScroll * 0.12);
  vec2 warp = vec2(snoise(vec3(nq * 0.8, t)), snoise(vec3(nq * 0.8 + 5.2, t + 3.0)));
  float clouds = smoothstep(-0.2, 0.7, fbm(vec3(nq * 1.3 + warp * 0.8, t * 1.4)));
  float wisps = smoothstep(0.05, 0.6, snoise(vec3(nq * 3.4 + warp * 1.5, t + 7.0)));
  float dust = smoothstep(0.15, 0.75, snoise(vec3(nq * 2.1 - warp * 1.2, t * 0.8 + 2.0)));

  // La nébuleuse se concentre du côté où se trouvent les particules
  vec2 c = vec2(uSide * 0.38 * aspect, 0.05);
  float mask = smoothstep(1.5, 0.0, length((q - c) * vec2(0.7, 1.0)));
  float mask2 = smoothstep(1.1, 0.0, length(q - vec2(-c.x * 0.6 - 0.2, -0.45)));

  vec3 gasA = mix(uColorA, vec3(0.5, 0.55, 0.7), 0.35);
  vec3 gasB = mix(uColorB, vec3(0.5, 0.55, 0.7), 0.35);
  vec3 gas = mix(gasB, gasA, smoothstep(-0.4, 0.5, warp.x));
  col += gas * clouds * mask * 0.38 * uGlow;
  col += gasB * clouds * mask2 * 0.24 * uGlow;
  col += mix(gas, vec3(1.0), 0.4) * wisps * clouds * mask * 0.16 * uGlow;
  col *= 1.0 - dust * 0.5 * min(1.0, mask + mask2 * 0.5);

  // Vignette douce
  col *= 1.0 - 0.75 * smoothstep(0.55, 1.3, length(q * vec2(0.75, 1.0)));
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Composition plein écran : nébuleuse agrandie + étoiles lointaines + grain fin. */
export const bgFragment = /* glsl */ `
uniform sampler2D uNebula;
uniform float uTime;
uniform float uPixelRatio;
uniform float uScroll;
uniform vec2 uRes;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main(){
  vec3 col = texture2D(uNebula, vUv).rgb;

  // Champ d'étoiles lointaines, figées, qui défilent à peine (profondeur)
  vec2 g = gl_FragCoord.xy / (3.0 * uPixelRatio) + vec2(0.0, uScroll * uRes.y * 0.04 / 3.0);
  vec2 cell = floor(g);
  float h = hash(cell);
  if (h > 0.978) {
    vec2 sp = vec2(hash(cell + 3.1), hash(cell + 7.7)) * 0.6 + 0.2;
    float d = length(fract(g) - sp);
    float tw = 0.65 + 0.35 * sin(uTime * (0.4 + h * 2.0) + h * 91.0);
    vec3 tint = mix(vec3(0.72, 0.8, 1.0), vec3(1.0, 0.86, 0.75), step(0.995, h));
    col += tint * (1.0 - smoothstep(0.0, 0.32, d)) * ((h - 0.978) / 0.022) * 0.6 * tw;
  }

  // Grain fin animé (casse aussi les dégradés en escalier)
  float grain = hash(floor(gl_FragCoord.xy) + floor(uTime * 18.0) * 7.31);
  col += (grain - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}
`;
