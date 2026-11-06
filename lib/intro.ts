import { useSyncExternalStore } from "react";

// Petit store global : l'intro (preloader) est-elle terminée ?
// Le preloader ne joue qu'au premier chargement complet de la page.
let done = false;
const listeners = new Set<() => void>();

export function setIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
}

export function introAlreadyDone() {
  return done;
}

export function useIntroDone() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => done,
    () => false
  );
}
