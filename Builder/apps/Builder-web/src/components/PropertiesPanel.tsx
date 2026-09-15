import React from "react";
import type { FormComponent, FormComponentConfig } from "./types";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface PropertiesPanelProps {
  component: FormComponent | null;
  onChange: (id: string, newConfig: FormComponentConfig) => void;
}

export default function PropertiesPanel(props: PropertiesPanelProps) {
  var component = props.component;

  if (!component) {
    return (
      <div className="w-64 shrink-0 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
        Select a component to edit its properties
      </div>
    );
  }

  function updateConfig(key: keyof FormComponentConfig, value: string | boolean) {
    var newConfig: FormComponentConfig = {};
    for (var k in component!.config) {
      if (component!.config.hasOwnProperty(k)) {
        (newConfig as any)[k] = (component!.config as any)[k];
      }
    }
    (newConfig as any)[key] = value;
    props.onChange(component!.id, newConfig);
  }

  var showPlaceholder = component.type === "textfield" || component.type === "textarea";
  var showRequired =
    component.type === "textfield" || component.type === "textarea" || component.type === "date";

  return (
    <div className="w-64 shrink-0 rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] text-primary/70">{component.type}</span>
        <span className="text-xs text-muted-foreground">Inspector</span>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Label</Label>
          <Input
            value={component.config.label || ""}
            onChange={function (e) {
              updateConfig("label", e.target.value);
            }}
          />
        </div>

        {showPlaceholder && (
          <div className="space-y-1.5">
            <Label className="text-xs">Placeholder</Label>
            <Input
              value={component.config.placeholder || ""}
              onChange={function (e) {
                updateConfig("placeholder", e.target.value);
              }}
            />
          </div>
        )}

        {showRequired && (
          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              checked={!!component.config.required}
              onCheckedChange={function (checked) {
                updateConfig("required", checked === true);
              }}
            />
            <Label className="text-sm font-normal">Required</Label>
          </div>
        )}
      </div>
    </div>
  );
}
