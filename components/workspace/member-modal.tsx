"use client";

import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Member } from "@/lib/types";
import { MEMBER_COLORS } from "@/lib/types";
import { cn } from "@/lib/utils";

type MemberModalProps = {
  open: boolean;
  member: Member | null;
  onClose: () => void;
  onSave: (m: Omit<Member, "id" | "initials"> & { id?: string; initials?: string }) => void;
  onDelete?: (id: string) => void;
};

export function MemberModal({
  open,
  member,
  onClose,
  onSave,
  onDelete,
}: MemberModalProps) {
  const isNew = !member;
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [color, setColor] = useState(MEMBER_COLORS[0]);

  useEffect(() => {
    if (!open) return;
    if (member) {
      setName(member.name);
      setRole(member.role);
      setColor(member.color);
    } else {
      setName("");
      setRole("");
      setColor(MEMBER_COLORS[Math.floor(Math.random() * MEMBER_COLORS.length)]);
    }
  }, [open, member]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: member?.id,
      name: name.trim(),
      role: role.trim() || "Teammate",
      color,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? "Add teammate" : "Edit teammate"}
      widthClass="max-w-md"
    >
      <div className="space-y-4">
        <div>
          <label className="text-[11px] tracking-widest font-bold uppercase text-muted-foreground block mb-1.5">
            Name
          </label>
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First and last name"
          />
        </div>
        <div>
          <label className="text-[11px] tracking-widest font-bold uppercase text-muted-foreground block mb-1.5">
            Role
          </label>
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Installer, Project Manager"
          />
        </div>
        <div>
          <label className="text-[11px] tracking-widest font-bold uppercase text-muted-foreground block mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {MEMBER_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={cn(
                  "w-9 h-9 rounded-full transition-all ring-2",
                  color === c ? "ring-white/60 scale-110" : "ring-transparent"
                )}
                style={{ background: c, boxShadow: `0 0 12px ${c}80` }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/5">
        <div>
          {!isNew && onDelete && member && (
            <Button
              variant="ghost"
              onClick={() => {
                if (
                  confirm(
                    `Remove ${member.name}? They'll be unassigned from all events.`
                  )
                ) {
                  onDelete(member.id);
                }
              }}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {isNew ? "Add teammate" : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
