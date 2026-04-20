"use client";

import React from "react";
import { Check, CircleDashed, CheckCircle2, AlertTriangle } from "lucide-react";
import type { CalendarEvent, Member } from "@/lib/types";
import {
  formatTimeLabel,
  toISODate,
  isSameDay,
  parseISODate,
  timeToMinutes,
} from "@/lib/date";
import { cn } from "@/lib/utils";

type TaskPanelProps = {
  events: CalendarEvent[];
  members: Member[];
  activeFilter: string[];
  onToggleItem: (eventId: string, itemId: string) => void;
  onOpenEvent: (e: CalendarEvent) => void;
};

export function TaskPanel({
  events,
  members,
  activeFilter,
  onToggleItem,
  onOpenEvent,
}: TaskPanelProps) {
  const today = new Date();
  const todayISO = toISODate(today);
  const memberMap = React.useMemo(() => {
    const map = new Map<string, Member>();
    members.forEach((m) => map.set(m.id, m));
    return map;
  }, [members]);

  const filtered = React.useMemo(() => {
    if (activeFilter.length === 0) return events;
    return events.filter((e) =>
      e.assigneeIds.some((id) => activeFilter.includes(id))
    );
  }, [events, activeFilter]);

  // Today events
  const todayEvents = filtered
    .filter((e) => e.date === todayISO)
    .sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );

  // Upcoming (next 7 days, not today)
  const upcoming = filtered
    .filter((e) => {
      const d = parseISODate(e.date);
      const diff = Math.round(
        (d.getTime() - new Date(todayISO).getTime()) / (24 * 3600 * 1000)
      );
      return diff > 0 && diff <= 7;
    })
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });

  // Overdue: past events with incomplete checklist
  const overdue = filtered.filter((e) => {
    const d = parseISODate(e.date);
    return (
      d < new Date(todayISO) &&
      e.checklist.length > 0 &&
      e.checklist.some((c) => !c.done)
    );
  });

  const openItemsToday = todayEvents.reduce(
    (acc, e) => acc + e.checklist.filter((c) => !c.done).length,
    0
  );

  return (
    <aside className="w-80 shrink-0 border-l border-white/5 bg-background/60 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-white/5">
        <div className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-3">
          Today's focus
        </div>
        <div className="flex items-end gap-3">
          <div className="text-3xl font-black tracking-tight tabular-nums">
            {openItemsToday}
          </div>
          <div className="text-xs text-muted-foreground pb-1.5">
            open checklist item{openItemsToday === 1 ? "" : "s"}
            <br />
            across {todayEvents.length} event{todayEvents.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bb-scroll">
        {overdue.length > 0 && (
          <Section
            icon={<AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
            title="Overdue"
            tone="destructive"
          >
            {overdue.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                members={memberMap}
                onToggleItem={onToggleItem}
                onOpenEvent={onOpenEvent}
              />
            ))}
          </Section>
        )}

        <Section
          icon={<CircleDashed className="w-3.5 h-3.5 text-primary" />}
          title="Today"
        >
          {todayEvents.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              Nothing scheduled today.
            </div>
          ) : (
            todayEvents.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                members={memberMap}
                onToggleItem={onToggleItem}
                onOpenEvent={onOpenEvent}
              />
            ))
          )}
        </Section>

        {upcoming.length > 0 && (
          <Section
            icon={<CheckCircle2 className="w-3.5 h-3.5 text-secondary" />}
            title="Next 7 days"
          >
            {upcoming.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                members={memberMap}
                onToggleItem={onToggleItem}
                onOpenEvent={onOpenEvent}
                showDate
              />
            ))}
          </Section>
        )}
      </div>
    </aside>
  );
}

function Section({
  title,
  icon,
  children,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  tone?: "destructive";
}) {
  return (
    <div className="border-b border-white/5">
      <div
        className={cn(
          "flex items-center gap-2 px-5 py-3 text-[10px] font-bold tracking-[0.2em] uppercase",
          tone === "destructive" ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {icon}
        {title}
      </div>
      <div className="px-3 pb-3 space-y-2">{children}</div>
    </div>
  );
}

function EventCard({
  event,
  members,
  onToggleItem,
  onOpenEvent,
  showDate,
}: {
  event: CalendarEvent;
  members: Map<string, Member>;
  onToggleItem: (eventId: string, itemId: string) => void;
  onOpenEvent: (e: CalendarEvent) => void;
  showDate?: boolean;
}) {
  const assignees = event.assigneeIds
    .map((id) => members.get(id))
    .filter(Boolean) as Member[];
  const primary = assignees[0]?.color ?? "#8b5cf6";
  const done = event.checklist.filter((c) => c.done).length;
  const total = event.checklist.length;
  const openItems = event.checklist.filter((c) => !c.done);
  const dateLabel = showDate
    ? parseISODate(event.date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="bb-glass rounded-xl p-3">
      <button
        type="button"
        onClick={() => onOpenEvent(event)}
        className="w-full text-left"
      >
        <div className="flex items-start gap-2">
          <div
            className="w-1 self-stretch rounded-full shrink-0"
            style={{ background: primary, boxShadow: `0 0 8px ${primary}` }}
          />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{event.title}</div>
            <div className="text-[11px] text-muted-foreground font-mono">
              {dateLabel && <span>{dateLabel} · </span>}
              {formatTimeLabel(event.startTime)} –{" "}
              {formatTimeLabel(event.endTime)}
              {total > 0 && (
                <span>
                  {" · "}
                  {done}/{total}
                </span>
              )}
            </div>
          </div>
          {assignees.length > 0 && (
            <div className="flex -space-x-1.5 shrink-0">
              {assignees.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="w-5 h-5 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ background: a.color }}
                  title={a.name}
                >
                  {a.initials}
                </div>
              ))}
            </div>
          )}
        </div>
      </button>

      {openItems.length > 0 && (
        <div className="mt-3 pt-2 border-t border-white/5 space-y-1">
          {openItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => onToggleItem(event.id, item.id)}
              className="w-full flex items-center gap-2 py-1 text-left group"
            >
              <div className="w-4 h-4 rounded border border-white/20 group-hover:border-primary/70 flex items-center justify-center shrink-0 transition-colors">
                <Check className="w-2.5 h-2.5 opacity-0 group-hover:opacity-40 transition-opacity" />
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate">
                {item.text}
              </span>
            </button>
          ))}
          {openItems.length > 4 && (
            <div className="text-[10px] text-muted-foreground pl-6">
              + {openItems.length - 4} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}
