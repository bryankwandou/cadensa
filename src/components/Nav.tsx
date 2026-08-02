"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Wordmark } from "./Logo";

const LINKS = [
  { href: "/log", label: "Catat" },
  { href: "/rhythm", label: "Ritme" },
  { href: "/insights", label: "Bacaan" },
  { href: "/privacy", label: "Privasi" },
];

export function Nav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b hairline bg-ink-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="Cadensa, beranda">
          <Wordmark size={28} />
        </Link>
        <div className="flex items-center gap-1">
          {LINKS.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="relative rounded-full px-3.5 py-1.5 text-sm text-sand-300 transition-colors hover:text-sand-100"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-ink-700"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={`relative ${active ? "text-sand-100" : ""}`}>{l.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
