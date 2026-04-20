"use client";

import { Plus, Users, Filter, MoreVertical } from "lucide-react";
import type { Member, CalendarEvent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TeamSidebarProps = {
  members: Member[];
  events: CalendarEvent[];
  filter: string[]; // empty = show all
  onToggleFilter: (memberId: string) => void;
  onClearFilter: () => void;
  onAddMember: () => void;
  onEditMember: (m: Member) => void;
};

export function TeamSidebar({
  members,
  events,
  filter,
  onToggleFilter,
  onClearFilter,
  onAddMember,
  onEditMember,
}: TeamSidebarProps) {
  const isAll = filter.length === 0;

  const countForMember = (id: string) =>
    events.filter((e) => e.assigneeIds.includes(id)).length;

  const openCountForMember = (id: string) =>
    events
      .filter((e) => e.assigneeIds.includes(id))
      .reduce(
        (acc, e) => acc + e.checklist.filter((c) => !c.done).length,
        0
      );

  return (
    <aside className="w-72 shrink-0 border-r border-white/5 bg-background/60 flex flex-col">
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase mb-3">
          <Users className="w-3.5 h-3.5" />
          Team
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="text-2xl font-black tracking-tight">
            {members.length}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddMember}
            className="h-8 gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>
      </div>

      <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          <Filter className="w-3 h-3" />
          Filter
        </div>
        {!isAll && (
          <button
            onClick={onClearFilter}
            className="text-[11px] text-primary hover:text-primary/80 font-medium"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bb-scroll px-3 py-2">
        <button
          onClick={onClearFilter}
          className={cn(
            "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors",
            isAll
              ? "bg-white/5 border border-white/10"
              : "hover:bg-white/5 border border-transparent"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">Everyone</div>
            <div className="text-[11px] text-muted-foreground">
              {events.length} event{events.length === 1 ? "" : "s"}
            </div>
          </div>
          {isAll && (
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          )}
        </button>

        {members.map((m) => {
          const selected = filter.includes(m.id);
          const count = countForMember(m.id);
          const openItems = openCountForMember(m.id);
          return (
            <div
              key={m.id}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors group",
                selected
                  ? "bg-white/5 border border-white/10"
                  : "hover:bg-white/5 border border-transparent"
              )}
            >
              <button
                onClick={() => onToggleFilter(m.id)}
                className="flex items-center gap-3 flex-1 min-w-0 text-left"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ring-2 ring-transparent transition-all"
                  style={{
                    background: m.color,
                    boxShadow: selected
                      ? `0 0 12px ${m.color}80`
                      : "none",
                  }}
                >
                  {m.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {m.role} · {count} event{count === 1 ? "" : "s"}
                    {openItems > 0 && (
                      <span className="text-primary/80 font-semibold">
                        {" "}
                        · {openItems} open
                      </span>
                    )}
                  </div>
                </div>
              </button>
              <button
                onClick={() => onEditMember(m)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground p-1 rounded transition-all"
                aria-label={`Edit ${m.name}`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {members.length === 0 && (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            No teammates yet. Add one to get started.
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 text-[10px] text-muted-foreground tracking-widest uppercase font-mono">
        v0.1 · Local storage
      </div>
    </aside>
  );
}
