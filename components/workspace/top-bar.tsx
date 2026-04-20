"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRange } from "@/lib/date";
import { cn } from "@/lib/utils";

type TopBarProps = {
  weekStart: Date;
  weekEnd: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onNewEvent: () => void;
  search: string;
  onSearch: (v: string) => void;
};

export function TopBar({
  weekStart,
  weekEnd,
  onPrev,
  onNext,
  onToday,
  onNewEvent,
  search,
  onSearch,
}: TopBarProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-6 h-16 border-b border-white/5 bg-background/80 backdrop-blur-md shrink-0">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          title="Back to landing"
        >
          <div className="relative w-7 h-7 rounded-md border border-primary/60 flex items-center justify-center">
            <div className="w-3 h-3 rounded-sm bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
          </div>
          <span className="font-black tracking-tight text-base hidden md:block">
            BLACKBOX
          </span>
        </Link>

        <div className="w-px h-6 bg-white/10 hidden md:block" />

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onToday}
            className="h-9"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrev}
            className="h-9 w-9"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="h-9 w-9"
            aria-label="Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="font-semibold text-base md:text-lg tracking-tight">
          {formatRange(weekStart, weekEnd)}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className={cn(
              "h-9 w-64 rounded-md pl-9 pr-3 text-sm",
              "bg-white/5 border border-white/10",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            )}
          />
        </div>

        <Button onClick={onNewEvent} size="sm" className="h-9 gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New event</span>
        </Button>

        <Link href="/" title="Home">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Home className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
