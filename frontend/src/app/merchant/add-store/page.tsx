"use client";
import { useState } from "react";
import PhoneVerification from "src/components/merchant/PhoneVerification";

export default function AddStorePage() {
    const [storeName, setStoreName] = useState("");
    const [phoneVerified, setPhoneVerified] = useState(false);

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
                    onChange={(e) => setStoreName(e.target.value)}
                />
            </div>
            <PhoneVerification setPhoneVerified={setPhoneVerified} />
            <button
                className="bg-indigo-600 text-white rounded-xl p-4 w-full mt-8"
                disabled={!storeName || !phoneVerified}
            >
                Add Store
            </button>
        </>
    );
}
