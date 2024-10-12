import { encodeFunctionData, namehash, WalletClient } from "viem";
import { normalize } from "viem/ens";
// Relevant ABI for L2 Resolver Contract.
const l2ResolverABI = [
    {
        inputs: [
            { internalType: "bytes32", name: "node", type: "bytes32" },
            { internalType: "address", name: "a", type: "address" },
        ],
        name: "setAddr",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "node", type: "bytes32" },
            { internalType: "string", name: "newName", type: "string" },
        ],
        name: "setName",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

// Relevant ABI for Basenames Registrar Controller Contract.
export const registrarABI = [
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "string",
                        name: "name",
                        type: "string",
                    },
                    {
                        internalType: "address",
                        name: "owner",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "duration",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "resolver",
                        type: "address",
                    },
                    {
                        internalType: "bytes[]",
                        name: "data",
                        type: "bytes[]",
                    },
                    {
                        internalType: "bool",
                        name: "reverseRecord",
                        type: "bool",
                    },
                ],
                internalType: "struct RegistrarController.RegisterRequest",
                name: "request",
                type: "tuple",
            },
        ],
        name: "register",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
];

export const BasedPayAbi = [
    {
        inputs: [
            {
                internalType: "string",
                name: "uen",
                type: "string",
            },
            {
                internalType: "string",
                name: "name",
                type: "string",
            },
        ],
        name: "registerStore",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "uen",
                type: "string",
            },
        ],
        name: "getAddressFromUen",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "merchant",
                type: "address",
            },
        ],
        name: "getStores",
        outputs: [
            {
                components: [
                    {
                        internalType: "string",
                        name: "uen",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "name",
                        type: "string",
                    },
                ],
                internalType: "struct BasedPay.Store[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];

// Basenames Registrar Controller Contract Address.
// export const BaseNamesRegistrarControllerAddress =
// "0x4cCb0BB02FCABA27e82a56646E81d8c5bC4119a5"; // Base Mainnet

export const BaseNamesRegistrarControllerAddress =
    "0x49ae3cc2e3aa768b1e5654f5d3c6002144a59581"; // Base Sepolia

// L2 Resolver Contract Address.
// const L2ResolverAddress = "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD"; // Base Mainnet
const L2ResolverAddress = "0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA"; // Base Sepolia

export const BasedPayAddress = "0xe5fEDc634D0C8c17e8c57E969341532fa30a93CF"; // Hardhat

// Create register contract method arguments.
export function createRegisterContractMethodArgs(
    baseName: string,
    addressId: string
) {
    // add .bastest.eth to the baseName if it doesnt exist
    if (!baseName.endsWith(".basetest.eth")) {
        baseName = `${baseName}.basetest.eth`;
    }
    const addressData = encodeFunctionData({
        abi: l2ResolverABI,
        functionName: "setAddr",
        args: [namehash(normalize(baseName)), addressId],
    });
    const nameData = encodeFunctionData({
        abi: l2ResolverABI,
        functionName: "setName",
        args: [namehash(normalize(baseName)), baseName],
    });

    const registerArgs = [
        baseName.replace(/\.basetest\.eth$/, ""),
        addressId,
        "31557600",
        L2ResolverAddress,
        [addressData, nameData],
        true,
    ];
    const registerData = encodeFunctionData({
        abi: registrarABI,
        functionName: "register",
        args: [registerArgs],
    });

    return registerData;
}
