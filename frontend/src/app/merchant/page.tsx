"use client";

import { TokenRow } from "@coinbase/onchainkit/token";
import Stores from "./stores";
import { useToastContext } from "src/context/ToastContext";
import { tokenOptions, BASE_SEPOLIA_XSGD, XSGD_ABI } from "src/constants";
import { TOAST_TYPE } from "src/models/toast";
import { useAccount, useWatchContractEvent } from "wagmi";
import { formatEther } from "ethers/lib/utils";
import TokenBalances from "src/components/TokenBalances";

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
            <TokenBalances walletAddress={merchantAddress || "0x"} />
            <Stores />
        </>
    );
}
