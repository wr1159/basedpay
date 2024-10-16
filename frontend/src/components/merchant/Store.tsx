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
                image: "https://www.freeiconspng.com/thumbs/retail-store-icon/retail-store-icon-18.png",
                name: name,
                symbol: uen,
            }}
            className="rounded-lg py-4 my-4"
        />
    );
}
