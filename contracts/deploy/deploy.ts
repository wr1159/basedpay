// scripts/deploy.ts
import { ethers } from "hardhat";
import { BASE_SEPOLIA_V3_SWAP_ROUTER } from "../constant";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const BasedPay = await ethers.getContractFactory("BasedPay");
    const basedPay = await BasedPay.deploy(BASE_SEPOLIA_V3_SWAP_ROUTER);

    const address = await basedPay.getAddress();
    console.log("BasedPay deployed to:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
