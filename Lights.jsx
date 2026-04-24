'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ZONES } from '@/data/content';
import clsx from 'clsx';

export default function ScrollOverlay() {
  return (
    <div className="scroll-overlay">
      {ZONES.map((zone, i) => (
        <ZoneSection key={zone.id} zone={zone} index={i} />
      ))}
      <Footer />
    </div>
  );
}

function ZoneSection({ zone, index }) {
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Text fades in at center of viewport, fades out as it leaves
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0]
  );
  const y = useTransform(scrollYProgress, [0, 0.3], [60, 0]);

  const alignClass =
    index === 0
      ? 'items-center text-center'
      : index % 2 === 0
      ? 'items-start text-left'
      : 'items-end text-right';

  const colorMap = {
    nebula: 'text-nebula',
    mars: 'text-mars',
    solar: 'text-solar',
    aurora: 'text-aurora',
    violet: 'text-[#B967FF]',
  };

  return (
    <section
      ref={ref}
      className="min-h-screen w-full flex px-8 md:px-16 py-32 relative"
    >
      <motion.div
        style={{ opacity, y }}
        className={clsx(
          'flex flex-col gap-6 max-w-xl my-auto',
          alignClass,
          index === 0 && 'mx-auto'
        )}
      >
        <div
          className={clsx(
            'font-mono text-xs tracking-[0.3em] uppercase',
            colorMap[zone.color] || 'text-aurora'
          )}
        >
          {zone.eyebrow}
        </div>

        <h2 className="font-display italic text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] text-ink whitespace-pre-line">
          {zone.title}
        </h2>

        <p className="font-body text-lg md:text-xl text-ink-dim leading-relaxed max-w-lg">
          {zone.body}
        </p>

        {zone.items && (
          <ul className="mt-4 flex flex-col gap-2 font-mono text-sm">
            {zone.items.map((item, i) => (
              <li
                key={i}
                className="flex gap-4 items-baseline border-b border-white/5 py-2"
              >
                <span className={clsx('shrink-0', colorMap[zone.color])}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-ink">{item.name}</span>
                <span className="text-ink-dim ml-auto text-xs">{item.meta}</span>
              </li>
            ))}
          </ul>
        )}

        {zone.cta && (
          <a
            id={index === ZONES.length - 1 ? 'join' : undefined}
            href="#"
            className="inline-block mt-8 group"
          >
            <span
              className={clsx(
                'font-display italic text-3xl md:text-4xl border-b border-current pb-1 transition-all',
                colorMap[zone.color],
                'hover:glow-aurora hover:tracking-wide'
              )}
            >
              {zone.cta}
            </span>
          </a>
        )}
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 px-8 md:px-16 py-24 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <div className="font-display italic text-4xl text-ink">
            Build. Learn. <span className="text-aurora">Impact.</span>
          </div>
          <div className="font-mono text-xs text-ink-dim mt-4 tracking-wider">
            GDG · STUDENT CHAPTER · 2026
          </div>
        </div>
        <div className="flex gap-8 font-mono text-sm text-ink-dim">
          <a href="#" className="hover:text-aurora transition-colors">GITHUB</a>
          <a href="#" className="hover:text-aurora transition-colors">LINKEDIN</a>
          <a href="#" className="hover:text-aurora transition-colors">INSTAGRAM</a>
          <a href="#" className="hover:text-aurora transition-colors">CONTACT</a>
        </div>
      </div>
    </footer>
  );
}
