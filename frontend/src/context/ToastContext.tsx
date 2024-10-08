"use client"; // Ensure this component runs on the client-side

import { createContext, useContext, ReactNode } from "react";
import { useToast } from "../hooks/useToast";
import Toast from "src/components/Toast";
import { TOAST_TYPE } from "src/models/toast";

interface ToastContextType {
    showToast: (msg: string, link: string, type: TOAST_TYPE) => void;
}

// Create the context
const ToastContext = createContext<ToastContextType>({
    showToast: () => {},
});

// Create a provider that wraps the children with the Toast logic
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const { isVisible, message, transactionLink, type, showToast, hideToast } =
        useToast();

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Conditionally render the toast */}
            {isVisible && (
                <Toast
                    message={message}
                    transactionLink={transactionLink}
                    type={type}
                    onClose={hideToast}
                />
            )}
        </ToastContext.Provider>
    );
};

// Custom hook to easily access the ToastContext
export const useToastContext = () => useContext(ToastContext);
