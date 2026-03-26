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
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", tourId: "nav-dashboard" },
  { label: "Projects", icon: MapPin, path: "/dashboard", tourId: "nav-projects" },
  { label: "Credits", icon: Shield, path: "/credits", tourId: "nav-credits" },
  { label: "Verification", icon: CheckCircle, path: "/verification", tourId: "nav-verification" },
  { label: "Stories", icon: BookOpen, path: "/stories", tourId: "nav-stories" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col border-r border-[var(--st-border)] bg-[var(--st-sidebar)]">
      {/* Branding */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--st-primary)]">
          <Waves className="size-4 text-white" />
        </div>
        <Link
          href="/"
          className="flex flex-col hover:opacity-80 transition-opacity"
        >
          <span className="text-sm font-semibold tracking-tight text-[var(--st-text)]">
            SeaTrees
          </span>
          <span className="text-[10px] text-[var(--st-text-muted)]">
            Marine Intelligence
          </span>
        </Link>
      </div>

      {/* Separator */}
      <div className="mx-4 h-px bg-[var(--st-border)]" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 pt-3">
        {navItems.map(({ label, icon: Icon, path, tourId }) => {
          const isActive =
            pathname === path || pathname.startsWith(path + "/") ||
            (path === "/dashboard" && pathname.startsWith("/project/"));

          return (
            <Link
              key={path}
              href={path}
              data-tour={tourId}
              className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
            >
              {/* Sliding active pill */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-[var(--st-primary)]"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}

              {/* Hover layer */}
              {!isActive && (
                <span className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity bg-[var(--st-primary-pale)]" />
              )}

              <Icon
                className={`relative z-10 h-4 w-4 ${isActive ? "text-white" : "text-[var(--st-text-muted)]"}`}
              />
              <span
                className={`relative z-10 ${isActive ? "text-white" : "text-[var(--st-text-muted)] hover:text-[var(--st-text)]"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4">
        <p className="text-[11px] text-[var(--st-text-muted)]">
          Powered by Regen Network
        </p>
      </div>
    </aside>
  );
}
