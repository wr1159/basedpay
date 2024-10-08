import { task } from "hardhat/config";

task("deploy-contracts", "Deploys contracts").setAction(
    async (taskArgs, hre) => {
        console.log("Deploying contracts...");
        await hre.run("compile");
        await hre.run("run", { script: "deploy/deploy.ts" });
    }
);
