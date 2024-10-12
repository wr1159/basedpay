"use client";

import { TokenRow } from "@coinbase/onchainkit/token";
import { ScanQrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Scanner from "src/components/Scanner";
import TokenBalances from "src/components/TokenBalances";
import { useAccount } from "wagmi";

export default function CustomerPage() {
    const account = useAccount();
    const [isScanning, setIsScanning] = useState(false);
    const router = useRouter();

    const onScan = (data: any) => {
        if (data) {
            setIsScanning(false);
            router.replace(`/customer/pay?uen=${data.text}`);
        }
    };

    return (
        <>
            <TokenBalances walletAddress={account?.address || "0x"} />
            <div
                className="bg-indigo-600 text-white rounded-lg py-4 text-xl grow w-full mt-8 flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => setIsScanning(true)}
            >
                <ScanQrCode />
                Scan To Pay
            </div>
            {isScanning && <Scanner onResult={onScan} />}
        </>
    );
}
