require("dotenv").config();
import { ethers } from "ethers";
import { CurrencyAmount, Percent, Token } from "@uniswap/sdk-core";
import { abi as ISwapRouter } from "@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json";
import { Pool, Route, Trade } from "@uniswap/v3-sdk";
import { getPoolImmutables, getPoolState } from "./create-pool";

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

    try {
        const TokenA = new Token(1, tokenAddresses.token0, 6, "USDC", "USD Coin");
        const TokenB = new Token(1, tokenAddresses.token1, 18, "WETH", "Wrapped Ether");
        // Deadline
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    
        // Amount In
        const amountIn = CurrencyAmount.fromRawAmount(TokenA, "5000000000");
    
        // Pool
        const immutables = await getPoolImmutables();
        const state = await getPoolState();
    
        const pool = new Pool(
            TokenA,
            TokenB,
            immutables.fee,
            state.sqrtPriceX96.toString(),
            state.liquidity.toString(),
            state.tick,
        )
    
        const route = new Route([pool], TokenA, TokenB);
        console.log(`1 USDC can be swapped for ${route.midPrice.toSignificant(6)} WETH`);
        console.log(`1 WETH can be swapped for ${route.midPrice.invert().toSignificant(6)} USDC`);
        
        const trade = await Trade.exactIn(route, amountIn);
        console.log(`The execution price of this trade is ${trade.executionPrice.toSignificant(6)} WETH to 1 USDC`);
        
        const slippageTolerance = new Percent("50", "10000");
        const amountOutMinimum = trade.minimumAmountOut(slippageTolerance);
        console.log(`For 5000 USDC you can get a minimum of ${amountOutMinimum.toSignificant(6)} WETH`);
        
    
        const swapParams = {
            path: [tokenAddresses.token0, tokenAddresses.token1],
            recipient: signer.address,
            deadline: deadline,
            amountIn: ethers.utils.parseUnits(amountIn.toExact(), 6),
            amountOutMinimum: ethers.utils.parseUnits(amountOutMinimum.toExact(), 18)
        }
        const swapTransaction = await swapRouter.exactInput(
            swapParams
        )
        console.log(`Swap Transaction Hash: ${swapTransaction.hash}`);
        const swapReceipt = swapTransaction.wait();
        console.log(`Swap Transaction Receipt: ${swapReceipt}`);
        
        
    } catch (error) {
        const result = (error as Error).message;
        console.log(result);
        
    }
}
