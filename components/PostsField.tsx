"use client";

import { Html } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { Vector3, type Mesh } from "three";
import type { PostRow } from "@/lib/types";
import { queryColor } from "@/lib/colors";

type Props = {
  posts: PostRow[];
  maxLikes: number;
  minLikesFilter: number;
};

/** Fibonacci sphere distribution + radial depth by engagement */
function positionForIndex(
  i: number,
  n: number,
  likes: number,
  maxLikes: number,
): [number, number, number] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = n > 1 ? 1 - (i / (n - 1)) * 2 : 0;
  const r0 = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = golden * i;
  const base = 4.2;
  const engagement = Math.log10(1 + likes);
  const engagementMax = Math.log10(1 + Math.max(maxLikes, 1));
  const radial = base + (engagement / engagementMax) * 5.5;
  const x = Math.cos(theta) * r0 * radial;
  const z = Math.sin(theta) * r0 * radial;
  const yy = y * radial * 0.85 + (likes / maxLikes) * 0.35;
  return [x, yy, z];
}

export function PostsField({ posts, maxLikes, minLikesFilter }: Props) {
  const filtered = useMemo(
    () => posts.filter((p) => p.likes >= minLikesFilter),
    [posts, minLikesFilter],
  );

  const [hovered, setHovered] = useState<PostRow | null>(null);
  const [hoverPos, setHoverPos] = useState<[number, number, number]>([0, 0, 0]);

  const layout = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => b.likes - a.likes);
    const n = sorted.length || 1;
    return sorted.map((p, i) => ({
      post: p,
      pos: positionForIndex(i, n, p.likes, maxLikes),
      radius:
        0.06 +
        Math.pow(p.likes / maxLikes, 0.45) * (p.institutional ? 0.28 : 0.42),
    }));
  }, [filtered, maxLikes]);

  return (
    <group>
      {layout.map(({ post, pos, radius }) => (
        <PostOrb
          key={`${post.username}-${post.post_date_label}-${post.query_zh}`}
          post={post}
          position={pos}
          radius={radius}
          onHover={(p, world, active) => {
            if (active && p) {
              setHovered(p);
              setHoverPos([world.x, world.y, world.z]);
            } else {
              setHovered(null);
            }
          }}
        />
      ))}
      {hovered && (
        <Html position={hoverPos} center distanceFactor={12}>
          <div
            style={{
              width: 260,
              padding: "12px 14px",
              borderRadius: 10,
              background: "rgba(10,14,24,0.92)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#e8ecf4",
              fontSize: 12,
              lineHeight: 1.45,
              pointerEvents: "none",
              boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 6 }}>@{hovered.username}</div>
            <div style={{ color: "#8b95a8", marginBottom: 8 }}>
              <span lang="zh-Hant">{hovered.query_zh}</span>
              <span style={{ margin: "0 6px" }}>·</span>
              <span>{hovered.query_en}</span>
            </div>
            <div>
              Likes {Math.round(hovered.likes).toLocaleString()}
              {hovered.institutional ? (
                <span style={{ color: "#7ab8ff", marginLeft: 8 }}>
                  · institutional
                </span>
              ) : null}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function PostOrb({
  post,
  position,
  radius,
  onHover,
}: {
  post: PostRow;
  position: [number, number, number];
  radius: number;
  onHover: (
    p: PostRow | null,
    world: Vector3,
    active: boolean,
  ) => void;
}) {
  const ref = useRef<Mesh>(null);
  const col = queryColor(post.query_key, post.institutional);

  const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const w = new Vector3();
    e.object.getWorldPosition(w);
    onHover(post, w, true);
  };

  const onPointerOut = () => {
    onHover(null, new Vector3(), false);
  };

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      castShadow
    >
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial
        color={col}
        emissive={col}
        emissiveIntensity={0.35}
        roughness={0.35}
        metalness={0.2}
      />
    </mesh>
  );
}
