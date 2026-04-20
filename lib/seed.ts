import type { AppState, Member } from "./types";
import { uid } from "./utils";
import { toISODate } from "./date";

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function createMember(
  partial: Omit<Member, "id" | "initials"> & { initials?: string }
): Member {
  return {
    id: uid("m_"),
    initials: partial.initials ?? deriveInitials(partial.name),
    ...partial,
  };
}

export function getSeedState(): AppState {
  const me = createMember({
    name: "Carson Peters",
    role: "Owner",
    color: "#8b5cf6",
  });

  const today = new Date();
  const todayISO = toISODate(today);

  return {
    members: [me],
    currentUserId: me.id,
    activeMemberFilter: [],
    events: [
      {
        id: uid("e_"),
        title: "Welcome to Blackbox",
        notes:
          "This is your workspace. Click any time slot to drop in a new event. Every event can carry its own checklist. Add teammates from the left sidebar.",
        date: todayISO,
        startTime: "09:00",
        endTime: "10:00",
        assigneeIds: [me.id],
        checklist: [
          { id: uid("c_"), text: "Add your teammates", done: false },
          { id: uid("c_"), text: "Create your first event", done: false },
          { id: uid("c_"), text: "Check something off this list", done: false },
        ],
        status: "in_progress",
        location: "",
      },
    ],
  };
}
