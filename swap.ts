require("dotenv").config();
import { ethers } from "ethers";
import { CurrencyAmount, Token } from "@uniswap/sdk-core";
import { abi as ISwapRouter } from "@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json";
import { } from "@uniswap/v3-sdk";
import { hexValue } from "ethers/lib/utils";

// Provider
const mainnet = process.env.MAINNET;
const provider = new ethers.providers.JsonRpcProvider(mainnet);
const routerAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const routerContract = new ethers.Contract(routerAddress, ISwapRouter, provider);

// Signer
const signer = ethers.Wallet.createRandom();
const account = signer.connect(provider);

const swapRouter = routerContract.connect(account);

// Token Address Object
const tokenAddresses = {
    token0: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    token1: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
};

async function swap() {

    
    // Deadline
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    // Amount In
    const amountIn = CurrencyAmount.fromRawAmount(USDC, "5000000000");

    const swapParams = {
        path: [tokenAddresses.token0, tokenAddresses.token1],
        recipient: signer.address,
        deadline: deadline,
        amountIn: 
        amountOutMinimum:
    }
    try {
        const swapTransaction = await swapRouter.exactInput(
            swapParams,
            {value: value, gasPrice: 20e9}
        )
    } catch (error) {
        const result = (error as Error).message;
        console.log(result);
        
    }
}
