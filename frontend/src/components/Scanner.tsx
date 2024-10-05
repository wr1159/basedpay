"use client";
import { QrReader } from "react-qr-reader";

type ScannerProps = {
    onResult: (result: any, error: any) => void;
};

export default function Scanner({ onResult }: ScannerProps) {
    return (
        <div className="fixed inset-0 bg-black flex justify-center items-center z-50">
            <QrReader
                onResult={onResult}
                videoContainerStyle={{
                    width: "130vw",
                    height: "100vh",
                }}
                constraints={{
                    facingMode: { exact: "environment" },
                }}
            />
        </div>
    );
}
