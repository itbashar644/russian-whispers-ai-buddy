
import { toast as sonnerToast, type ToastT } from "sonner";

type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
};

// Create a type that matches the expected props from toaster.tsx
export interface Toast extends ToastProps {
  id: string; 
}

// This allows us to maintain compatibility with components expecting toasts array
export const useToast = () => {
  return {
    toast,
    toasts: [] as Toast[],
  };
};

export function toast(props: ToastProps | string) {
  if (typeof props === 'string') {
    return sonnerToast(props);
  }
  
  const { title, description, variant, ...rest } = props;
  
  if (variant === 'destructive') {
    return sonnerToast.error(title as string, { description, ...rest });
  } else if (variant === 'success') {
    return sonnerToast.success(title as string, { description, ...rest });
  } else {
    return sonnerToast(title as string, { description, ...rest });
  }
}

toast.error = (title: string, props?: Omit<ToastProps, "title">) => {
  return sonnerToast.error(title, props);
};

toast.success = (title: string, props?: Omit<ToastProps, "title">) => {
  return sonnerToast.success(title, props);
};

toast.info = (title: string, props?: Omit<ToastProps, "title">) => {
  return sonnerToast(title, props);
};

toast.warning = (title: string, props?: Omit<ToastProps, "title">) => {
  return sonnerToast.warning(title, props);
};
