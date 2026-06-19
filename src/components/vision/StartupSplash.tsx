export function StartupSplash() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <img
        src="/logo.png"
        alt="BaiTech Vision"
        className="size-30 shrink-0 rounded-sm object-contain sm:size-90"
      />
      <p className="mt-1 text-xl font-bold uppercase tracking-[0.2em] text-foreground">
        BaiTech Vision
      </p>
      <p className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground">
        Bottle Cap Inspection System
      </p>
    </div>
  );
}
