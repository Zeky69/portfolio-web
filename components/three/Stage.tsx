"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getShape, type ShapeContext, type ShapeName, SHAPES } from "@/lib/shapes";
import { registerBurst } from "@/lib/stage";
import { setIntroDone } from "@/lib/intro";
import { bgFragment, bgVertex, particleFragment, particleVertex } from "./shaders";

const INK = "#0B0A10";
const DEFAULT_A = "#FF5A1F";
const DEFAULT_B = "#B7A4FF";
const SPINNING = new Set<ShapeName>(["halo", "galaxy", "knot", "constellation", "helix", "scatter"]);

type Target = {
  shape: ShapeName;
  side: number;
  c1: THREE.Color;
  c2: THREE.Color;
  dim: number;
};

type Section = { top: number; bottom: number; t: Target };

function readTarget(el: HTMLElement): Target {
  const d = el.dataset;
  const shape = (SHAPES as string[]).includes(d.stage ?? "") ? (d.stage as ShapeName) : "scatter";
  return {
    shape,
    side: d.side === "left" ? -1 : d.side === "right" ? 1 : 0,
    c1: new THREE.Color(d.c1 ?? DEFAULT_A),
    c2: new THREE.Color(d.c2 ?? DEFAULT_B),
    dim: d.dim ? parseFloat(d.dim) : 1,
  };
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Scène WebGL plein écran.
 *
 * Deux régimes pour les particules :
 *  - « scroll » (le régime normal) : la forme est une fonction directe de la position
 *    de défilement. Autour de chaque frontière entre deux sections, le morph va de 0 à 1
 *    au fil du scroll ; on peut s'arrêter à mi-chemin ou revenir en arrière.
 *  - « time » : animations jouées dans le temps (intro, changement de page). Dès que
 *    l'animation retombe sur la forme de la section affichée, on repasse en « scroll ».
 */
export default function Stage() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let narrow = window.innerWidth < 768;
    const N = narrow ? 9000 : 20000;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      setIntroDone();
      el.classList.add("stage-fallback");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    el.appendChild(renderer.domElement);

    const rootStyle = getComputedStyle(document.documentElement);
    const ctx: ShapeContext = {
      n: N,
      displayFont: rootStyle.getPropertyValue("--font-display").trim() || "sans-serif",
      monoFont: rootStyle.getPropertyValue("--font-mono").trim() || "monospace",
      narrow,
    };

    /* ---------- Fond texturé ---------- */
    const bgScene = new THREE.Scene();
    const bgCam = new THREE.Camera();
    const bgUniforms = {
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTime: { value: 0 },
      uInk: { value: new THREE.Color(INK) },
      uColorA: { value: new THREE.Color(DEFAULT_A) },
      uColorB: { value: new THREE.Color(DEFAULT_B) },
      uSide: { value: 0.4 },
      uGlow: { value: 1 },
    };
    const bgMat = new THREE.ShaderMaterial({
      vertexShader: bgVertex,
      fragmentShader: bgFragment,
      uniforms: bgUniforms,
      depthTest: false,
      depthWrite: false,
    });
    const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
    bgScene.add(bgMesh);

    /* ---------- Scène principale ---------- */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    const rig = new THREE.Group();
    const spin = new THREE.Group();
    rig.add(spin);
    scene.add(rig);

    // Particules
    const geo = new THREE.BufferGeometry();
    const from = new Float32Array(N * 3);
    const to = new Float32Array(N * 3);
    const rand = new Float32Array(N * 4);
    for (let i = 0; i < N * 4; i++) rand[i] = Math.random();
    const scatter = getShape("scatter", ctx);
    from.set(scatter);
    to.set(scatter);
    geo.setAttribute("position", new THREE.BufferAttribute(to, 3));
    const fromAttr = new THREE.BufferAttribute(from, 3);
    const toAttr = new THREE.BufferAttribute(to, 3);
    geo.setAttribute("aFrom", fromAttr);
    geo.setAttribute("aTo", toAttr);
    geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));

    const pUniforms = {
      uTime: { value: 0 },
      uProgress: { value: 1 },
      uChaos: { value: 0 },
      uSize: { value: narrow ? 5.6 : 5.0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uMouseRadius: { value: 1.1 },
      uColorA: { value: new THREE.Color(DEFAULT_A) },
      uColorB: { value: new THREE.Color(DEFAULT_B) },
      uOpacity: { value: 1 },
    };
    const pMat = new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: pUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, pMat);
    points.frustumCulled = false;
    spin.add(points);

    /* ---------- Régime « time » ---------- */
    let mode: "time" | "scroll" = "time";
    let currentShape: ShapeName = "scatter";
    let progress = 1;
    let duration = 2.2;
    let flight = 0;
    let holdUntil = 0;

    const setTarget = (name: ShapeName, opts: { force?: boolean; dur?: number } = {}) => {
      if (name === currentShape && !opts.force) return;
      // Fige la position actuelle comme point de départ
      const p = pUniforms.uProgress.value;
      for (let i = 0; i < N; i++) {
        const lp = Math.min(1, Math.max(0, (p - rand[i * 4 + 3] * 0.4) / 0.6));
        const e = easeInOutCubic(lp);
        const k = i * 3;
        from[k] += (to[k] - from[k]) * e;
        from[k + 1] += (to[k + 1] - from[k + 1]) * e;
        from[k + 2] += (to[k + 2] - from[k + 2]) * e;
      }
      to.set(getShape(name, ctx));
      fromAttr.needsUpdate = true;
      toAttr.needsUpdate = true;
      currentShape = name;
      progress = reduced ? 1 : 0;
      pUniforms.uProgress.value = progress;
      duration = opts.dur ?? 2.2;
    };

    /* ---------- Régime « scroll » ---------- */
    let sections: Section[] = [];
    const loaded = { a: -1, b: -1, sa: "" as ShapeName | "", sb: "" as ShapeName | "" };

    const measure = () => {
      const sy = window.scrollY;
      const list: Section[] = [];
      document.querySelectorAll<HTMLElement>("[data-stage]").forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.height <= 0) return;
        list.push({ top: r.top + sy, bottom: r.bottom + sy, t: readTarget(n) });
      });
      list.sort((x, y) => x.top - y.top);
      sections = list;
    };

    /** Position dans la « timeline » : paire de sections + avancement du morph. */
    const timeline = () => {
      const vh = window.innerHeight;
      const probe = window.scrollY + vh * 0.5;
      for (let k = 1; k < sections.length; k++) {
        const prev = sections[k - 1];
        const cur = sections[k];
        const B = cur.top;
        const H = Math.max(40, Math.min(vh * 0.42, (prev.bottom - prev.top) * 0.5, (cur.bottom - cur.top) * 0.5));
        if (probe > B - H && probe < B + H) return { a: k - 1, b: k, p: (probe - (B - H)) / (2 * H) };
      }
      let i = 0;
      for (let k = 0; k < sections.length; k++) if (sections[k].top <= probe) i = k;
      return { a: i, b: i, p: 0 };
    };

    const loadPair = (a: number, b: number) => {
      const sa = sections[a].t.shape;
      const sb = sections[b].t.shape;
      if (loaded.sa !== sa) from.set(getShape(sa, ctx));
      if (loaded.sb !== sb) to.set(getShape(sb, ctx));
      fromAttr.needsUpdate = loaded.sa !== sa;
      toAttr.needsUpdate = loaded.sb !== sb;
      Object.assign(loaded, { a, b, sa, sb });
    };

    const enterScroll = (i: number) => {
      // La forme affichée est exactement sections[i] : on charge la paire (i, i) sans saut
      const s = sections[i].t.shape;
      from.set(to);
      fromAttr.needsUpdate = true;
      Object.assign(loaded, { a: i, b: i, sa: s, sb: s });
      mode = "scroll";
    };

    registerBurst(() => {
      mode = "time";
      Object.assign(loaded, { a: -1, b: -1, sa: "", sb: "" });
      setTarget("scatter", { force: true, dur: 1.0 });
      flight = 1.4;
      holdUntil = clock.elapsedTime + 0.9;
    });

    /* ---------- Intro : poussière → nom → halo ---------- */
    const playIntro =
      !reduced && window.location.pathname === "/" && window.scrollY < 40 && !window.location.hash;
    let introPhase: "pending" | "name" | "done" = playIntro ? "pending" : "done";
    let introClock = 0;
    if (!playIntro) setIntroDone();

    const endIntro = () => {
      if (introPhase === "done") return;
      introPhase = "done";
      setIntroDone();
    };
    const skip = () => {
      if (introPhase === "name" && introClock > 1.2) endIntro();
    };
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });

    /* ---------- Entrées ---------- */
    const mouseNdc = new THREE.Vector2(0, 0);
    const parallax = new THREE.Vector2(0, 0);
    const zero = new THREE.Vector2(0, 0);
    let hasMouse = false;
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hit = new THREE.Vector3();

    const onMove = (e: PointerEvent) => {
      mouseNdc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      hasMouse = e.pointerType === "mouse";
    };
    const onLeave = () => {
      hasMouse = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    let lastScroll = window.scrollY;
    let scrollVel = 0;

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      bgUniforms.uRes.value.set(w, h);
      narrow = w < 768;
      ctx.narrow = narrow;
      measure();
    };
    window.addEventListener("resize", onResize);

    /* ---------- Style courant (couleurs, côté, forme 3D, opacité) ---------- */
    const style = {
      c1: new THREE.Color(DEFAULT_A),
      c2: new THREE.Color(DEFAULT_B),
      side: 0,
      dim: 1,
    };
    const tmpA = new THREE.Color();
    const tmpB = new THREE.Color();

    /* ---------- Boucle ---------- */
    const clock = new THREE.Clock();
    let spinAngle = 0;
    let raf = 0;
    let frame = 0;
    let fontsReady = false;
    document.fonts?.ready.then(() => {
      fontsReady = true;
    });
    measure();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      frame++;
      if (frame % 20 === 0) measure();

      const tl = sections.length ? timeline() : null;
      let shownShape: ShapeName = currentShape;
      let follow = 2.2; // vitesse de rattrapage du style

      if (introPhase === "pending" && (fontsReady || t > 1.5) && t > 0.25) {
        introPhase = "name";
        introClock = 0;
        setTarget("name", { force: true, dur: 2.0 });
        flight = 1.2;
      } else if (introPhase === "name") {
        introClock += dt;
        if (introClock > 3.5 || window.scrollY > 200) endIntro();
      }

      if (mode === "time") {
        if (progress < 1) progress = Math.min(1, progress + dt / duration);
        const flying = progress < 0.7;
        flight += ((flying ? 1 : 0) - flight) * (1 - Math.exp(-dt * (flying ? 3 : 1.6)));
        pUniforms.uProgress.value = progress;
        pUniforms.uChaos.value = reduced ? 0 : flight;

        if (introPhase === "done" && tl && t > holdUntil) {
          const dominant = sections[tl.p < 0.5 ? tl.a : tl.b];
          // Si l'utilisateur défile déjà, on raccourcit l'animation
          const scrolled = window.scrollY > 100;
          if (dominant.t.shape !== currentShape && (progress >= 0.999 || scrolled)) {
            setTarget(dominant.t.shape, { dur: scrolled ? 0.9 : 1.6 });
          } else if (progress >= 1 && tl.a === tl.b && dominant.t.shape === currentShape) {
            enterScroll(tl.a);
          }
          Object.assign(style, { side: dominant.t.side, dim: dominant.t.dim });
          style.c1.copy(dominant.t.c1);
          style.c2.copy(dominant.t.c2);
        }
        if (introPhase !== "done") {
          Object.assign(style, { side: 0, dim: 1 });
          style.c1.set(DEFAULT_A);
          style.c2.set(DEFAULT_B);
        }
      } else if (tl) {
        // Régime scroll : forme = f(position de défilement)
        let p = tl.p;
        if (tl.a === tl.b) {
          if (loaded.a === tl.a && loaded.b === tl.a) p = 0;
          else if (loaded.b === tl.a && loaded.sb === sections[tl.a].t.shape) p = 1;
          else if (loaded.a === tl.a && loaded.sa === sections[tl.a].t.shape) p = 0;
          else {
            loadPair(tl.a, tl.a);
            p = 0;
          }
        } else if (loaded.a !== tl.a || loaded.b !== tl.b) {
          loadPair(tl.a, tl.b);
        }
        if (reduced) p = p < 0.5 ? 0 : 1;
        pUniforms.uProgress.value = p;
        pUniforms.uChaos.value = reduced ? 0 : Math.sin(Math.PI * p) * 1.15;

        const A = sections[loaded.a]?.t ?? sections[tl.a].t;
        const Bt = sections[loaded.b]?.t ?? sections[tl.b].t;
        const e = smooth(Math.min(1, Math.max(0, (p - 0.15) / 0.7)));
        style.side = A.side + (Bt.side - A.side) * e;
        style.dim = A.dim + (Bt.dim - A.dim) * e;
        style.c1.copy(tmpA.copy(A.c1).lerp(Bt.c1, e));
        style.c2.copy(tmpB.copy(A.c2).lerp(Bt.c2, e));
        shownShape = p < 0.5 ? A.shape : Bt.shape;
        currentShape = loaded.sb as ShapeName;
        progress = 1;
        follow = 9;
      }

      // Application du style
      const k = 1 - Math.exp(-dt * follow);
      pUniforms.uColorA.value.lerp(style.c1, k);
      pUniforms.uColorB.value.lerp(style.c2, k);
      bgUniforms.uColorA.value.lerp(style.c1, k);
      bgUniforms.uColorB.value.lerp(style.c2, k);

      const visH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const visW = visH * camera.aspect;
      const portrait = camera.aspect < 0.9;
      const side = portrait ? 0 : style.side;
      rig.position.x += (side * visW * 0.24 - rig.position.x) * k;
      const fit = portrait ? Math.min(1, visW / 5.6) : Math.min(1.1, visH / 6.4);
      rig.scale.setScalar(rig.scale.x + (fit - rig.scale.x) * (1 - Math.exp(-dt * 2)));
      bgUniforms.uSide.value += (style.side - bgUniforms.uSide.value) * k;

      const dim = style.dim * (portrait && introPhase === "done" ? 0.4 : 1);
      pUniforms.uOpacity.value += (dim - pUniforms.uOpacity.value) * k;

      const sy = window.scrollY;
      scrollVel += (sy - lastScroll - scrollVel) * 0.15;
      lastScroll = sy;

      // Rotation des particules
      if (SPINNING.has(shownShape)) {
        spinAngle += dt * 0.14;
      } else {
        spinAngle = Math.atan2(Math.sin(spinAngle), Math.cos(spinAngle));
        const amp = shownShape === "name" || shownShape === "braces" ? 0.1 : 0.32;
        spinAngle += (Math.sin(t * 0.25) * amp - spinAngle) * (1 - Math.exp(-dt * 1.5));
      }
      parallax.lerp(hasMouse ? mouseNdc : zero, 1 - Math.exp(-dt * 3));
      spin.rotation.y = spinAngle + parallax.x * 0.3;
      spin.rotation.x = -parallax.y * 0.18 + THREE.MathUtils.clamp(scrollVel * 0.004, -0.35, 0.35);

      if (hasMouse) {
        raycaster.setFromCamera(mouseNdc, camera);
        if (raycaster.ray.intersectPlane(plane, hit)) pUniforms.uMouse.value.lerp(hit, 0.35);
      } else {
        pUniforms.uMouse.value.set(99, 99, 0);
      }

      pUniforms.uTime.value = t;
      bgUniforms.uTime.value = t;

      renderer.clear();
      renderer.render(bgScene, bgCam);
      renderer.render(scene, camera);
    };
    tick();
    el.classList.add("is-ready");

    return () => {
      cancelAnimationFrame(raf);
      registerBurst(() => {});
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      geo.dispose();
      pMat.dispose();
      bgMesh.geometry.dispose();
      bgMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} aria-hidden className="stage" />;
}
