export function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function startOfWeek(date: Date, weekStartsOn = 1): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = (d.getDay() - weekStartsOn + 7) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function daysOfWeek(start: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function formatRange(start: Date, end: Date): string {
  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();
  const monthShort = (d: Date) =>
    d.toLocaleString("en-US", { month: "short" });
  if (sameMonth && sameYear) {
    return `${monthShort(start)} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
  }
  if (sameYear) {
    return `${monthShort(start)} ${start.getDate()} – ${monthShort(end)} ${end.getDate()}, ${start.getFullYear()}`;
  }
  return `${monthShort(start)} ${start.getDate()}, ${start.getFullYear()} – ${monthShort(end)} ${end.getDate()}, ${end.getFullYear()}`;
}

export function formatDayHeader(d: Date): { day: string; num: number } {
  return {
    day: d.toLocaleString("en-US", { weekday: "short" }).toUpperCase(),
    num: d.getDate(),
  };
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatTimeLabel(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  if (m === 0) return `${h12} ${period}`;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}
