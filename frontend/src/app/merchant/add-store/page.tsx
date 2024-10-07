"use client";

import {
    Transaction,
    TransactionButton,
    TransactionStatus,
    TransactionStatusAction,
    TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { BASE_SEPOLIA_CHAIN_ID } from "src/constants";
import { useAccount } from "wagmi";
import {
    BaseNamesRegistrarControllerAddress,
    createRegisterContractMethodArgs,
} from "src/utils/register-basename";
import { useState } from "react";
import { parseEther } from "viem";
import { useToastContext } from "src/context/ToastContext";

export default function AddStorePage() {
    const [storeName, setStoreName] = useState("store-name");
    const account = useAccount();
    const { showToast } = useToastContext();

    const registerData =
        account?.address &&
        createRegisterContractMethodArgs(
            storeName.endsWith(".basetest.eth")
                ? storeName
                : `${storeName}.basetest.eth`,
            account?.address
        );

    const basenameRegisterCalls = [
        {
            to: BaseNamesRegistrarControllerAddress as `0x${string}`,
            data: registerData as `0x${string}`,
            value: parseEther("0.002"),
        },
    ];

    return (
        <>
            <div className="font-normal text-indigo-600 text-3xl not-italic tracking-[-1.2px] my-8">
                Add Store
            </div>
            <div className="flex gap-2 my-4 flex-col">
                <p className="text-xl">Store Name</p>
                <input
                    className="flex justify-between items-center w-full rounded-3xl border-2 border-gray-300 p-4"
                    placeholder="Enter store name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                />
            </div>
            <button className="bg-indigo-600 text-white rounded-3xl p-4 w-full">
                Add Store
            </button>
            <Transaction
                chainId={BASE_SEPOLIA_CHAIN_ID}
                calls={basenameRegisterCalls}
                onError={(error) => showToast(error.message, error.code)}
                onSuccess={(response) =>
                    showToast(
                        "Store added successfully",
                        response.transactionReceipts[0].toString()
                    )
                }
            >
                <TransactionButton
                    className="mt-0 mr-auto ml-auto max-w-full rounded-3xl p-4 "
                    text="Mint basename"
                />
                <TransactionStatus>
                    <TransactionStatusLabel />
                    <TransactionStatusAction />
                </TransactionStatus>
            </Transaction>
        </>
    );
}
