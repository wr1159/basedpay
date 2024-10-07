import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneVerificationProps {
    setPhoneVerified: (verified: boolean) => void;
}

export default function PhoneVerification({
    setPhoneVerified,
}: PhoneVerificationProps) {
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const [message, setMessage] = useState<string>("");
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false);

    const handleCodeChange = (value: string, index: number) => {
        if (/^[0-9]?$/.test(value)) {
            // Ensure only digits are entered
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Move focus to the next box if the value is not empty and it's not the last box
            if (value && index < 5) {
                const nextInput = document.getElementById(
                    `code-input-${index + 1}`
                );
                nextInput?.focus();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedData = e.clipboardData.getData("Text").slice(0, 6);
        if (/^[0-9]{6}$/.test(pastedData)) {
            setCode(pastedData.split(""));
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace" && code[index] === "") {
            if (index > 0) {
                const prevInput = document.getElementById(
                    `code-input-${index - 1}`
                );
                prevInput?.focus();
            }
        }
    };

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/send-sms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phoneNumber }),
            });
            const data = await response.json();
            if (data.success) {
                setIsCodeSent(true);
                setMessage("Verification code sent!");
            } else {
                setMessage("Error sending verification code");
            }
        } catch (error) {
            setMessage("Error sending verification code");
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        const fullCode = code.join("");
        try {
            const response = await fetch("/api/verify-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phoneNumber, code: fullCode }),
            });
            const data = await response.json();
            if (data.success) {
                setMessage("Verification successful!");
                setPhoneVerified(true);
            } else {
                setMessage("Invalid code");
            }
        } catch (error) {
            setMessage("Error verifying code");
        }
    };

    return (
        <div className="my-8 flex gap-2 flex-col">
            <p className="text-xl">2FA Verification</p>
            <form
                onSubmit={isCodeSent ? handleVerifyCode : handleSendCode}
                className="flex justify-between items-center gap-2 flex-col"
            >
                {isCodeSent ? (
                    <div className="flex justify-between items-center gap-2 my-2">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                id={`code-input-${index}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                    handleCodeChange(e.target.value, index)
                                }
                                onPaste={handlePaste}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="rounded-xl border-2 border-gray-300 h-14 w-14 leading-10 text-center"
                                required
                            />
                        ))}
                    </div>
                ) : (
                    <PhoneInput
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(val) => setPhoneNumber(val || "")}
                        defaultCountry="SG"
                        disabled={isCodeSent}
                        required
                        className="rounded-xl border-2 border-gray-300 px-2 h-16 w-full"
                    />
                )}
                <button
                    type="submit"
                    className="bg-indigo-600 text-white rounded-xl p-4 w-full"
                >
                    {isCodeSent ? "Verify" : "Send Code"}
                </button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}
