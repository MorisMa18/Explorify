"use client";

import { Button } from "react-aria-components";
import type { ReactNode } from "react";

interface PillButtonProps {
  children: ReactNode;
  onPress?: () => void;
  isDisabled?: boolean;
  /** "accent" is the glossed primary action; "glass" is the quiet variant. */
  variant?: "accent" | "glass";
  className?: string;
}

function PillButton({
  children,
  onPress,
  isDisabled,
  variant = "accent",
  className = "",
}: PillButtonProps) {
  return (
    <Button
      onPress={onPress}
      isDisabled={isDisabled}
      data-variant={variant}
      className={`inline-flex items-center justify-center rounded-full disabled:cursor-default ${className}`}
    >
      {children}
    </Button>
  );
}

export default PillButton;
