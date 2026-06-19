export function StartupSplash() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <img
        src="/logo.png"
        alt="BaiTech Vision"
        className="h-36 w-36 object-contain sm:h-44 sm:w-44"
      />
      <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">
        BaiTech Vision
      </p>
      <p className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground">
        Bottle Cap Inspection System
      </p>
    </div>
  );
}
