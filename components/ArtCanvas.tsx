"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useState } from "react";
import type { PostRow } from "@/lib/types";
import { PostsField } from "@/components/PostsField";
import { ShieldVeil } from "@/components/ShieldVeil";

export default function ArtCanvas() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [minLikes, setMinLikes] = useState(0);

  useEffect(() => {
    fetch("/data/posts.json")
      .then((r) => r.json())
      .then(setPosts)
      .catch(console.error);
  }, []);

  const maxLikes = useMemo(() => {
    if (!posts.length) return 1;
    return Math.max(...posts.map((p) => p.likes), 1);
  }, [posts]);

  return (
    <div style={{ position: "fixed", inset: 0, touchAction: "none" }}>
      <Canvas
        camera={{ position: [0, 1.8, 10], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#07090f"]} />
        <fog attach="fog" args={["#07090f", 8, 26]} />
        <ambientLight intensity={0.35} />
        <spotLight
          position={[10, 14, 8]}
          angle={0.35}
          penumbra={0.6}
          intensity={1.2}
          castShadow
          color="#cfe0ff"
        />
        <pointLight position={[-8, -4, -6]} intensity={0.5} color="#ff8866" />
        <ShieldVeil />
        <Suspense fallback={null}>
          <Stars
            radius={80}
            depth={40}
            count={4500}
            factor={3}
            saturation={0}
            fade
            speed={0.35}
          />
        </Suspense>
        <PostsField
          posts={posts}
          maxLikes={maxLikes}
          minLikesFilter={minLikes}
        />
        <OrbitControls
          enablePan
          enableZoom
          minDistance={4}
          maxDistance={22}
          maxPolarAngle={Math.PI * 0.92}
        />
      </Canvas>
      {/* HUD slider outside Canvas */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 16px",
          borderRadius: 12,
          background: "rgba(12,16,28,0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(8px)",
          maxWidth: "92vw",
        }}
      >
        <label
          style={{
            fontSize: 12,
            color: "#8b95a8",
            whiteSpace: "nowrap",
          }}
        >
          Min. likes filter
        </label>
        <input
          type="range"
          min={0}
          max={50000}
          step={100}
          value={minLikes}
          onChange={(e) => setMinLikes(Number(e.target.value))}
          style={{ width: 180 }}
        />
        <span style={{ fontSize: 12, color: "#e8ecf4", minWidth: 56 }}>
          {minLikes.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
