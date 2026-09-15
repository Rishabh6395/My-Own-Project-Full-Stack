import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import type { FormComponent } from "./types";
import { widthToColSpanClass } from "./constants";
import ComponentPreview from "./ComponentPreview";

interface CanvasItemProps {
  id: string;
  component: FormComponent;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function CanvasItem(props: CanvasItemProps) {
  var sortable = useSortable({ id: props.id });

  var style: React.CSSProperties = {
    transform: sortable.transform ? CSS.Transform.toString(sortable.transform) : undefined,
    transition: sortable.transition,
    opacity: sortable.isDragging ? 0.5 : 1
  };

  var component = props.component;
  var isSelected = props.selectedId === component.id;

  var containerClass =
    widthToColSpanClass(component.config.width) +
    " group flex items-start gap-3 rounded-md border bg-card px-3 py-3 cursor-pointer transition-colors " +
    (isSelected
      ? "border-primary ring-1 ring-primary"
      : "border-border hover:border-primary/30");

  return (
    <div
      ref={sortable.setNodeRef}
      style={style}
      className={containerClass}
      onClick={function () {
        props.onSelect(component.id);
      }}
    >
      <div
        className="mt-1 shrink-0 cursor-grab text-muted-foreground/50 transition-colors group-hover:text-muted-foreground active:cursor-grabbing"
        {...sortable.listeners}
        {...sortable.attributes}
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="mb-1.5 font-mono text-[11px] text-primary/70">
          {component.type}
        </div>
        <ComponentPreview component={component} />
      </div>

      <button
        type="button"
        className="shrink-0 rounded-sm p-1 text-muted-foreground/40 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
        onClick={function (e) {
          e.stopPropagation();
          props.onRemove(component.id);
        }}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
