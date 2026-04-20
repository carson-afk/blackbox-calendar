"use client";

import React, { useMemo, useRef } from "react";
import type { CalendarEvent, Member } from "@/lib/types";
import {
  daysOfWeek,
  formatDayHeader,
  formatTimeLabel,
  isSameDay,
  minutesToTime,
  timeToMinutes,
  toISODate,
} from "@/lib/date";
import { cn } from "@/lib/utils";

const DAY_START_MIN = 6 * 60; // 6 AM
const DAY_END_MIN = 22 * 60; // 10 PM
const HOUR_ROWS = (DAY_END_MIN - DAY_START_MIN) / 60; // 16
const PX_PER_HOUR = 56;

type WeekCalendarProps = {
  weekStart: Date;
  events: CalendarEvent[];
  members: Member[];
  activeFilter: string[];
  onSelectEvent: (e: CalendarEvent) => void;
  onCreateAt: (date: string, startTime: string) => void;
};

export function WeekCalendar({
  weekStart,
  events,
  members,
  activeFilter,
  onSelectEvent,
  onCreateAt,
}: WeekCalendarProps) {
  const days = useMemo(() => daysOfWeek(weekStart), [weekStart]);
  const today = new Date();
  const memberMap = useMemo(() => {
    const m = new Map<string, Member>();
    members.forEach((mm) => m.set(mm.id, mm));
    return m;
  }, [members]);

  const gridRef = useRef<HTMLDivElement>(null);

  const filteredEvents = useMemo(() => {
    if (activeFilter.length === 0) return events;
    return events.filter((e) =>
      e.assigneeIds.some((id) => activeFilter.includes(id))
    );
  }, [events, activeFilter]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of filteredEvents) {
      const list = map.get(ev.date) ?? [];
      list.push(ev);
      map.set(ev.date, list);
    }
    return map;
  }, [filteredEvents]);

  const handleEmptyClick = (
    e: React.MouseEvent<HTMLDivElement>,
    date: string
  ) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const totalMin =
      DAY_START_MIN + Math.round((relY / PX_PER_HOUR) * 60 / 15) * 15;
    const clamped = Math.max(DAY_START_MIN, Math.min(DAY_END_MIN - 30, totalMin));
    onCreateAt(date, minutesToTime(clamped));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-white/5 bg-background/60 backdrop-blur-sm">
        <div className="h-16" />
        {days.map((d) => {
          const isToday = isSameDay(d, today);
          const { day, num } = formatDayHeader(d);
          return (
            <div
              key={d.toISOString()}
              className={cn(
                "h-16 flex flex-col items-center justify-center border-l border-white/5",
                isToday && "bg-primary/5"
              )}
            >
              <div
                className={cn(
                  "text-[10px] font-bold tracking-[0.2em] uppercase",
                  isToday ? "text-primary" : "text-muted-foreground"
                )}
              >
                {day}
              </div>
              <div
                className={cn(
                  "mt-1 text-xl font-bold flex items-center justify-center rounded-full w-8 h-8",
                  isToday
                    ? "bg-primary text-primary-foreground shadow-[0_0_16px_hsl(var(--primary)/0.6)]"
                    : "text-foreground"
                )}
              >
                {num}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        className="flex-1 overflow-y-auto bb-scroll relative"
      >
        <div
          className="grid grid-cols-[64px_repeat(7,1fr)] relative"
          style={{ height: `${HOUR_ROWS * PX_PER_HOUR}px` }}
        >
          {/* Time column */}
          <div className="relative border-r border-white/5">
            {Array.from({ length: HOUR_ROWS }).map((_, i) => {
              const min = DAY_START_MIN + i * 60;
              return (
                <div
                  key={i}
                  className="absolute left-0 right-0 text-[10px] font-mono text-muted-foreground/70 tracking-wider pr-2 text-right"
                  style={{
                    top: `${i * PX_PER_HOUR - 6}px`,
                  }}
                >
                  {i === 0 ? "" : formatTimeLabel(minutesToTime(min))}
                </div>
              );
            })}
          </div>

          {/* Day columns */}
          {days.map((d) => {
            const iso = toISODate(d);
            const dayEvents = eventsByDate.get(iso) ?? [];
            const isToday = isSameDay(d, today);
            return (
              <DayColumn
                key={iso}
                iso={iso}
                isToday={isToday}
                events={dayEvents}
                members={memberMap}
                onEmptyClick={handleEmptyClick}
                onSelectEvent={onSelectEvent}
              />
            );
          })}

          {/* Now-line overlay */}
          <NowLine weekStart={weekStart} />
        </div>
      </div>
    </div>
  );
}

function DayColumn({
  iso,
  isToday,
  events,
  members,
  onEmptyClick,
  onSelectEvent,
}: {
  iso: string;
  isToday: boolean;
  events: CalendarEvent[];
  members: Map<string, Member>;
  onEmptyClick: (e: React.MouseEvent<HTMLDivElement>, date: string) => void;
  onSelectEvent: (e: CalendarEvent) => void;
}) {
  // Lay out events with simple overlap columns
  const positioned = useMemo(() => {
    const sorted = [...events].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );
    const cols: CalendarEvent[][] = [];
    const assignments = new Map<string, number>();
    for (const ev of sorted) {
      const start = timeToMinutes(ev.startTime);
      const end = timeToMinutes(ev.endTime);
      let placed = false;
      for (let ci = 0; ci < cols.length; ci++) {
        const last = cols[ci][cols[ci].length - 1];
        if (last && timeToMinutes(last.endTime) <= start) {
          cols[ci].push(ev);
          assignments.set(ev.id, ci);
          placed = true;
          break;
        }
      }
      if (!placed) {
        cols.push([ev]);
        assignments.set(ev.id, cols.length - 1);
      }
      void end;
    }
    const total = Math.max(cols.length, 1);
    return sorted.map((ev) => ({
      event: ev,
      col: assignments.get(ev.id) ?? 0,
      total,
    }));
  }, [events]);

  return (
    <div
      className={cn(
        "relative border-l border-white/5",
        isToday && "bg-primary/[0.02]"
      )}
    >
      {/* Hour lines */}
      {Array.from({ length: HOUR_ROWS }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 border-t border-white/[0.04]"
          style={{ top: `${i * PX_PER_HOUR}px` }}
        />
      ))}

      {/* Click layer */}
      <div
        className="absolute inset-0 cursor-cell"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onEmptyClick(e, iso);
          }
        }}
        onDoubleClick={(e) => onEmptyClick(e, iso)}
      />

      {/* Events */}
      {positioned.map(({ event, col, total }) => {
        const start = timeToMinutes(event.startTime);
        const end = timeToMinutes(event.endTime);
        const top = ((start - DAY_START_MIN) / 60) * PX_PER_HOUR;
        const height = Math.max(((end - start) / 60) * PX_PER_HOUR, 28);
        const widthPct = 100 / total;
        const leftPct = col * widthPct;

        const assignees = event.assigneeIds
          .map((id) => members.get(id))
          .filter(Boolean) as Member[];
        const primaryColor = assignees[0]?.color ?? "#8b5cf6";

        const doneCount = event.checklist.filter((c) => c.done).length;
        const totalCount = event.checklist.length;
        const isDone = totalCount > 0 && doneCount === totalCount;

        return (
          <button
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectEvent(event);
            }}
            className="bb-event absolute rounded-md overflow-hidden text-left group"
            style={{
              top: `${top}px`,
              height: `${height}px`,
              left: `calc(${leftPct}% + 4px)`,
              width: `calc(${widthPct}% - 8px)`,
              background: `linear-gradient(135deg, ${primaryColor}22, ${primaryColor}11)`,
              borderLeft: `3px solid ${primaryColor}`,
              boxShadow: `0 6px 20px -10px ${primaryColor}80`,
              opacity: isDone ? 0.7 : 1,
            }}
          >
            <div className="p-2 h-full flex flex-col">
              <div
                className={cn(
                  "text-[11px] font-semibold leading-tight line-clamp-2",
                  isDone && "line-through text-muted-foreground"
                )}
              >
                {event.title}
              </div>
              {height > 44 && (
                <div className="mt-auto flex items-center justify-between gap-1 pt-1">
                  <div className="text-[10px] font-mono text-muted-foreground truncate">
                    {formatTimeLabel(event.startTime)}
                  </div>
                  {totalCount > 0 && (
                    <div className="text-[10px] font-mono text-muted-foreground shrink-0">
                      {doneCount}/{totalCount}
                    </div>
                  )}
                </div>
              )}
              {height > 80 && assignees.length > 0 && (
                <div className="flex -space-x-1.5 mt-1">
                  {assignees.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      className="w-5 h-5 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: a.color }}
                      title={a.name}
                    >
                      {a.initials}
                    </div>
                  ))}
                  {assignees.length > 4 && (
                    <div className="w-5 h-5 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold bg-white/10 text-white">
                      +{assignees.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function NowLine({ weekStart }: { weekStart: Date }) {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  if (!now) return null;

  const week = daysOfWeek(weekStart);
  const dayIdx = week.findIndex((d) => isSameDay(d, now));
  if (dayIdx === -1) return null;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  if (nowMin < DAY_START_MIN || nowMin > DAY_END_MIN) return null;
  const top = ((nowMin - DAY_START_MIN) / 60) * PX_PER_HOUR;
  const leftPct = (64 / 1) + 0; // time column width
  const colBasis = `calc((100% - 64px) / 7)`;
  return (
    <div
      className="absolute pointer-events-none z-10"
      style={{
        top: `${top}px`,
        left: `calc(64px + ${colBasis} * ${dayIdx})`,
        width: colBasis,
        height: 2,
      }}
    >
      <div className="relative h-[2px] bg-primary/80 shadow-[0_0_12px_hsl(var(--primary))]">
        <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
      </div>
    </div>
  );
}
