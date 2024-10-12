"use client";

import Stores from "./stores";
import { useToastContext } from "src/context/ToastContext";
import { BASE_SEPOLIA_XSGD, XSGD_ABI } from "src/constants";
import { TOAST_TYPE } from "src/models/toast";
import { useAccount, useWatchContractEvent } from "wagmi";
import { formatEther } from "ethers/lib/utils";
import TokenBalances from "src/components/TokenBalances";
import { useState } from "react";

export default function MerchantPage() {
    const { showToast } = useToastContext();
    const { address: merchantAddress } = useAccount();
    const notificationSound = new Audio("/notif.wav");
    const [lastBlockNumber, setLastBlockNumber] = useState(0n);

    // listen for Transfer events
    useWatchContractEvent({
        address: BASE_SEPOLIA_XSGD,
        abi: XSGD_ABI,
        eventName: "Transfer",
        onLogs: (logs) => {
            logs.forEach((log: any) => {
                const { from, to, value } = log.args;
                if (
                    to !== merchantAddress ||
                    log.blockNumber == lastBlockNumber
                )
                    return;
                log.blockNumber && setLastBlockNumber(log.blockNumber);
                const formattedValue = formatEther(value ?? 0);
                showToast(
                    `Received ${formattedValue} XSGD from ${from}`,
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
