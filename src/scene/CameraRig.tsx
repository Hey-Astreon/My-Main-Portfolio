import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneBus, scrollBus, type SectionId } from "@/lib/scene-bus";
import type { Tier } from "./useDeviceTier";

const KEYFRAMES = [
  { p: 0.0, pos: [0, 0.2, 6.0], look: [0, 0, 0] },
  { p: 0.25, pos: [3.5, 1.5, 7.0], look: [0.5, 0.2, 0] },
  { p: 0.50, pos: [-3.2, 0.8, 6.5], look: [-0.4, 0.1, 0] },
  { p: 0.75, pos: [0, 5.5, 4.5], look: [0, 0.5, 0] },
  { p: 1.0, pos: [-0.8, -0.4, 3.6], look: [0, 0, 0] },
];

function interpolateKeyframes(p: number) {
  const clampedP = Math.min(Math.max(p, 0), 1);
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const k1 = KEYFRAMES[i];
    const k2 = KEYFRAMES[i + 1];
    if (clampedP >= k1.p && clampedP <= k2.p) {
      const t = (clampedP - k1.p) / (k2.p - k1.p);
      const easeT = t * t * (3 - 2 * t);
      return {
        pos: [
          k1.pos[0] + (k2.pos[0] - k1.pos[0]) * easeT,
          k1.pos[1] + (k2.pos[1] - k1.pos[1]) * easeT,
          k1.pos[2] + (k2.pos[2] - k1.pos[2]) * easeT,
        ],
        look: [
          k1.look[0] + (k2.look[0] - k1.look[0]) * easeT,
          k1.look[1] + (k2.look[1] - k1.look[1]) * easeT,
          k1.look[2] + (k2.look[2] - k1.look[2]) * easeT,
        ],
      };
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1];
}

export function CameraRig({ tier }: { tier: Tier }) {
  const { camera } = useThree();
  const desired = useRef(new THREE.Vector3(...KEYFRAMES[0].pos));
  const look = useRef(new THREE.Vector3(...KEYFRAMES[0].look));
  const currentLook = useRef(new THREE.Vector3(...KEYFRAMES[0].look));
  const mouse = useRef(new THREE.Vector2(0, 0));
  const lastMouse = useRef(0);
  const lastScrollY = useRef(0);
  const snap = tier === "low";

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(Math.max(window.scrollY / total, 0), 1) : 0;
      const deltaY = Math.abs(window.scrollY - lastScrollY.current);
      lastScrollY.current = window.scrollY;

      scrollBus.set(progress, deltaY);

      const target = interpolateKeyframes(progress);
      desired.current.set(...target.pos as [number, number, number]);
      look.current.set(...target.look as [number, number, number]);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const throttle = snap ? 33 : 0;
    const move = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouse.current < throttle) return;
      lastMouse.current = now;
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", move, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", move);
    };
  }, [snap]);

  useFrame(() => {
    if (snap) return;
    const dx = mouse.current.x * 0.4;
    const dy = mouse.current.y * 0.25;
    camera.position.x += (desired.current.x + dx - camera.position.x) * 0.05;
    camera.position.y += (desired.current.y + dy - camera.position.y) * 0.05;
    camera.position.z += (desired.current.z - camera.position.z) * 0.05;
    currentLook.current.lerp(look.current, 0.07);
    camera.lookAt(currentLook.current);
  });

  return null;
}
