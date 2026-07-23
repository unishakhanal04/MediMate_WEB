"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

type ConfirmFn = (options: ConfirmOptions | string) => Promise<boolean>;

const ConfirmDialogContext = createContext<ConfirmFn | undefined>(undefined);

export const ConfirmDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [request, setRequest] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirmDialog = useCallback<ConfirmFn>((options) => {
    const normalized = typeof options === "string" ? { message: options } : options;
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setRequest(normalized);
    });
  }, []);

  const close = useCallback((result: boolean) => {
    resolverRef.current?.(result);
    resolverRef.current = null;
    setRequest(null);
  }, []);

  const value = useMemo(() => confirmDialog, [confirmDialog]);

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      {request && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => close(false)}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-message"
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="confirm-dialog-title"
              className="mb-2 text-lg font-bold text-gray-900 dark:text-white"
            >
              {request.title ?? "Please confirm"}
            </h2>
            <p id="confirm-dialog-message" className="mb-6 text-sm text-gray-600 dark:text-gray-300">
              {request.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => close(false)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {request.cancelLabel ?? "Cancel"}
              </button>
              <button
                onClick={() => close(true)}
                autoFocus
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
                  request.danger === false
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {request.confirmLabel ?? "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);
  if (context === undefined) {
    throw new Error("useConfirmDialog must be used within a ConfirmDialogProvider");
  }
  return context;
};
