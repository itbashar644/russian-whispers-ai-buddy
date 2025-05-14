
import * as React from "react";
import {
  Toast,
  ToastProps,
} from "@/components/ui/toast";

import {
  useToast as useToastOriginal,
} from "@/components/ui/use-toast";

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

// Create a fixed useToast hook function
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
// This is completely separate from the useToast hook to prevent recursive calls
export const toast = {
  // Default toast function
  default: (props: { title?: React.ReactNode; description?: React.ReactNode } | string) => {
    const { toast } = useToastOriginal();
    if (typeof props === "string") {
      return toast({ description: props });
    }
    return toast(props);
  },
  
  // Success variant
  success: (props: { title?: string; description?: string; duration?: number } | string) => {
    const { toast } = useToastOriginal();
    if (typeof props === "string") {
      return toast({ 
        description: props,
        variant: "default",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    }
    return toast({
      ...props,
      variant: "default",
      className: "bg-green-50 border-green-200 text-green-800",
    });
  },
  
  // Error variant
  error: (props: { title?: string; description?: string; duration?: number } | string) => {
    const { toast } = useToastOriginal();
    if (typeof props === "string") {
      return toast({ 
        description: props,
        variant: "destructive"
      });
    }
    return toast({
      ...props,
      variant: "destructive"
    });
  },
  
  // Info variant
  info: (props: { title?: string; description?: string; duration?: number } | string) => {
    const { toast } = useToastOriginal();
    if (typeof props === "string") {
      return toast({ 
        description: props,
        variant: "default",
        className: "bg-blue-50 border-blue-200 text-blue-800",
      });
    }
    return toast({
      ...props,
      variant: "default",
      className: "bg-blue-50 border-blue-200 text-blue-800",
    });
  },
  
  // Warning variant
  warning: (props: { title?: string; description?: string; duration?: number } | string) => {
    const { toast } = useToastOriginal();
    if (typeof props === "string") {
      return toast({ 
        description: props,
        variant: "default",
        className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      });
    }
    return toast({
      ...props,
      variant: "default",
      className: "bg-yellow-50 border-yellow-200 text-yellow-800",
    });
  }
};
