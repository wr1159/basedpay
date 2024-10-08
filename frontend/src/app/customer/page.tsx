"use client";

import { TokenRow } from "@coinbase/onchainkit/token";
import { ScanQrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Scanner from "src/components/Scanner";
import { tokenOptions } from "src/constants";

export default function CustomerPage() {
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
