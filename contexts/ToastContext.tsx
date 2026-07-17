"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ToastContainer, ToastItem, ToastType } from "../components/Toast/ToastContainer";

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastIdCounter = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (type: ToastType, message: string) => {
      const id = ++toastIdCounter;
      setToasts((current) => [...current, { id, type, message }]);
      window.setTimeout(() => dismiss(id), 3000);
    },
    [dismiss]
  );

  const value = useMemo<ToastContextType>(
    () => ({
      success: (message: string) => show("success", message),
      error: (message: string) => show("error", message),
      warning: (message: string) => show("warning", message),
      info: (message: string) => show("info", message),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
