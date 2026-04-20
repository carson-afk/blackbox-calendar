"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { AppState, CalendarEvent, Member } from "@/lib/types";
import { loadState, saveState } from "@/lib/storage";
import { getSeedState, createMember } from "@/lib/seed";
import { addDays, startOfWeek, toISODate } from "@/lib/date";
import { uid } from "@/lib/utils";
import { TopBar } from "@/components/workspace/top-bar";
import { TeamSidebar } from "@/components/workspace/team-sidebar";
import { WeekCalendar } from "@/components/workspace/week-calendar";
import { EventModal } from "@/components/workspace/event-modal";
import { MemberModal } from "@/components/workspace/member-modal";
import { TaskPanel } from "@/components/workspace/task-panel";

export default function WorkspacePage() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<AppState>(() => getSeedState());

  // Week start (Monday)
  const [weekStart, setWeekStart] = useState<Date>(() =>
    startOfWeek(new Date(), 1)
  );
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  const [search, setSearch] = useState("");

  // Event modal
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventDefaults, setEventDefaults] = useState<
    { date: string; startTime: string } | undefined
  >(undefined);

  // Member modal
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Hydrate from storage on client
  useEffect(() => {
    const saved = loadState();
    if (saved) setState(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  // Filtered by search
  const visibleEvents = useMemo(() => {
    if (!search.trim()) return state.events;
    const q = search.toLowerCase();
    return state.events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.notes ?? "").toLowerCase().includes(q) ||
        (e.location ?? "").toLowerCase().includes(q) ||
        e.checklist.some((c) => c.text.toLowerCase().includes(q))
    );
  }, [state.events, search]);

  // Actions
  const openNewEvent = (date?: string, startTime?: string) => {
    setEditingEvent(null);
    setEventDefaults({
      date: date ?? toISODate(new Date()),
      startTime: startTime ?? "09:00",
    });
    setEventModalOpen(true);
  };

  const openEditEvent = (e: CalendarEvent) => {
    setEditingEvent(e);
    setEventDefaults(undefined);
    setEventModalOpen(true);
  };

  const handleSaveEvent = useCallback((saved: CalendarEvent) => {
    setState((prev) => {
      const existing = prev.events.find((x) => x.id === saved.id);
      return {
        ...prev,
        events: existing
          ? prev.events.map((x) => (x.id === saved.id ? saved : x))
          : [...prev.events, saved],
      };
    });
    setEventModalOpen(false);
  }, []);

  const handleDeleteEvent = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }));
    setEventModalOpen(false);
  }, []);

  const handleToggleItem = useCallback(
    (eventId: string, itemId: string) => {
      setState((prev) => ({
        ...prev,
        events: prev.events.map((e) => {
          if (e.id !== eventId) return e;
          const updatedChecklist = e.checklist.map((c) =>
            c.id === itemId ? { ...c, done: !c.done } : c
          );
          const allDone =
            updatedChecklist.length > 0 &&
            updatedChecklist.every((c) => c.done);
          return {
            ...e,
            checklist: updatedChecklist,
            status: allDone
              ? "done"
              : e.status === "done"
                ? "in_progress"
                : e.status,
          };
        }),
      }));
    },
    []
  );

  const handleToggleFilter = (memberId: string) => {
    setState((prev) => ({
      ...prev,
      activeMemberFilter: prev.activeMemberFilter.includes(memberId)
        ? prev.activeMemberFilter.filter((id) => id !== memberId)
        : [...prev.activeMemberFilter, memberId],
    }));
  };

  const handleClearFilter = () => {
    setState((prev) => ({ ...prev, activeMemberFilter: [] }));
  };

  const openAddMember = () => {
    setEditingMember(null);
    setMemberModalOpen(true);
  };

  const openEditMember = (m: Member) => {
    setEditingMember(m);
    setMemberModalOpen(true);
  };

  const handleSaveMember = (
    data: Omit<Member, "id" | "initials"> & {
      id?: string;
      initials?: string;
    }
  ) => {
    setState((prev) => {
      if (data.id) {
        return {
          ...prev,
          members: prev.members.map((m) =>
            m.id === data.id
              ? {
                  ...m,
                  name: data.name,
                  role: data.role,
                  color: data.color,
                  initials: deriveInitials(data.name),
                }
              : m
          ),
        };
      }
      const newM = createMember({
        name: data.name,
        role: data.role,
        color: data.color,
      });
      return { ...prev, members: [...prev.members, newM] };
    });
    setMemberModalOpen(false);
  };

  const handleDeleteMember = (id: string) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
      activeMemberFilter: prev.activeMemberFilter.filter((x) => x !== id),
      events: prev.events.map((e) => ({
        ...e,
        assigneeIds: e.assigneeIds.filter((x) => x !== id),
      })),
    }));
    setMemberModalOpen(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Background ambience */}
      <div className="pointer-events-none fixed inset-0 bb-grid bb-grid-fade opacity-60" />
      <div className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 w-[90vw] h-[50vh] bb-aurora opacity-30" />

      <div className="relative z-10 flex flex-col h-full">
        <TopBar
          weekStart={weekStart}
          weekEnd={weekEnd}
          onPrev={() => setWeekStart((d) => addDays(d, -7))}
          onNext={() => setWeekStart((d) => addDays(d, 7))}
          onToday={() => setWeekStart(startOfWeek(new Date(), 1))}
          onNewEvent={() => openNewEvent()}
          search={search}
          onSearch={setSearch}
        />

        <div className="flex-1 flex overflow-hidden">
          <TeamSidebar
            members={state.members}
            events={state.events}
            filter={state.activeMemberFilter}
            onToggleFilter={handleToggleFilter}
            onClearFilter={handleClearFilter}
            onAddMember={openAddMember}
            onEditMember={openEditMember}
          />

          <main className="flex-1 flex flex-col overflow-hidden">
            <WeekCalendar
              weekStart={weekStart}
              events={visibleEvents}
              members={state.members}
              activeFilter={state.activeMemberFilter}
              onSelectEvent={openEditEvent}
              onCreateAt={(date, startTime) => openNewEvent(date, startTime)}
            />
          </main>

          <TaskPanel
            events={visibleEvents}
            members={state.members}
            activeFilter={state.activeMemberFilter}
            onToggleItem={handleToggleItem}
            onOpenEvent={openEditEvent}
          />
        </div>
      </div>

      <EventModal
        open={eventModalOpen}
        members={state.members}
        event={editingEvent}
        defaults={eventDefaults}
        onClose={() => setEventModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={editingEvent ? handleDeleteEvent : undefined}
      />

      <MemberModal
        open={memberModalOpen}
        member={editingMember}
        onClose={() => setMemberModalOpen(false)}
        onSave={handleSaveMember}
        onDelete={editingMember ? handleDeleteMember : undefined}
      />
    </div>
  );
}

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
