import { TokenRow } from "@coinbase/onchainkit/token";

interface StoreProps {
    name: string;
    uen: string;
}

export default function Store({ name, uen }: StoreProps) {
    return (
        <TokenRow
            token={{
                address: `0x1234` as const,
                chainId: 1,
                decimals: 18,
                image: "https://w7.pngwing.com/pngs/109/15/png-transparent-computer-icons-badmintonclick-store-rectangle-logo-black-thumbnail.png",
                name: name,
                symbol: uen,
            }}
            className="rounded-lg py-4 my-4"
        />
    );
}
