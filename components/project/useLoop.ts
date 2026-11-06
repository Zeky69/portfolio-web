import { useEffect, useState } from "react";
import { useInView } from "framer-motion";

/** Compteur de « scènes » qui tourne en boucle, seulement quand l'élément est visible. */
export function useLoop(steps: number, interval: number, ref: React.RefObject<HTMLElement | null>) {
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setStep((s) => (s + 1) % steps), interval);
    return () => clearInterval(id);
  }, [inView, steps, interval]);
  return step;
}
