
import * as React from "react";
import { 
  useToast as useToastOriginal, 
  toast as toastOriginal,
  ToasterToast as BaseToasterToast,
  type Toast as BaseToast
} from "@/components/ui/use-toast";

export interface ToasterToast extends BaseToasterToast {
  duration?: number;
}

export type Toast = Omit<ToasterToast, "id">;

// Re-export the enhanced toast hook
export function useToast() {
  // Just return the original hook as it already has the variant methods
  return useToastOriginal();
}

// Re-export the standalone toast function
export const toast = toastOriginal;
