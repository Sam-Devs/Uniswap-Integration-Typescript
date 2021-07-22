require("dotenv").config();
import { ethers } from "ethers";
import { Token } from "@uniswap/sdk-core";
import { abi as ISwapRouter } from "@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json";
import {  } from "@uniswap/v3-sdk";

// Provider
const mainnet = process.env.MAINNET;
const provider = new ethers.providers.JsonRpcProvider(mainnet);
const swapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const routerContract = new ethers.Contract(swapRouterAddress, ISwapRouter, provider);

// Signer
const 