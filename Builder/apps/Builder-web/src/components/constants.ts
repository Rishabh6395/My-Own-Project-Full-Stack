import type { FormComponentConfig, FormComponentType, ComponentWidth } from "./types";
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
export var SUBMIT_URL = "http://localhost:5002/builder/forms";

export interface WidthOptionEntry {
  value: ComponentWidth;
  label: string;
}

// 12-column grid: full=12/12, half=6/12, third=4/12, quarter=3/12.
// Four "quarter" components fill exactly one row.
export var WIDTH_OPTIONS: WidthOptionEntry[] = [
  { value: "full", label: "Full" },
  { value: "half", label: "1/2" },
  { value: "third", label: "1/3" },
  { value: "quarter", label: "1/4" }
];

// Tailwind's scanner needs literal class strings in source, so this stays
// an explicit if/else rather than a template-built class name.
export function widthToColSpanClass(width: ComponentWidth | undefined): string {
  if (width === "half") {
    return "col-span-12 sm:col-span-6";
  } else if (width === "third") {
    return "col-span-12 sm:col-span-4";
  } else if (width === "quarter") {
    return "col-span-12 sm:col-span-3";
  } else {
    return "col-span-12";
  }
}

export function makeId(type: FormComponentType): string {
  return type + "_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
}

export function defaultConfigForType(type: FormComponentType): FormComponentConfig {
  if (type === "textfield") {
    return { label: "Text Field", placeholder: "", required: false, width: "full" };
  } else if (type === "textarea") {
    return { label: "Text Area", placeholder: "", required: false, width: "full" };
  } else if (type === "button") {
    return { label: "Submit", width: "full" };
  } else if (type === "date") {
    return { label: "Date", required: false, width: "full" };
  } else if (type === "checkbox") {
    return { label: "Checkbox", checked: false, width: "full" };
  } else {
    return { label: type, width: "full" };
  }
}
