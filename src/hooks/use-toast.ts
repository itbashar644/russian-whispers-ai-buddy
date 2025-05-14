
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

// Create the enhanced useToast hook
export function useToast() {
  const { toast: originalToast, ...rest } = useToastOriginal();

  // Base toast function
  const enhancedToast = ((props: { title?: React.ReactNode; description?: React.ReactNode } | string) => {
    if (typeof props === "string") {
      return originalToast({ description: props });
    }
    return originalToast(props);
  });

  // Add variant methods to the enhanced toast
  enhancedToast.success = (props: { title?: string; description?: string; duration?: number } | string) => {
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
  enhancedToast.error = (props: { title?: string; description?: string; duration?: number } | string) => {
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
  enhancedToast.info = (props: { title?: string; description?: string; duration?: number } | string) => {
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
  enhancedToast.warning = (props: { title?: string; description?: string; duration?: number } | string) => {
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
    ...rest,
    toast: enhancedToast,
  };
}

// Helper functions for standalone toast object
const createStandaloneToast = (props: { title?: React.ReactNode; description?: React.ReactNode } | string) => {
  if (typeof props === "string") {
    return toastOriginal({ description: props });
  }
  return toastOriginal(props);
};

const successToast = (props: { title?: string; description?: string; duration?: number } | string) => {
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
};

const errorToast = (props: { title?: string; description?: string; duration?: number } | string) => {
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
};

const infoToast = (props: { title?: string; description?: string; duration?: number } | string) => {
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
};

const warningToast = (props: { title?: string; description?: string; duration?: number } | string) => {
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
};

// Export a standalone toast object with all methods
export const toast = Object.assign(createStandaloneToast, {
  success: successToast,
  error: errorToast,
  info: infoToast,
  warning: warningToast
});
