import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { BASE_SEPOLIA_V3_SWAP_ROUTER } from "../constant";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployer } = await hre.getNamedAccounts();

    await hre.deployments.deploy("BasedPay", {
        from: deployer,
        log: true,
        args: [BASE_SEPOLIA_V3_SWAP_ROUTER],
    });
};
export default func;
func.tags = ["basedpay"];
