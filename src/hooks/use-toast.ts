
import * as React from "react";
import { Toast, ToastProps } from "@/components/ui/toast";
import { useToast as useToastOriginal, toast as toastOriginal } from "@/components/ui/use-toast";

export interface ToasterToast extends Omit<ToastProps, "title" | "description" | "action"> {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
  duration?: number;
}

// Extending the types for the toast function
interface ExtendedToast {
  (props: {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactElement;
    variant?: "default" | "destructive";
  } | string): {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
  success: (props: { title?: string; description?: string; duration?: number } | string) => {
    id: string;
    dismiss: () => void;
  };
  error: (props: { title?: string; description?: string; duration?: number } | string) => {
    id: string;
    dismiss: () => void;
  };
  info: (props: { title?: string; description?: string; duration?: number } | string) => {
    id: string;
    dismiss: () => void;
  };
  warning: (props: { title?: string; description?: string; duration?: number } | string) => {
    id: string;
    dismiss: () => void;
  };
}

// Create the enhanced useToast hook
export function useToast() {
  const { toast: originalToast, ...rest } = useToastOriginal();

  // Base toast function
  const toast = ((props: { title?: React.ReactNode; description?: React.ReactNode } | string) => {
    if (typeof props === "string") {
      return originalToast({ description: props });
    }
    return originalToast(props);
  }) as ExtendedToast;

  // Create function for toast.success
  toast.success = (props) => {
    if (typeof props === "string") {
      return originalToast({ 
        description: props,
        variant: "default",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    }
    return originalToast({
      ...props,
      variant: "default",
      className: "bg-green-50 border-green-200 text-green-800",
    });
  };

  // Create function for toast.error
  toast.error = (props) => {
    if (typeof props === "string") {
      return originalToast({ 
        description: props,
        variant: "destructive"
      });
    }
    return originalToast({
      ...props,
      variant: "destructive"
    });
  };

  // Create function for toast.info
  toast.info = (props) => {
    if (typeof props === "string") {
      return originalToast({ 
        description: props,
        variant: "default",
        className: "bg-blue-50 border-blue-200 text-blue-800",
      });
    }
    return originalToast({
      ...props,
      variant: "default",
      className: "bg-blue-50 border-blue-200 text-blue-800",
    });
  };

  // Create function for toast.warning
  toast.warning = (props) => {
    if (typeof props === "string") {
      return originalToast({ 
        description: props,
        variant: "default",
        className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      });
    }
    return originalToast({
      ...props,
      variant: "default",
      className: "bg-yellow-50 border-yellow-200 text-yellow-800",
    });
  };

  return {
    toast,
    ...rest,
  };
}

// Export a standalone toast object for direct import
export const toast = {
  // Default toast function
  (props: { title?: React.ReactNode; description?: React.ReactNode } | string) {
    if (typeof props === "string") {
      return toastOriginal({ description: props });
    }
    return toastOriginal(props);
  },
  
  // Success variant
  success: (props: { title?: string; description?: string; duration?: number } | string) => {
    if (typeof props === "string") {
      return toastOriginal({ 
        description: props,
        variant: "default",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    }
    return toastOriginal({
      ...props,
      variant: "default",
      className: "bg-green-50 border-green-200 text-green-800",
    });
  },
  
  // Error variant
  error: (props: { title?: string; description?: string; duration?: number } | string) => {
    if (typeof props === "string") {
      return toastOriginal({ 
        description: props,
        variant: "destructive"
      });
    }
    return toastOriginal({
      ...props,
      variant: "destructive"
    });
  },
  
  // Info variant
  info: (props: { title?: string; description?: string; duration?: number } | string) => {
    if (typeof props === "string") {
      return toastOriginal({ 
        description: props,
        variant: "default",
        className: "bg-blue-50 border-blue-200 text-blue-800",
      });
    }
    return toastOriginal({
      ...props,
      variant: "default",
      className: "bg-blue-50 border-blue-200 text-blue-800",
    });
  },
  
  // Warning variant
  warning: (props: { title?: string; description?: string; duration?: number } | string) => {
    if (typeof props === "string") {
      return toastOriginal({ 
        description: props,
        variant: "default",
        className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      });
    }
    return toastOriginal({
      ...props,
      variant: "default",
      className: "bg-yellow-50 border-yellow-200 text-yellow-800",
    });
  }
} as const;
