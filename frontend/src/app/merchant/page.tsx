"use client";

import { TokenRow } from "@coinbase/onchainkit/token";
import Stores from "./stores";
import { useEffect } from "react";
import { useToastContext } from "src/context/ToastContext";

const token = {
    address: `0x1234` as const,
    chainId: 1,
    decimals: 18,
    image: "https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2",
    name: "USDC",
    symbol: "USDC",
};

export default function MerchantPage() {
    const { showToast } = useToastContext();

    useEffect(() => {
        setInterval(() => {
            showToast(
                "You have received a payment",
                "https://etherscan.io/tx/0x1234"
            );
        }, 10000);
    }, []);

    return (
        <>
            <div className="font-normal text-indigo-600 text-3xl not-italic tracking-[-1.2px] mb-8">
                Wallet Balance
            </div>
            <TokenRow token={token} amount="0.1" className="rounded-lg py-4" />
            <Stores />
        </>
    );
}
