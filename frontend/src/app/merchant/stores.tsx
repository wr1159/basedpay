import { ScanQrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Store from "src/components/merchant/Store";
import Scanner from "src/components/Scanner";
import { BasedPayAbi, BasedPayAddress } from "src/utils/register-basename";
import { useAccount, useReadContract } from "wagmi";

interface Store {
    name: string;
    uen: string;
}

export default function Stores() {
    const account = useAccount();
    const [isScanning, setIsScanning] = useState(false);
    const router = useRouter();

    const onScan = (data: any) => {
        if (data) {
            setIsScanning(false);
            router.replace(`/merchant/add-store?uen=${data.text}`);
        }
    };

    const { data } = useReadContract({
        address: BasedPayAddress,
        abi: BasedPayAbi,
        functionName: "getStores",
        args: [account?.address],
    });

    const stores = (data as Store[]) || [];

    return (
        <>
            <div className="font-normal text-indigo-600 text-3xl not-italic tracking-[-1.2px] mt-8">
                Stores
            </div>
            {stores.length ? (
                (stores as Store[]).map(({ name, uen }) => (
                    <Store key={uen} name={name} uen={uen} />
                ))
            ) : (
                <div className="text-gray-600 text-lg not-italic tracking-[-1.2px] my-8 text-center">
                    No stores found
                </div>
            )}
            <div
                className="bg-indigo-600 text-white rounded-lg py-4 text-xl grow w-full mt-8 flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => setIsScanning(true)}
            >
                <ScanQrCode />
                Add Store
            </div>
            {isScanning && <Scanner onResult={onScan} />}
        </>
    );
}
