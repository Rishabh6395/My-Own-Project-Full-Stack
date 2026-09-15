import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Loader2 } from "lucide-react";
import type { FormComponent, FormComponentConfig, StatusMessage } from "./types";
import { COMPONENT_TYPES, SUBMIT_URL, makeId, defaultConfigForType } from "./constants";
import PaletteItem from "./PaletteItem";
import CanvasPanel from "./CanvasPanel";
import PropertiesPanel from "./PropertiesPanel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// Replace this with however your app actually stores/retrieves the session
// token — e.g. pull it from your auth context, a cookie, or localStorage.
// Never hardcode a real token in source.
function getAuthToken(): string {
  return localStorage.getItem("authToken") || "";
}

export default function FormBuilder() {
  var state = useState<FormComponent[]>([]);
  var components = state[0];
  var setComponents = state[1];

  var selectedState = useState<string | null>(null);
  var selectedId = selectedState[0];
  var setSelectedId = selectedState[1];

  var titleState = useState<string>("New Form");
  var title = titleState[0];
  var setTitle = titleState[1];

  var statusState = useState<StatusMessage | null>(null);
  var status = statusState[0];
  var setStatus = statusState[1];

  var sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleDragEnd(event: DragEndEvent) {
    var active = event.active;
    var over = event.over;

    if (!over) {
      return;
    }

    var isFromPalette = active.data.current && active.data.current.source === "palette";

    if (isFromPalette) {
      var type = active.data.current!.type;
      var newComponent: FormComponent = {
        id: makeId(type),
        type: type,
        config: defaultConfigForType(type)
      };

      var next = components.slice();

      if (over.id === "canvas-panel") {
        next.push(newComponent);
      } else {
        var overIndex = -1;
        for (var i = 0; i < next.length; i++) {
          if (next[i].id === over.id) {
            overIndex = i;
            break;
          }
        }
        if (overIndex === -1) {
          next.push(newComponent);
        } else {
          next.splice(overIndex, 0, newComponent);
        }
      }

      setComponents(next);
      setSelectedId(newComponent.id);
      return;
    }

    // Reordering an existing canvas item
    if (active.id !== over.id) {
      var oldIndex = -1;
      var newIndex = -1;
      for (var j = 0; j < components.length; j++) {
        if (components[j].id === active.id) {
          oldIndex = j;
        }
        if (components[j].id === over.id) {
          newIndex = j;
        }
      }
      if (oldIndex !== -1 && newIndex !== -1) {
        setComponents(arrayMove(components, oldIndex, newIndex));
      }
    }
  }

  function handleRemove(id: string) {
    var next: FormComponent[] = [];
    for (var i = 0; i < components.length; i++) {
      if (components[i].id !== id) {
        next.push(components[i]);
      }
    }
    setComponents(next);
    if (selectedId === id) {
      setSelectedId(null);
    }
  }

  function handleConfigChange(id: string, newConfig: FormComponentConfig) {
    var next: FormComponent[] = [];
    for (var i = 0; i < components.length; i++) {
      if (components[i].id === id) {
        next.push({ id: components[i].id, type: components[i].type, config: newConfig });
      } else {
        next.push(components[i]);
      }
    }
    setComponents(next);
  }

  function selectedComponent(): FormComponent | null {
    for (var i = 0; i < components.length; i++) {
      if (components[i].id === selectedId) {
        return components[i];
      }
    }
    return null;
  }

  function handleSubmit() {
    if (title.trim().length === 0) {
      setStatus({ type: "error", message: "Give the form a title before submitting." });
      return;
    }

    if (components.length === 0) {
      setStatus({ type: "error", message: "Add at least one component before submitting." });
      return;
    }

    var payload = { title: title, config: components };
    var token = getAuthToken();

    setStatus({ type: "loading", message: "Submitting..." });

    fetch(SUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("Request failed with status " + res.status);
        }
        return res.json();
      })
      .then(function () {
        setStatus({ type: "success", message: "Form created." });
      })
      .catch(function (err: Error) {
        setStatus({ type: "error", message: err.message });
      });
  }

  var isSubmitting = status !== null && status.type === "loading";

  var statusClass =
    "text-sm " +
    (status && status.type === "error"
      ? "text-destructive"
      : status && status.type === "success"
        ? "text-primary"
        : "text-muted-foreground");

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="mx-auto max-w-[1400px] p-6">
        <div className="mb-5 space-y-2">
          <h1 className="text-xl font-semibold text-foreground">Form Builder</h1>
          <p className="text-sm text-muted-foreground">
            Drag components onto the sheet, then submit to save the layout.
          </p>
          <Input
            value={title}
            onChange={function (e) {
              setTitle(e.target.value);
            }}
            placeholder="Form title"
            className="max-w-xs"
          />
        </div>

        <div className="flex gap-5">
          <div className="flex w-40 shrink-0 flex-col gap-2">
            <div className="mb-1 text-sm font-medium text-foreground">Components</div>
            {COMPONENT_TYPES.map(function (item) {
              return (
                <PaletteItem key={item.type} type={item.type} label={item.label} icon={item.icon} />
              );
            })}
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <CanvasPanel
              components={components}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onRemove={handleRemove}
            />

            <div className="flex items-center gap-3">
              {status && <span className={statusClass}>{status.message}</span>}
              <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="ml-auto">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </div>
          </div>

          <PropertiesPanel component={selectedComponent()} onChange={handleConfigChange} />
        </div>
      </div>
    </DndContext>
  );
}
