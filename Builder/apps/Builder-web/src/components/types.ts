export type FormComponentType =
  | "textfield"
  | "textarea"
  | "button"
  | "date"
  | "checkbox";

export interface FormComponentConfig {
  label?: string;
  placeholder?: string;
  required?: boolean;
  checked?: boolean;
}

export interface FormComponent {
  id: string;
  type: FormComponentType;
  config: FormComponentConfig;
}

export interface StatusMessage {
  type: "loading" | "success" | "error";
  message: string;
}
