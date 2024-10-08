import { SetStateAction, useState } from "react";
import { TOAST_TYPE } from "src/models/toast";

export const useToast = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [transactionLink, setTransactionLink] = useState("");
    const [type, setType] = useState<TOAST_TYPE>(TOAST_TYPE.SUCCESS);

    const showToast = (
        msg: SetStateAction<string>,
        link: SetStateAction<string>,
        type: SetStateAction<TOAST_TYPE>
    ) => {
        setMessage(msg);
        setTransactionLink(link);
        setType(type);
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
        type,
        showToast,
        hideToast,
    };
};
