// Tiny event bus so DOM sections can talk to the persistent R3F canvas
// without a full state library.

export type SectionId = "identity" | "modules" | "experience" | "matrix" | "transmission";

type Listener = (id: SectionId) => void;

let current: SectionId = "identity";
const listeners = new Set<Listener>();

export const sceneBus = {
  get current() {
    return current;
  },
  set(id: SectionId) {
    if (id === current) return;
    current = id;
    listeners.forEach((l) => l(id));
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

type ScrollListener = (progress: number, speed: number) => void;
let scrollProgress = 0;
let scrollSpeed = 0;
const scrollListeners = new Set<ScrollListener>();

export const scrollBus = {
  get progress() {
    return scrollProgress;
  },
  get speed() {
    return scrollSpeed;
  },
  set(progress: number, speed: number) {
    scrollProgress = progress;
    scrollSpeed = speed;
    scrollListeners.forEach((l) => l(progress, speed));
  },
  subscribe(l: ScrollListener) {
    scrollListeners.add(l);
    return () => scrollListeners.delete(l);
  },
};
