"use client";

import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sun, Moon } from "lucide-react";
import { useTour } from "@/lib/tour";
import { useTheme } from "@/components/shared/ThemeProvider";

const pageTitles: Record<string, string> = {
  "/dashboard": "Portfolio Dashboard",
  "/credits": "Credit Intelligence",
  "/verification": "On-Chain Verification",
  "/stories": "Impact Stories",
};

export function Header() {
  const pathname = usePathname();
  const title =
    pageTitles[pathname] ??
    (pathname.startsWith("/project/") ? "Project Deep Dive" : "Portfolio Dashboard");
  const { restart } = useTour();
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--st-border)] bg-[var(--st-card)] px-6">
      <h1 className="text-lg font-semibold text-[var(--st-text)]">{title}</h1>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="gap-1.5 text-xs text-[var(--st-text-muted)]"
        >
          {theme === "light" ? <Moon className="size-3" /> : <Sun className="size-3" />}
          {theme === "light" ? "Dark" : "Light"}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={restart}
          className="gap-1.5 text-xs text-[var(--st-text-muted)]"
        >
          <RotateCcw className="size-3" />
          Tour
        </Button>

        <div className="flex items-center gap-1.5 text-xs text-[var(--st-text-muted)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span>Live</span>
        </div>
        <Badge variant="outline" className="text-xs font-mono">
          Regen AI
        </Badge>
      </div>
    </header>
  );
}
