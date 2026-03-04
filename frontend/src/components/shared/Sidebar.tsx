"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MapPin,
  Shield,
  CheckCircle,
  BookOpen,
  Waves,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Projects", icon: MapPin, path: "/project/marereni-kenya" },
  { label: "Credits", icon: Shield, path: "/credits" },
  { label: "Verification", icon: CheckCircle, path: "/verification" },
  { label: "Stories", icon: BookOpen, path: "/stories" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-[var(--sidebar)] glass-card">
      {/* Branding */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-primary opacity-15 blur-md scale-150" />
          <Waves className="relative h-5 w-5 text-primary" />
        </div>
        <Link
          href="/"
          className="flex flex-col hover:opacity-80 transition-opacity"
        >
          <span className="text-sm font-semibold tracking-tight text-[var(--sidebar-foreground)]">
            SeaTrees
          </span>
          <span className="text-[10px] text-muted-foreground">
            Marine Intelligence
          </span>
        </Link>
      </div>

      {/* Gradient separator */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 pt-3">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive =
            pathname === path || pathname.startsWith(path + "/") ||
            (path === "/project/marereni-kenya" && pathname.startsWith("/project/"));

          return (
            <Link
              key={path}
              href={path}
              className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              style={{
                color: isActive ? "white" : undefined,
              }}
            >
              {/* Sliding active pill */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-primary"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}

              {/* Hover layer */}
              {!isActive && (
                <span className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity bg-[var(--sidebar-accent)]" />
              )}

              <Icon
                className={`relative z-10 h-4 w-4 ${!isActive ? "text-muted-foreground" : ""}`}
              />
              <span
                className={`relative z-10 ${!isActive ? "text-muted-foreground hover:text-foreground" : ""}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4">
        <p className="text-[11px] text-muted-foreground">
          Powered by Regen Network
        </p>
      </div>
    </aside>
  );
}
