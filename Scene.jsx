'use client';

import { useStore } from '@/lib/store';
import { ZONES } from '@/data/content';
import clsx from 'clsx';

export default function Navigation() {
  const activeZone = useStore((s) => s.activeZone);

  const scrollToZone = (index) => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const target = (index / (ZONES.length - 1)) * totalHeight;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            {/* GDG-style logo mark */}
            <div className="absolute inset-0 rounded-full border-2 border-aurora" />
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-mars via-solar to-nebula opacity-80" />
            <div className="absolute inset-0 rounded-full border border-white/20 animate-pulse-slow" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-mono text-[10px] tracking-[0.2em] text-ink-dim uppercase">
              Google Developers Group
            </span>
            <span className="font-display italic text-xl text-ink">Universe</span>
          </div>
        </div>

        <div className="font-mono text-[11px] tracking-wider text-ink-dim flex gap-6">
          <span className="hidden md:inline">SECTOR {String(activeZone).padStart(2, '0')} / 05</span>
          <a
            href="#join"
            className="text-aurora hover:text-solar transition-colors"
          >
            [ Join signal → ]
          </a>
        </div>
      </nav>

      {/* Zone dots - right edge */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {ZONES.map((z, i) => (
          <button
            key={z.id}
            onClick={() => scrollToZone(i)}
            className="group flex items-center gap-3"
            aria-label={`Go to ${z.id} zone`}
          >
            <span
              className={clsx(
                'font-mono text-[10px] tracking-wider opacity-0 group-hover:opacity-100 transition-opacity',
                activeZone === i ? 'text-aurora' : 'text-ink-dim'
              )}
            >
              {z.id.toUpperCase()}
            </span>
            <span
              className={clsx(
                'block w-2 h-2 rounded-full transition-all border border-ink-dim',
                activeZone === i ? 'bg-aurora border-aurora scale-150' : 'bg-transparent'
              )}
            />
          </button>
        ))}
      </div>

      {/* Bottom telemetry */}
      <div className="fixed bottom-6 left-8 z-50 font-mono text-[10px] text-ink-dim tracking-wider flex flex-col gap-1">
        <span>TELEMETRY · ACTIVE</span>
        <span className="text-aurora">▸ scroll to traverse</span>
      </div>
    </>
  );
}
