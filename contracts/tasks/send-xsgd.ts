import { task } from "hardhat/config";
import { BASE_SEPOLIA_XSGD } from "../constant";

const ERC20_ABI = [
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
];

task("send-xsgd", "Sends ERC20 tokens from account 1 to account 0").setAction(
    async (taskArgs, hre) => {
        const { ethers } = hre;
        // Get the signers (accounts from the Hardhat environment)
        const accounts = await ethers.getSigners();

        const sender = accounts[1]; // Account 1 (sender)
        const recipient = accounts[0]; // Account 0 (recipient)

        console.log(
            `Sending tokens from ${sender.address} to ${recipient.address}`
        );

        // Connect to the ERC-20 contract
        const erc20 = new ethers.Contract(BASE_SEPOLIA_XSGD, ERC20_ABI, sender);

        // Perform the transfer
        const tx = await erc20.transfer(
            recipient.address,
            ethers.parseUnits("5", 18)
        ); // Assuming 18 decimals
        await tx.wait();

        console.log(`Sent 5 XSGD to ${recipient.address}`);

        // Get the new balances
        const senderBalance = await erc20.balanceOf(sender.address);
        const recipientBalance = await erc20.balanceOf(recipient.address);

        console.log(
            `Sender's XSGD balance: ${ethers.formatUnits(senderBalance, 18)}`
        );
        console.log(
            `Recipient's XSGD balance: ${ethers.formatUnits(
                recipientBalance,
                18
            )}`
        );
    }
);

module.exports = {};
