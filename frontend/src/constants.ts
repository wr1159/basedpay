export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const HARDHAT_CHAIN_ID = 31337;
export const SELECTED_CHAIN_ID = BASE_SEPOLIA_CHAIN_ID;

// Conntract Addresses
export const BASE_SEPOLIA_XSGD = "0xa57766B1641bCed760cb2d2e7C9B17B888Bc410b";
export const BASE_SEPOLIA_USDC = "0xD93b47c1c2a03C6e8f19AC8Af84021E74C669F5f";
// export const BasedPayAddress = "0xe5fEDc634D0C8c17e8c57E969341532fa30a93CF"; // Hardhat
export const BasedPayAddress = "0x7E5b621792fb8cCfA9F668747848Ade25642bB41";

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

export const XSGD_ABI = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                name: "value",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        type: "function",
    },
] as const;

export const tokenOptions = [
    {
        address: BASE_SEPOLIA_XSGD as `0x${string}`,
        chainId: 1,
        decimals: 18,
        image: "https://cdn.prod.website-files.com/6119d1f2b05f8e85e873971a/6305a3a7a364e2610c97e0b4_XSGD%20Logo%20(1).webp",
        name: "XSGD",
        symbol: "XSGD",
    },
    {
        address: BASE_SEPOLIA_USDC as `0x${string}`,
        chainId: 1,
        decimals: 6,
        image: "https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2",
        name: "USDC",
        symbol: "USDC",
    },
];
