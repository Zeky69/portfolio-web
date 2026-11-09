/**
 * Petit pont entre le DOM et la scène WebGL.
 * Les sections déclarent ce que les particules doivent montrer via des attributs :
 *   data-stage="pill"  data-side="right"  data-c1="#..." data-c2="#..."  data-dim="0.6"  data-morph="0.3"
 * La scène lit la section au centre de l'écran à chaque frame.
 */
type Listener = () => void;

let burstFn: Listener = () => {};

export function registerBurst(fn: Listener) {
  burstFn = fn;
}

/** Fait exploser les particules (transition de page). */
export function burst() {
  burstFn();
}
