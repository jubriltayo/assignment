"use client";

import type React from "react";

import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import { Button } from "./button";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
  }[type];

  const textColor = {
    success: "text-green-800",
    error: "text-red-800",
    info: "text-blue-800",
  }[type];

  const iconColor = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600",
  }[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <div className={`${bgColor} border rounded-lg p-4 shadow-lg max-w-md`}>
        <div className="flex items-center space-x-3">
          <CheckCircle className={`w-5 h-5 ${iconColor}`} />
          <p className={`${textColor} font-medium flex-1`}>{message}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const ToastViewport = () => {
  return null;
};

export const ToastTitle = () => {
  return null;
};

export const ToastDescription = () => {
  return null;
};

export const ToastClose = () => {
  return null;
};

export const ToastAction = () => {
  return null;
};
