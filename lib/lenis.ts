import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;

export function scrollToTarget(
  target: string | number | HTMLElement,
  opts: { immediate?: boolean } = {}
) {
  const { immediate = false } = opts;
  if (instance) {
    instance.scrollTo(target, { immediate, force: true, duration: 1.6 });
    return;
  }
  const behavior: ScrollBehavior = immediate ? "auto" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
    return;
  }
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior });
}
