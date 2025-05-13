
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
};

export function toast(title: string, props?: Omit<ToastProps, "title">) {
  return sonnerToast(title, {
    ...props,
  });
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

export const useToast = () => {
  return {
    toast,
  };
};
