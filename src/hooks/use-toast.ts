
import * as React from "react";
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

import {
  useToast as useToastFromUI,
  type ToastActionElement as UIToastActionElement,
} from "@/components/ui/use-toast";

export interface ToasterToast extends ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  duration?: number;
}

// Расширяем типы
interface ExtendedToast {
  (props: {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: UIToastActionElement;
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

export function useToast() {
  const { toast: originalToast, ...rest } = useToastFromUI();

  // Базовая toast функция
  const toast = ((props: { title?: React.ReactNode; description?: React.ReactNode } | string) => {
    if (typeof props === "string") {
      return originalToast({ description: props });
    }
    return originalToast(props);
  }) as ExtendedToast;

  // Создаем функцию для toast.success
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

  // Создаем функцию для toast.error
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

  // Создаем функцию для toast.info
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

  // Создаем функцию для toast.warning
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
