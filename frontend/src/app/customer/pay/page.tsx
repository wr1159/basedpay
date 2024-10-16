"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
    BasedPayAddress,
    SELECTED_CHAIN_ID,
    tokenOptions,
    XSGD_ABI,
} from "src/constants";
import { BasedPayAbi } from "src/utils/register-basename";
import { useReadContract } from "wagmi";
import {
    Transaction,
    TransactionButton,
    TransactionStatus,
    TransactionStatusAction,
    TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { encodeFunctionData, formatUnits, parseEther, zeroAddress } from "viem";
import { useToastContext } from "src/context/ToastContext";
import { Token, TokenSelectDropdown } from "@coinbase/onchainkit/token";
import { TOAST_TYPE } from "src/models/toast";
import { useAccount } from "wagmi";
import { Name } from "@coinbase/onchainkit/identity";
import { baseSepolia } from "viem/chains";

export default function CustomerPage() {
    const account = useAccount();
    const [amount, setAmount] = useState<string>();
    const [token, setToken] = useState<Token>();
    const { showToast } = useToastContext();
    const searchParams = useSearchParams();
    const uen = searchParams.get("uen");

    const { data: paymentAddress } = useReadContract({
        chainId: SELECTED_CHAIN_ID,
        abi: BasedPayAbi,
        address: BasedPayAddress,
        functionName: "getAddressFromUen",
        args: [uen],
    });

    const transferCall = useMemo(() => {
        if (!token || !paymentAddress || !amount) return [];
        return [
            {
                to: token.address as `0x${string}`,
                data: encodeFunctionData({
                    abi: XSGD_ABI,
                    functionName: "transfer",
                    args: [paymentAddress, parseEther(amount)],
                }),
            },
        ];
    }, [token, paymentAddress, amount]);

    const {
        data: tokenBalance,
        error,
        status,
    } = useReadContract({
        address: token?.address as `0x${string}`,
        abi: XSGD_ABI,
        functionName: "balanceOf",
        args: [account?.address],
    });

    return (
        <>
            <div className="font-normal text-indigo-600 text-3xl not-italic tracking-[-1.2px] break-all text-wrap">
                Paying {uen}
            </div>
            <div className="font-normal text-gray-600 text-md not-italic tracking-[-1.2px] mb-8">
                <Name
                    address={
                        paymentAddress
                            ? (paymentAddress as `0x${string}`)
                            : zeroAddress
                    }
                    className="font-normal text-gray-600 text-md not-italic tracking-[-1.2px]"
                    chain={baseSepolia}
                />
            </div>
            <div className="flex justify-between items-center gap-2 mt-8">
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
            <div className="font-normal text-gray-600 text-lg not-italic tracking-[-1.2px] mb-8">
                {token && !!tokenBalance && (
                    <>
                        Your balance:{" "}
                        {`${formatUnits(tokenBalance as bigint, token.decimals)} ${token.symbol}`}
                    </>
                )}
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
                capabilities={{
                    paymasterService: {
                        url: process.env
                            .PAYMASTER_AND_BUNDLER_ENDPOINT as string,
                    },
                }}
            >
                <TransactionButton
                    className="mt-0 mr-auto ml-auto max-w-full rounded-xl p-4 "
                    text="Pay"
                    disabled={!amount || !paymentAddress || !token}
                />
                <TransactionStatus>
                    <TransactionStatusLabel />
                    <TransactionStatusAction />
                </TransactionStatus>
            </Transaction>
        </>
    );
}
