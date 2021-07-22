require("dotenv").config();
import { ethers } from "ethers";
import { Token } from "@uniswap/sdk-core";
import { Pool } from "@uniswap/v3-sdk";
import { abi as IUniswapV3Pool } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { Address } from "cluster";

// Provider
const mainnet = process.env.MAINNET;
const provider = new ethers.providers.JsonRpcProvider(mainnet);
const poolAddress = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8"
const poolContract = new ethers.Contract(poolAddress, IUniswapV3Pool, provider);

// Interfaces
export interface Immutables {
    factory: string;
    token0: string;
    token1: string;
    fee: number;
    tickSpacing: number;
    maxLiquidityPerTick: ethers.BigNumber
}

// State
export interface State {
    liquidity: ethers.BigNumber;
    sqrtPriceX96: ethers.BigNumber;
    tick: number;
    observationIndex: number;
    observationCardinality: number;
    observationCardinalityNext: number;
    feeProtocol: number;
    unlocked: boolean;
}

// Fetch Immutable Data
export async function getPoolImmutables() {
    const PoolImmutables: Immutables = {
        factory: await poolContract.factory(),
        token0: await poolContract.token0(),
        token1: await poolContract.token1(),
        fee: await poolContract.fee(),
        tickSpacing: await poolContract.tickSpacing(),
        maxLiquidityPerTick: await poolContract.maxLiquidityPerTick()
    }
    return PoolImmutables;
}

// Fetch State Data
export async function getPoolState() {
    const slot = await poolContract.slot0();
    const PoolState: State = {
        liquidity: await poolContract.liquidity(),
        sqrtPriceX96: slot[0],
        tick: slot[1],
        observationIndex: slot[2],
        observationCardinality: slot[3],
        observationCardinalityNext: slot[4],
        feeProtocol: slot[5],
        unlocked: slot[6]
    }
    return PoolState;
}

// Create Pool
async function createPool() {
    try {
        const immutables = await getPoolImmutables();
        const state = await getPoolState();

        const TokenA = new Token(1, immutables.token0, 6, "USDC", "USD Coin");
        const TokenB = new Token(1, immutables.token1, 18, "WETH", "Wrapped Ether");

        const pool = new Pool(
            TokenA,
            TokenB,
            immutables.fee,
            state.sqrtPriceX96.toString(),
            state.liquidity.toString(),
            state.tick
        )
        console.log(pool);
    } catch (e) {
        const result = (e as Error).message;
        console.log(result);

    }

}
createPool();

