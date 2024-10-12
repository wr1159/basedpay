import { useReadContracts } from "wagmi";
import { tokenOptions, XSGD_ABI } from "src/constants";
import { TokenRow } from "@coinbase/onchainkit/token";
import { formatUnits } from "ethers/lib/utils";
import { BigNumberish } from "ethers";

export default function TokenBalances({
    walletAddress,
}: {
    walletAddress: `0x${string}`;
}) {
    const { data: balances } = useReadContracts({
        contracts: tokenOptions.map((token) => ({
            address: token.address as `0x${string}`,
            abi: XSGD_ABI as any,
            functionName: "balanceOf",
            args: [walletAddress],
        })),
    });
    return (
        <>
            <div className="font-normal text-indigo-600 text-3xl not-italic tracking-[-1.2px] mb-8">
                Wallet Balance
            </div>
            {balances &&
                tokenOptions.map((token, index) => {
                    const balance = balances[index];
                    if (balance.status != "success") return;
                    return (
                        <TokenRow
                            token={token}
                            amount={formatUnits(
                                balance.result as BigNumberish,
                                token.decimals
                            )}
                            className="bg-slate-100 rounded-lg py-4 mb-2"
                            key={token.symbol}
                        />
                    );
                })}
        </>
    );
}
