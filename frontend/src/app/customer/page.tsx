"use client";

import { TokenRow } from "@coinbase/onchainkit/token";
import { ScanQrCode } from "lucide-react";
import { useState } from "react";
import Scanner from "src/components/Scanner";

const token = {
    address: `0x1234` as const,
    chainId: 1,
    decimals: 18,
    image: "https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2",
    name: "USDC",
    symbol: "USDC",
};

export default function CustomerPage() {
    const [isScanning, setIsScanning] = useState(false);

    const onScan = (data: any) => {
        if (data) {
            setIsScanning(false);
            const scanData = data.text;
            console.log(scanData);
        }
    };

    return (
        <>
            <div className="font-normal text-indigo-600 text-3xl not-italic tracking-[-1.2px] mb-8">
                Wallet Balance
            </div>
            <TokenRow
                token={token}
                amount="0.1"
                className="bg-slate-100 rounded-lg py-4"
            />
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
