require("dotenv").config();
import { ethers } from "ethers";
import {} from "@uniswap/sdk-core";
import { Pool } from "@uniswap/v3-sdk";
import { Address } from "cluster";

// Provider
const mainnet = process.env.MAINNET;
const provider = new ethers.providers.JsonRpcProvider(mainnet);

// Pool Address
const poolAddress = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";

