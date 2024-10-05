"use client";
import OnchainkitSvg from "src/svg/OnchainkitSvg";
import { useAccount } from "wagmi";
import LoginButton from "../components/LoginButton";
import SignupButton from "../components/SignupButton";

export default function Header() {
    const { address } = useAccount();

    return (
        <section className="mt-6 mb-6 flex flex-col md:flex-row w-[90vw]">
            <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
                <a href="/" rel="noreferrer">
                    <OnchainkitSvg />
                </a>
                <div className="flex items-center gap-3">
                    <SignupButton />
                    {!address && <LoginButton />}
                </div>
            </div>
        </section>
    );
}
