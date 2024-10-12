"use client";

import { TokenRow } from "@coinbase/onchainkit/token";
import Stores from "./stores";
import { useToastContext } from "src/context/ToastContext";
import { tokenOptions, BASE_SEPOLIA_XSGD, XSGD_ABI } from "src/constants";
import { TOAST_TYPE } from "src/models/toast";
import { useAccount, useWatchContractEvent } from "wagmi";
import { formatEther } from "ethers/lib/utils";

export default function MerchantPage() {
    const { showToast } = useToastContext();
    const { address: merchantAddress } = useAccount();
    const notificationSound = new Audio("/notif.wav");

    // listen for Transfer events
    useWatchContractEvent({
        address: BASE_SEPOLIA_XSGD,
        abi: XSGD_ABI,
        eventName: "Transfer",
        onLogs: (logs) => {
            logs.forEach((log) => {
                const { from, to, value } = log.args;
                if (to !== merchantAddress) return;
                const formattedValue = formatEther(value ?? 0);
                showToast(
                    `Received ${formattedValue} tokens from ${from}!`,
                    `https://sepolia.basescan.org/tx/${log.transactionHash}`,
                    TOAST_TYPE.SUCCESS
                );
                notificationSound.play();
            });
        },
    });

    return (
        <>
            <div className="font-normal text-indigo-600 text-3xl not-italic tracking-[-1.2px] mb-8">
                Wallet Balance
            </div>
            {tokenOptions.map((token) => (
                <TokenRow
                    token={token}
                    amount="0.1"
                    className="bg-slate-100 rounded-lg py-4"
                    key={token.name}
                />
            ))}
            <Stores />
        </>
    );
}
