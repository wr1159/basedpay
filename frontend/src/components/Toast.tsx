interface ToastProps {
    message: string;
    transactionLink: string;
    onClose: () => void;
}

const Toast = ({ message, transactionLink, onClose }: ToastProps) => {
    return (
        <div className="fixed bottom-4 right-4 bg-gray-100 border border-gray-200 shadow-lg rounded-lg flex items-center p-4 space-x-4 w-full max-w-sm">
            <div className="flex-shrink-0">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-lime-600 w-6 h-6"
                >
                    <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM6.72667 11.5333L3.73333 8.54L4.67333 7.6L6.72667 9.65333L11.44 4.94L12.38 5.88L6.72667 11.5333Z" />
                </svg>
            </div>
            {transactionLink && (
                <div className="flex-1">
                    <p className="text-sm font-medium text-black">{message}</p>
                    <a
                        href={transactionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:underline"
                    >
                        View transaction
                    </a>
                </div>
            )}
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-black"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M2.14921 1L1 2.1492L6.8508 8L1 13.8508L2.1492 15L8 9.1492L13.8508 15L15 13.8508L9.14921 8L15 2.1492L13.8508 1L8 6.8508L2.14921 1Z"
                        fill="#0A0B0D"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Toast;
