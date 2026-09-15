import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { FormComponentType } from "./types";
import type { LucideIcon } from "lucide-react";

interface PaletteItemProps {
  type: FormComponentType;
  label: string;
  icon: LucideIcon;
}

export default function PaletteItem(props: PaletteItemProps) {
  var draggable = useDraggable({
    id: "palette-" + props.type,
    data: { source: "palette", type: props.type }
  });

  var Icon = props.icon;

  var style: React.CSSProperties = {
    transform: draggable.transform ? CSS.Translate.toString(draggable.transform) : undefined,
    opacity: draggable.isDragging ? 0.4 : 1
  };

  return (
    <div
      ref={draggable.setNodeRef}
      style={style}
      {...draggable.listeners}
      {...draggable.attributes}
      className="flex items-center gap-2.5 rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground cursor-grab select-none transition-colors hover:border-primary/40 hover:bg-accent active:cursor-grabbing"
    >
      <Icon className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
      {props.label}
    </div>
  );
}
