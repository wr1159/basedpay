export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const HARDHAT_CHAIN_ID = 31337;
export const SELECTED_CHAIN_ID = HARDHAT_CHAIN_ID;
export const mintContractAddress = "0xA3e40bBe8E8579Cd2619Ef9C6fEA362b760dac9f";
export const mintABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "public",
        type: "function",
    },
] as const;
export const tokenOptions = [
    {
        address: `0x1234` as const,
        chainId: 1,
        decimals: 18,
        image: "https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2",
        name: "USDC",
        symbol: "USDC",
    },
];
