import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { FormComponentType } from "./types";

interface PaletteItemProps {
  type: FormComponentType;
  label: string;
}

export default function PaletteItem(props: PaletteItemProps) {
  var draggable = useDraggable({
    id: "palette-" + props.type,
    data: { source: "palette", type: props.type }
  });

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
      className="palette-item"
    >
      {props.label}
    </div>
  );
}
