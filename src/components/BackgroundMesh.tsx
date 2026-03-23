export default function BackgroundMesh() {
  return (
    <div className="fixed inset-0 z-[-1] h-full w-full bg-[#0a0a0a]">
      {/* Subtle top glow to highlight the header area */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-900/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Dotted Matrix Background */}
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}