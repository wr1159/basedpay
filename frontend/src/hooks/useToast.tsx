import { SetStateAction, useState } from "react";

export const useToast = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [transactionLink, setTransactionLink] = useState("");

    const showToast = (
        msg: SetStateAction<string>,
        link: SetStateAction<string>
    ) => {
        setMessage(msg);
        setTransactionLink(link);
        setIsVisible(true);
        // Automatically hide after 5 seconds
        setTimeout(() => {
            setIsVisible(false);
        }, 5000);
    };

    const hideToast = () => {
        setIsVisible(false);
    };

    return {
        isVisible,
        message,
        transactionLink,
        showToast,
        hideToast,
    };
};
