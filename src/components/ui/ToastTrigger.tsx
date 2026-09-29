"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

export function ToastTrigger({
  children,
  kind,
  message,
}: {
  children: ReactNode;
  kind: "success" | "favorite";
  message: string;
}) {
  const { showToast } = useToast();

  return (
    <Button
      onClick={() => showToast(message, kind)}
      variant="secondary"
    >
      {children}
    </Button>
  );
}