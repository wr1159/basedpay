import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployer } = await hre.getNamedAccounts();

    await hre.deployments.deploy("USDC", {
        from: deployer,
        log: true,
    });
    const xsgdDeployment = await hre.deployments.get("USDC");
};
export default func;
func.tags = ["usdc"];
