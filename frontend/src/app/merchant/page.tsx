"use client";

import { TokenRow } from "@coinbase/onchainkit/token";
import Stores from "./stores";
import { useEffect } from "react";
import { useToastContext } from "src/context/ToastContext";
import { tokenOptions } from "src/constants";
import { TOAST_TYPE } from "src/models/toast";

export default function MerchantPage() {
    const { showToast } = useToastContext();

    useEffect(() => {
        setInterval(() => {
            showToast(
                "You have received a payment",
                "https://etherscan.io/tx/0x1234",
                TOAST_TYPE.SUCCESS
            );
        }, 10000);
    }, []);

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
                />
            ))}
            <Stores />
        </>
    );
}
