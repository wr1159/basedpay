"use client";

export default function Page() {
    return (
        <div className="rounded-xl bg-[#F3F4F6] px-4 py-[11px] max-w-xl">
            <p className="font-normal text-indigo-600 text-3xl not-italic tracking-[-1.2px]">
                Welcome to BasedPay!
            </p>
            <p className="font-normal text-gray-800 not-italic tracking-[-0.6px] text-xl">
                BasedPay is a simple and secure way to send cryptocurrency to
                anyone
            </p>
            <p className="font-normal text-gray-800 not-italic tracking-[-0.6px] mt-10 text-lg">
                I am a...
            </p>
            <div className="flex gap-4 w-full justify-center">
                <button className="bg-indigo-600 text-white rounded-lg px-4 py-2 mt-2 grow">
                    <a href="/customer">Customer</a>
                </button>
                <button className="bg-indigo-600 text-white rounded-lg px-4 py-2 mt-2 grow">
                    <a href="/merchant">Merchant</a>
                </button>
            </div>
        </div>
    );
}
