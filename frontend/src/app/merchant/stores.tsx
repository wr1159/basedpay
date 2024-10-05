import { ScanQrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Store from "src/components/merchant/Store";
import Scanner from "src/components/Scanner";

export default function Stores() {
    const [isScanning, setIsScanning] = useState(false);
    const [stores, setStores] = useState(["Store1", "Store2", "Store3"]);
    const router = useRouter();

    const onScan = (data: any) => {
        if (data) {
            setIsScanning(false);
            const scanData = data.text;
            console.log(scanData);
            // TODO: Add store to the list
        }
        router.replace(`/merchant/add-store?data=${data}`);
    };

    return (
        <>
            <div className="font-normal text-indigo-600 text-3xl not-italic tracking-[-1.2px] mt-8">
                Stores
            </div>
            {stores.map((store) => (
                <Store key={store} name={store} />
            ))}
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
