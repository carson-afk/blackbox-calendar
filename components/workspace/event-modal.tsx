"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, X, Check, MapPin } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CalendarEvent, ChecklistItem, Member } from "@/lib/types";
import { uid } from "@/lib/utils";
import { cn } from "@/lib/utils";

type EventModalProps = {
  open: boolean;
  members: Member[];
  event: CalendarEvent | null;
  defaults?: { date: string; startTime: string };
  onClose: () => void;
  onSave: (e: CalendarEvent) => void;
  onDelete?: (id: string) => void;
};

const STATUSES: { value: CalendarEvent["status"]; label: string; color: string }[] =
  [
    { value: "planned", label: "Planned", color: "bg-white/10 text-foreground" },
    {
      value: "in_progress",
      label: "In Progress",
      color: "bg-primary/20 text-primary",
    },
    {
      value: "blocked",
      label: "Blocked",
      color: "bg-destructive/20 text-destructive",
    },
    { value: "done", label: "Done", color: "bg-emerald-500/20 text-emerald-400" },
  ];

export function EventModal({
  open,
  members,
  event,
  defaults,
  onClose,
  onSave,
  onDelete,
}: EventModalProps) {
  const isNew = !event;

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [status, setStatus] = useState<CalendarEvent["status"]>("planned");
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    if (!open) return;
    if (event) {
      setTitle(event.title);
      setNotes(event.notes ?? "");
      setDate(event.date);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setLocation(event.location ?? "");
      setAssigneeIds(event.assigneeIds);
      setChecklist(event.checklist);
      setStatus(event.status);
    } else {
      setTitle("");
      setNotes("");
      setDate(defaults?.date ?? new Date().toISOString().slice(0, 10));
      setStartTime(defaults?.startTime ?? "09:00");
      // auto 1h duration
      const [h, m] = (defaults?.startTime ?? "09:00").split(":").map(Number);
      const endH = String((h + 1) % 24).padStart(2, "0");
      const endM = String(m).padStart(2, "0");
      setEndTime(`${endH}:${endM}`);
      setLocation("");
      setAssigneeIds(members[0] ? [members[0].id] : []);
      setChecklist([]);
      setStatus("planned");
    }
    setNewItem("");
  }, [open, event, defaults, members]);

  const completion = useMemo(() => {
    if (checklist.length === 0) return 0;
    return Math.round(
      (checklist.filter((c) => c.done).length / checklist.length) * 100
    );
  }, [checklist]);

  const addItem = () => {
    if (!newItem.trim()) return;
    setChecklist((prev) => [
      ...prev,
      { id: uid("c_"), text: newItem.trim(), done: false },
    ]);
    setNewItem("");
  };

  const toggleAssignee = (id: string) => {
    setAssigneeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c))
    );
  };

  const removeItem = (id: string) => {
    setChecklist((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const nextStatus: CalendarEvent["status"] =
      checklist.length > 0 && checklist.every((c) => c.done)
        ? "done"
        : status;

    const saved: CalendarEvent = {
      id: event?.id ?? uid("e_"),
      title: title.trim(),
      notes: notes.trim(),
      date,
      startTime,
      endTime,
      assigneeIds,
      checklist,
      status: nextStatus,
      location: location.trim(),
    };
    onSave(saved);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      widthClass="max-w-2xl"
      title={isNew ? "New event" : "Edit event"}
      description={
        isNew
          ? "Schedule a block of work. Add a checklist of what has to happen inside of it."
          : undefined
      }
    >
      <div className="space-y-5 max-h-[70vh] overflow-y-auto bb-scroll -mx-1 px-1">
        {/* Title */}
        <div>
          <label className="text-[11px] tracking-widest font-bold uppercase text-muted-foreground block mb-1.5">
            Title
          </label>
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to get done?"
            className="text-base font-medium"
          />
        </div>

        {/* Date / time */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] tracking-widest font-bold uppercase text-muted-foreground block mb-1.5">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] tracking-widest font-bold uppercase text-muted-foreground block mb-1.5">
              Start
            </label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] tracking-widest font-bold uppercase text-muted-foreground block mb-1.5">
              End
            </label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-[11px] tracking-widest font-bold uppercase text-muted-foreground block mb-1.5">
            Location
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              className="pl-9"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Optional address or room"
            />
          </div>
        </div>

        {/* Assignees */}
        <div>
          <label className="text-[11px] tracking-widest font-bold uppercase text-muted-foreground block mb-2">
            Assigned to
          </label>
          {members.length === 0 ? (
            <div className="text-sm text-muted-foreground py-2">
              Add teammates from the sidebar first.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {members.map((m) => {
                const selected = assigneeIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleAssignee(m.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-sm",
                      selected
                        ? "border-primary/60 bg-primary/10 text-foreground"
                        : "border-white/10 bg-white/[0.02] text-muted-foreground hover:bg-white/5"
                    )}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: m.color }}
                    >
                      {m.initials}
                    </div>
                    {m.name}
                    {selected && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="text-[11px] tracking-widest font-bold uppercase text-muted-foreground block mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatus(s.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                  status === s.value
                    ? s.color + " ring-1 ring-white/20"
                    : "bg-white/[0.02] text-muted-foreground hover:bg-white/5"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] tracking-widest font-bold uppercase text-muted-foreground">
              Checklist
            </label>
            {checklist.length > 0 && (
              <span className="text-[11px] font-mono text-muted-foreground">
                {checklist.filter((c) => c.done).length}/{checklist.length} ·{" "}
                {completion}%
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5 group"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    "w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all border",
                    item.done
                      ? "bg-primary border-primary"
                      : "border-white/20 hover:border-white/40"
                  )}
                  aria-label={item.done ? "Mark undone" : "Mark done"}
                >
                  {item.done && <Check className="w-3 h-3 text-primary-foreground" />}
                </button>
                <span
                  className={cn(
                    "flex-1 text-sm",
                    item.done && "line-through text-muted-foreground"
                  )}
                >
                  {item.text}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addItem();
                }
              }}
              placeholder="Add a checklist item..."
            />
            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="shrink-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-[11px] tracking-widest font-bold uppercase text-muted-foreground block mb-1.5">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Details, prep, anything worth remembering..."
            className={cn(
              "w-full rounded-md border border-border bg-black/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            )}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/5">
        <div>
          {!isNew && onDelete && event && (
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm(`Delete "${event.title}"?`)) {
                  onDelete(event.id);
                }
              }}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {isNew ? "Create event" : "Save changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
