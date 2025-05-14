
import * as React from "react";
import type { ToastProps as ToastPrimitiveProps } from "@/components/ui/toast";
import * as ToastPrimitives from "@radix-ui/react-toast";

const TOAST_LIMIT = 100;
const TOAST_REMOVE_DELAY = 1000000;

export type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "info" | "warning";
  className?: string;
  open?: boolean;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
      id: string;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      id: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      id: string;
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      id: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { id } = action;

      addToRemoveQueue(id);

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === id
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      };

    default:
      return state;
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

export type Toast = Omit<ToasterToast, "id">;

interface ToastReturn {
  id: string;
  dismiss: () => void;
  update: (props: ToasterToast) => void;
}

// Define a toast function that returns a ToastReturn object
export function toast(props: Toast | string): ToastReturn {
  const id = genId();

  const update = (updatedProps: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      id,
      toast: updatedProps,
    });

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...typeof props === "string" ? { description: props } : props,
      id,
      open: true,
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

// Add variants to the toast function for direct calling
toast.success = (props: Toast | string): ToastReturn => {
  return toast({
    ...typeof props === "string" ? { description: props } : props,
    variant: "success",
    className: "bg-green-50 border-green-200 text-green-800",
  });
};

toast.error = (props: Toast | string): ToastReturn => {
  return toast({
    ...typeof props === "string" ? { description: props } : props,
    variant: "destructive",
  });
};

toast.info = (props: Toast | string): ToastReturn => {
  return toast({
    ...typeof props === "string" ? { description: props } : props,
    variant: "info",
    className: "bg-blue-50 border-blue-200 text-blue-800",
  });
};

toast.warning = (props: Toast | string): ToastReturn => {
  return toast({
    ...typeof props === "string" ? { description: props } : props,
    variant: "warning",
    className: "bg-yellow-50 border-yellow-200 text-yellow-800",
  });
};

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (id: string) => dispatch({ type: "DISMISS_TOAST", id }),
  };
}

export { useToast };
