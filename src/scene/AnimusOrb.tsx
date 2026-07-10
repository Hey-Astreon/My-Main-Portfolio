import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TIER_PRESETS, type Tier } from "./useDeviceTier";

const vertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  varying vec3 vViewDir;
  uniform float uTime;
  uniform float uMouseLen;
  uniform float uDetail;

  vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 pos = position;
    float n = snoise(pos * 1.6 + vec3(uTime * 0.15, uTime * 0.1, 0.0));
    float disp = 0.18 * n + 0.08 * uMouseLen * sin(uTime * 2.0 + n * 4.0);
    if (uDetail > 0.5) {
      float n2 = snoise(pos * 3.5 + vec3(-uTime * 0.2, 0.0, uTime * 0.12));
      disp += 0.06 * n2;
    }
    vec3 newPos = pos + normal * disp;
    vec4 mvPos = modelViewMatrix * vec4(newPos, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vPos = newPos;
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  varying vec3 vViewDir;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uScan;
  uniform float uFresnelPow;

  void main() {
    float d = 1.0 - max(dot(vNormal, vViewDir), 0.0);
    float fres = pow(d, uFresnelPow);
    float bands = 0.5 + 0.5 * sin(vPos.y * 22.0 + uTime * 1.4);
    bands = smoothstep(0.7, 1.0, bands) * 0.35;

    vec3 base = mix(uColorA, uColorB, fres);
    vec3 col = base + uScan * (fres * 1.2 + bands);

    float ring = smoothstep(0.02, 0.0, abs(fract(vPos.y * 4.0 + uTime * 0.2) - 0.5));
    col += uScan * ring * 0.15;

    gl_FragColor = vec4(col, 0.95);
  }
`;

export function AnimusOrb({ dark, tier }: { dark: boolean; tier: Tier }) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const frameCount = useRef(0);
  const preset = TIER_PRESETS[tier];
  const detail = preset.orbDetail;
  const highDetail = tier === "high";
  const skipEveryOther = tier === "low";

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouseLen: { value: 0 },
      uDetail: { value: highDetail ? 1 : 0 },
      uFresnelPow: { value: tier === "low" ? 2.0 : 2.2 },
      uColorA: { value: new THREE.Color("#e8e4dc") },
      uColorB: { value: new THREE.Color("#8b8b90") },
      uScan: { value: new THREE.Color("#7ec8e3") },
    }),
    [highDetail, tier],
  );

  const easedMouse = useRef(new THREE.Vector2(0, 0));

  useFrame((state, dt) => {
    frameCount.current++;
    const skip = skipEveryOther && frameCount.current % 2 === 0;
    const t = state.clock.elapsedTime;

    if (mat.current) {
      mat.current.uniforms.uTime.value = t;

      if (!skip) {
        const target = state.pointer;
        easedMouse.current.x += (target.x - easedMouse.current.x) * 0.06;
        easedMouse.current.y += (target.y - easedMouse.current.y) * 0.06;
        mat.current.uniforms.uMouseLen.value = easedMouse.current.length() * 0.6;

        const a = mat.current.uniforms.uColorA.value as THREE.Color;
        const b = mat.current.uniforms.uColorB.value as THREE.Color;
        // Light mode: deeper slate so orb reads as a solid presence on bone bg.
        // Dark mode: soft charcoal with icy rim highlight.
        const targetA = dark ? new THREE.Color("#0f1116") : new THREE.Color("#3a4a5c");
        const targetB = dark ? new THREE.Color("#4a5566") : new THREE.Color("#5c728a");
        a.lerp(targetA, 0.05);
        b.lerp(targetB, 0.05);
        mat.current.uniforms.uFresnelPow.value = dark ? 2.2 : 1.6;
      }
    }
    if (mesh.current) {
      mesh.current.rotation.y += dt * 0.08;
      mesh.current.rotation.x = Math.sin(t * 0.2) * 0.15;
      const s = 1 + Math.sin(t * 0.9) * 0.01;
      mesh.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.4, 0.004, 16, 200]} />
        <meshBasicMaterial color="#7ec8e3" transparent opacity={0.35} />
      </mesh>
      {preset.halos >= 2 && (
        <mesh rotation={[0, 0, Math.PI / 3]}>
          <torusGeometry args={[2.55, 0.003, 16, 200]} />
          <meshBasicMaterial color={dark ? "#ffffff" : "#1a1a1c"} transparent opacity={0.25} />
        </mesh>
      )}
      {preset.halos >= 3 && (
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[2.7, 0.002, 16, 200]} />
          <meshBasicMaterial color={dark ? "#ffffff" : "#1a1a1c"} transparent opacity={0.15} />
        </mesh>
      )}

      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.6, detail]} />
        <shaderMaterial
          ref={mat}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
        />
      </mesh>

      {tier !== "low" && (
        <mesh scale={0.85}>
          <icosahedronGeometry args={[1.5, 3]} />
          <meshBasicMaterial
            color={dark ? "#050506" : "#26313f"}
            transparent
            opacity={dark ? 0.35 : 0.55}
          />
        </mesh>
      )}
    </group>
  );
}
