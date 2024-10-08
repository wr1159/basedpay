"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { SELECTED_CHAIN_ID, tokenOptions } from "src/constants";
import { BasedPayAbi, BasedPayAddress } from "src/utils/register-basename";
import { useReadContract } from "wagmi";
import {
    Transaction,
    TransactionButton,
    TransactionStatus,
    TransactionStatusAction,
    TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { parseEther } from "viem";
import { useToastContext } from "src/context/ToastContext";
import { Token, TokenSelectDropdown } from "@coinbase/onchainkit/token";
import { TOAST_TYPE } from "src/models/toast";

export default function CustomerPage() {
    const [amount, setAmount] = useState<string>();
    const [token, setToken] = useState<Token>();
    const { showToast } = useToastContext();
    const searchParams = useSearchParams();
    const uen = searchParams.get("uen");

    const { data: paymentAdress } = useReadContract({
        chainId: SELECTED_CHAIN_ID,
        abi: BasedPayAbi,
        address: BasedPayAddress,
        functionName: "getAddressFromUen",
        args: [uen],
    });

    const transferCall = [
        {
            to: paymentAdress as `0x${string}`,
            value: parseEther(amount?.toString() || "0"),
        },
    ];

    return (
        <>
            <div className="font-normal text-indigo-600 text-3xl not-italic tracking-[-1.2px]">
                Paying {uen}
            </div>
            <div className="font-normal text-gray-600 text-lg not-italic tracking-[-1.2px] mb-8">
                {paymentAdress as string}
            </div>
            <div className="flex justify-between items-center gap-2 my-8">
                <input
                    className="flex justify-between items-center w-full rounded-xl border-2 border-gray-300 p-4 h-4"
                    placeholder="Amount"
                    type="number"
                    min={0}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <TokenSelectDropdown
                    token={token}
                    setToken={setToken}
                    options={tokenOptions}
                />
            </div>

            <Transaction
                chainId={SELECTED_CHAIN_ID}
                calls={transferCall}
                onError={(error) =>
                    showToast(error.message, "", TOAST_TYPE.ERROR)
                }
                onSuccess={(response) =>
                    showToast("Funds transferred", "", TOAST_TYPE.SUCCESS)
                }
            >
                <TransactionButton
                    className="mt-0 mr-auto ml-auto max-w-full rounded-xl p-4 "
                    text="Pay"
                    disabled={!amount || !paymentAdress || !token}
                />
                <TransactionStatus>
                    <TransactionStatusLabel />
                    <TransactionStatusAction />
                </TransactionStatus>
            </Transaction>
        </>
    );
}
