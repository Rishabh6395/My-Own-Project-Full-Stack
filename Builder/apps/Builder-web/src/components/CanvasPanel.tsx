import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { FormComponent } from "./types";
import CanvasItem from "./CanvasItem";

interface CanvasPanelProps {
  components: FormComponent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function CanvasPanel(props: CanvasPanelProps) {
  var droppable = useDroppable({ id: "canvas-panel" });

  var itemIds: string[] = [];
  for (var i = 0; i < props.components.length; i++) {
    itemIds.push(props.components[i].id);
  }

  var wrapperClass =
    "blueprint-grid flex min-h-[420px] flex-col gap-2.5 rounded-lg border-2 border-dashed p-4 transition-colors " +
    (droppable.isOver ? "border-primary bg-accent/40" : "border-border");

  return (
    <div ref={droppable.setNodeRef} className={wrapperClass}>
      {props.components.length === 0 ? (
        <div className="m-auto text-sm text-muted-foreground">
          Drag components here to build the form
        </div>
      ) : (
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {props.components.map(function (component) {
            return (
              <CanvasItem
                key={component.id}
                id={component.id}
                component={component}
                selectedId={props.selectedId}
                onSelect={props.onSelect}
                onRemove={props.onRemove}
              />
            );
          })}
        </SortableContext>
      )}
    </div>
  );
}
