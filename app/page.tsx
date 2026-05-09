"use client";

import dynamic from "next/dynamic";
import { Overlay } from "@/components/Overlay";

const ArtCanvas = dynamic(() => import("@/components/ArtCanvas"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "#07090f",
        color: "#8b95a8",
        fontSize: 14,
      }}
    >
      Loading canvas…
    </div>
  ),
});

export default function Page() {
  return (
    <>
      <ArtCanvas />
      <Overlay />
    </>
  );
}
