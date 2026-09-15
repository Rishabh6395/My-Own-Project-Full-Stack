import React from "react";
import type { FormComponent } from "./types";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface ComponentPreviewProps {
  component: FormComponent;
}

export default function ComponentPreview(props: ComponentPreviewProps) {
  var c = props.component;

  if (c.type === "textfield") {
    return (
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{c.config.label}</Label>
        <Input placeholder={c.config.placeholder} disabled />
      </div>
    );
  } else if (c.type === "textarea") {
    return (
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{c.config.label}</Label>
        <Textarea placeholder={c.config.placeholder} disabled />
      </div>
    );
  } else if (c.type === "button") {
    return (
      <Button type="button" variant="secondary" disabled>
        {c.config.label}
      </Button>
    );
  } else if (c.type === "date") {
    return (
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{c.config.label}</Label>
        <Input type="date" disabled />
      </div>
    );
  } else if (c.type === "checkbox") {
    return (
      <div className="flex items-center gap-2">
        <Checkbox disabled />
        <Label className="text-sm text-muted-foreground">{c.config.label}</Label>
      </div>
    );
  } else {
    return <div className="text-sm text-muted-foreground">{c.type}</div>;
  }
}
