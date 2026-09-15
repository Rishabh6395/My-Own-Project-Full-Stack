import type { FormComponentConfig, FormComponentType } from "./types";
import type { LucideIcon } from "lucide-react";
import { Type, AlignLeft, MousePointerClick, Calendar, CheckSquare } from "lucide-react";

export interface PaletteEntry {
  type: FormComponentType;
  label: string;
  icon: LucideIcon;
}

// Predefined component palette. Add new types here and they show up automatically.
export var COMPONENT_TYPES: PaletteEntry[] = [
  { type: "textfield", label: "Text Field", icon: Type },
  { type: "textarea", label: "Text Area", icon: AlignLeft },
  { type: "button", label: "Button", icon: MousePointerClick },
  { type: "date", label: "Date", icon: Calendar },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare }
];

// Change this to your actual Node API route.
// export var SUBMIT_URL = "/forms1/createForm";
export var SUBMIT_URL = "http://localhost:5002/builder/forms";

export function makeId(type: FormComponentType): string {
  return type + "_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
}

export function defaultConfigForType(type: FormComponentType): FormComponentConfig {
  if (type === "textfield") {
    return { label: "Text Field", placeholder: "", required: false };
  } else if (type === "textarea") {
    return { label: "Text Area", placeholder: "", required: false };
  } else if (type === "button") {
    return { label: "Submit" };
  } else if (type === "date") {
    return { label: "Date", required: false };
  } else if (type === "checkbox") {
    return { label: "Checkbox", checked: false };
  } else {
    return { label: type };
  }
}
