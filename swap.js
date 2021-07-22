"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require("dotenv").config();
var ethers_1 = require("ethers");
var sdk_core_1 = require("@uniswap/sdk-core");
var ISwapRouter_json_1 = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json");
var v3_sdk_1 = require("@uniswap/v3-sdk");
var create_pool_1 = require("./create-pool");
// Provider
var mainnet = process.env.MAINNET;
var provider = new ethers_1.ethers.providers.JsonRpcProvider(mainnet);
var routerAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
var routerContract = new ethers_1.ethers.Contract(routerAddress, ISwapRouter_json_1.abi, provider);
// Signer
var signer = ethers_1.ethers.Wallet.createRandom();
var account = signer.connect(provider);
var swapRouter = routerContract.connect(account);
// Token Address Object
var tokenAddresses = {
    token0: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    token1: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
};
function swap() {
    return __awaiter(this, void 0, void 0, function () {
        var TokenA, TokenB, deadline, amountIn, immutables, state, pool, route, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    TokenA = new sdk_core_1.Token(1, tokenAddresses.token0, 6, "USDC", "USD Coin");
                    TokenB = new sdk_core_1.Token(1, tokenAddresses.token1, 18, "WETH", "Wrapped Ether");
                    deadline = Math.floor(Date.now() / 1000) + 60 * 20;
                    amountIn = sdk_core_1.CurrencyAmount.fromRawAmount(TokenA, "5000000000");
                    return [4 /*yield*/, create_pool_1.getPoolImmutables()];
                case 1:
                    immutables = _a.sent();
                    return [4 /*yield*/, create_pool_1.getPoolState()];
                case 2:
                    state = _a.sent();
                    pool = new v3_sdk_1.Pool(TokenA, TokenB, immutables.fee, state.sqrtPriceX96.toString(), state.liquidity.toString(), state.tick);
                    route = new v3_sdk_1.Route([pool], TokenA, TokenB);
                    console.log("1 USDC can be swapped for " + route.midPrice.toSignificant(6) + " WETH");
                    console.log("1 WETH can be swapped for " + route.midPrice.invert().toSignificant(6) + " USDC");
                    // const swapParams = {
                    //     path: [tokenAddresses.token0, tokenAddresses.token1],
                    //     recipient: signer.address,
                    //     deadline: deadline,
                    //     amountIn: ethers.utils.parseUnits(amountIn.toExact(), 6),
                    //     amountOutMinimum:
                    // }
                    try {
                        // const swapTransaction = await swapRouter.exactInput(
                        //     swapParams,
                        //     {value: value, gasPrice: 20e9}
                        // )
                    }
                    catch (error) {
                        result = error.message;
                        console.log(result);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
