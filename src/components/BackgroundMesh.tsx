"use client";

export default function BackgroundMesh() {
  return (
    <div className="fixed inset-0 z-[-1] h-full w-full bg-[#fafafa]">
      {/* Playful top gradient highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />

      {/* Clean, light-theme dotted matrix */}
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}