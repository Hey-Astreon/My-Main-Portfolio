import { useEffect, useRef } from "react";
import { sceneBus, type SectionId } from "./scene-bus";

export function useSectionInView(id: SectionId) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.4) {
            sceneBus.set(id);
          }
        }
      },
      { threshold: [0.4, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id]);
  return ref;
}
