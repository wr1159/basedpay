"use client"; // Ensure this component runs on the client-side

import { createContext, useContext, ReactNode } from "react";
import { useToast } from "../hooks/useToast";
import Toast from "src/components/Toast";

interface ToastContextType {
    showToast: (msg: string, link: string) => void;
}

// Create the context
const ToastContext = createContext<ToastContextType>({
    showToast: () => {},
});

// Create a provider that wraps the children with the Toast logic
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const { isVisible, message, transactionLink, showToast, hideToast } =
        useToast();

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Conditionally render the toast */}
            {isVisible && (
                <Toast
                    message={message}
                    transactionLink={transactionLink}
                    onClose={hideToast}
                />
            )}
        </ToastContext.Provider>
    );
};

// Custom hook to easily access the ToastContext
export const useToastContext = () => useContext(ToastContext);
