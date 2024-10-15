"use client";

import {
    Transaction,
    TransactionButton,
    TransactionStatus,
    TransactionStatusAction,
    TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { BasedPayAddress, SELECTED_CHAIN_ID } from "src/constants";
import { useAccount } from "wagmi";
import {
    BasedPayAbi,
    BaseNamesRegistrarControllerAddress,
    createRegisterContractMethodArgs,
} from "src/utils/register-basename";
import { useState } from "react";
import { encodeFunctionData, parseEther } from "viem";
import { useToastContext } from "src/context/ToastContext";
import PhoneVerification from "src/components/merchant/PhoneVerification";
import { useRouter, useSearchParams } from "next/navigation";
import { TOAST_TYPE } from "src/models/toast";

export default function AddStorePage() {
    const [storeName, setStoreName] = useState("store-name");
    const [phoneVerified, setPhoneVerified] = useState(false);
    const searchParams = useSearchParams();
    const uen = searchParams.get("uen") || "";
    const account = useAccount();
    const { showToast } = useToastContext();
    const router = useRouter();

    const registerData =
        account?.address &&
        storeName != "" &&
        !storeName.includes(".") &&
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
        {
            to: BasedPayAddress as `0x${string}`,
            data: encodeFunctionData({
                abi: BasedPayAbi,
                functionName: "registerStore",
                args: [uen, storeName],
            }),
        },
    ];

    return (
        <>
            <div className="font-normal text-indigo-600 text-3xl not-italic tracking-[-1.2px] my-8">
                Add Store
            </div>
            <div className="flex gap-2 my-8 flex-col">
                <p className="text-xl">Store Name</p>
                <input
                    className="flex justify-between items-center w-full rounded-2xl border-2 border-gray-300 p-4 h-16"
                    placeholder="Enter store name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                />
            </div>
            <PhoneVerification setPhoneVerified={setPhoneVerified} />
            <div className="flex gap-2 my-8 flex-col">
                <p className="text-xl">UEN</p>
                <p className="text-gray-500">
                    Please ensure that your Unique Entity Number (UEN) is
                    correct
                </p>
                <p className="text-2xl font-bold">{uen}</p>
            </div>

            <Transaction
                chainId={SELECTED_CHAIN_ID}
                calls={basenameRegisterCalls}
                onError={(error) =>
                    showToast(error.message, "", TOAST_TYPE.ERROR)
                }
                onSuccess={(response) => {
                    showToast(
                        "Store added successfully",
                        "",
                        TOAST_TYPE.SUCCESS
                    );
                    setTimeout(() => {
                        router.push("/merchant");
                    }, 2000);
                }}
                capabilities={{
                    paymasterService: {
                        url: process.env
                            .PAYMASTER_AND_BUNDLER_ENDPOINT as string,
                    },
                }}
            >
                <TransactionButton
                    className="mt-0 mr-auto ml-auto max-w-full rounded-xl p-4 "
                    text="Add Store"
                    disabled={!storeName || !uen || storeName.includes(".")}
                />
                <TransactionStatus>
                    <TransactionStatusLabel />
                    <TransactionStatusAction />
                </TransactionStatus>
            </Transaction>
        </>
    );
}
