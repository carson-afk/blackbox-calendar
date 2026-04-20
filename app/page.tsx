"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckSquare,
  Users,
  Layers,
  Zap,
  LockKeyhole,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CinematicFooter } from "@/components/ui/motion-footer";

const FEATURES = [
  {
    icon: CalendarDays,
    title: "Shared team calendar",
    body: "See every person's day on one grid. Week, day, or month. Filter by teammate with one click.",
  },
  {
    icon: CheckSquare,
    title: "Live checklists per event",
    body: "Every event carries its own checklist. Check off work as it gets done. Status updates instantly for everyone.",
  },
  {
    icon: Users,
    title: "Built for working crews",
    body: "Assign jobs to people, not just to days. Know exactly who's doing what, where, and when.",
  },
  {
    icon: Layers,
    title: "No missed handoffs",
    body: "Blocked items and open tasks stay visible until they're closed. Nothing slips through the cracks.",
  },
  {
    icon: Zap,
    title: "Fast by default",
    body: "Keyboard-friendly. One-click event creation. Your data stays on your device until you connect a backend.",
  },
  {
    icon: LockKeyhole,
    title: "Your data, your control",
    body: "Local-first storage out of the box. Add a database when you're ready to sync across devices.",
  },
];

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Sticky top nav */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 md:px-10 py-5 flex items-center justify-between bg-background/70 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-md border border-primary/60 flex items-center justify-center">
            <div className="w-3 h-3 rounded-sm bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
          </div>
          <span className="font-black tracking-tight text-lg">
            BLACKBOX
            <span className="text-muted-foreground font-light"> / Calendar</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how" className="hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#why" className="hover:text-foreground transition-colors">
            Why Blackbox
          </a>
        </nav>
        <Link href="/workspace">
          <Button size="sm" className="gap-2">
            Launch <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </header>

      {/* Main landing content */}
      <main className="relative z-10 w-full bg-background">
        {/* Hero */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
          <div className="absolute inset-0 bb-grid bb-grid-fade pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bb-aurora opacity-80 animate-glow-pulse pointer-events-none" />

          <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 text-xs tracking-widest text-muted-foreground uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Team scheduling, reimagined
            </div>

            <h1 className="bb-text-glow text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-6">
              One calendar.
              <br />
              The whole crew.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              Blackbox Calendar is a shared workspace for working teams. See
              what every person is doing, what they still have to do, and check
              work off as it gets done.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link href="/workspace">
                <Button size="lg" className="gap-2 group">
                  Open Workspace
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="gap-2">
                  See features
                </Button>
              </a>
            </div>

            {/* Mini mock panel */}
            <div className="mt-20 w-full max-w-3xl bb-glass rounded-2xl p-6 text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
                    Today · Live View
                  </span>
                </div>
                <div className="flex -space-x-2">
                  {["C", "A", "J", "S"].map((ch, i) => (
                    <div
                      key={ch}
                      className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                      style={{
                        background: [
                          "#8b5cf6",
                          "#3b82f6",
                          "#10b981",
                          "#ec4899",
                        ][i],
                      }}
                    >
                      {ch}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <MockEvent
                  color="#8b5cf6"
                  time="9:00 AM"
                  title="Site walkthrough - Henderson St"
                  done={2}
                  total={3}
                />
                <MockEvent
                  color="#3b82f6"
                  time="10:30 AM"
                  title="Prep and mask - Rutherford job"
                  done={4}
                  total={6}
                />
                <MockEvent
                  color="#10b981"
                  time="1:00 PM"
                  title="Client estimate call"
                  done={1}
                  total={2}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="relative py-32 px-6 border-t border-white/5"
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <div className="inline-block text-xs tracking-[0.3em] text-primary font-semibold uppercase mb-4">
                What it does
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight bb-text-glow">
                Everything your team
                <br />
                needs in one place.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="bb-glass bb-glass-hover rounded-2xl p-6 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how"
          className="relative py-32 px-6 border-t border-white/5"
        >
          <div className="max-w-5xl mx-auto">
            <div className="mb-16">
              <div className="text-xs tracking-[0.3em] text-primary font-semibold uppercase mb-4">
                How it works
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight bb-text-glow">
                Three steps to a
                <br />
                coordinated team.
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  n: "01",
                  title: "Add your team",
                  body: "Drop in each person with a role and a color. They'll show up as filterable chips across the whole calendar.",
                },
                {
                  n: "02",
                  title: "Schedule the work",
                  body: "Click any time slot to create an event. Assign one or more teammates. Add a checklist of what has to get done.",
                },
                {
                  n: "03",
                  title: "Check it off",
                  body: "As work completes, check items. Events flip from In Progress to Done. Everyone sees the same state.",
                },
              ].map((step) => (
                <div
                  key={step.n}
                  className="bb-glass rounded-2xl p-6 md:p-8 flex gap-6 items-start"
                >
                  <div className="text-5xl md:text-6xl font-black text-primary/30 font-mono shrink-0 w-20">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link href="/workspace">
                <Button size="lg" className="gap-2 group">
                  Launch your workspace
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-4">
                No signup required. Your data stays on this device.
              </p>
            </div>
          </div>
        </section>

        {/* Why */}
        <section
          id="why"
          className="relative py-32 px-6 border-t border-white/5"
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs tracking-[0.3em] text-primary font-semibold uppercase mb-4">
              Why Blackbox
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight bb-text-glow mb-6">
              Calendar apps schedule time.
              <br />
              Blackbox runs the work.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Every event has a purpose, a person, and a checklist of what has
              to happen inside of it. That's the difference. You aren't looking
              at blocks of time. You're looking at the work itself.
            </p>
          </div>
        </section>
      </main>

      {/* Cinematic footer */}
      <CinematicFooter />
    </div>
  );
}

function MockEvent({
  color,
  time,
  title,
  done,
  total,
}: {
  color: string;
  time: string;
  title: string;
  done: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
      <div
        className="w-1 h-8 rounded-full shrink-0"
        style={{ background: color, boxShadow: `0 0 12px ${color}` }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{title}</div>
        <div className="text-xs text-muted-foreground font-mono">{time}</div>
      </div>
      <div className="text-xs font-mono text-muted-foreground shrink-0">
        {done}/{total}
      </div>
    </div>
  );
}
