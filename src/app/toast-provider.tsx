"use client";

import { ToastProvider } from "@/contexts/toast-context";
import { ToastContainer } from "@/components/ui/toast";
import { useToast } from "@/contexts/toast-context";

export function ToastLayout({ children }: { children: React.ReactNode }) {
  const { toasts, dismiss } = useToast();
  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}

export function AppToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ToastLayout>{children}</ToastLayout>
    </ToastProvider>
  );
}
