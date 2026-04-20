export type Member = {
  id: string;
  name: string;
  role: string;
  color: string;
  initials: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

export type EventStatus = "planned" | "in_progress" | "blocked" | "done";

export type CalendarEvent = {
  id: string;
  title: string;
  notes?: string;
  date: string; // ISO date "YYYY-MM-DD"
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  assigneeIds: string[];
  checklist: ChecklistItem[];
  status: EventStatus;
  location?: string;
};

export type AppState = {
  members: Member[];
  events: CalendarEvent[];
  activeMemberFilter: string[]; // empty array = show all
  currentUserId: string | null;
};

export const MEMBER_COLORS = [
  "#8b5cf6", // violet
  "#3b82f6", // blue
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#a855f7", // purple
  "#14b8a6", // teal
  "#f97316", // orange
];
