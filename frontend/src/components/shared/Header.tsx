"use client";

import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

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

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
