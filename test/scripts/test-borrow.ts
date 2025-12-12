// Test Borrow Script
// Run: npx ts-node test/scripts/test-borrow.ts

import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

// ========================================
// CONFIGURATION
// ========================================

const CONFIG = {
  // Avalanche C-Chain RPC
  RPC_URL: process.env.RPC_URL || "https://api.avax.network/ext/bc/C/rpc",
  
  // Your private key (NEVER commit this!)
  PRIVATE_KEY: process.env.PRIVATE_KEY || "",
  
  // Contract addresses
  LENDING_POOL: "0xf1d4772c92215c8cad22913d8c57f695cf8b7dbe",
  POOL_ROUTER: "0x0f853025ad3bdcc3b0769ec6d0f9de154d89e772",
  
  // Token addresses (example - adjust as needed)
  COLLATERAL_TOKEN: "", // Set your collateral token
  BORROW_TOKEN: "",     // Set your borrow token
  
  // Test amounts (in wei/smallest unit)
  BORROW_AMOUNT: ethers.parseUnits("0.001", 18), // 0.001 tokens
};

// ========================================
// ABIs (minimal for testing)
// ========================================

const POOL_ROUTER_ABI = [
  // View functions
  "function totalSupplyAssets() view returns (uint256)",
  "function totalBorrowAssets() view returns (uint256)",
  "function totalSupplyShares() view returns (uint256)",
  "function totalBorrowShares() view returns (uint256)",
  "function getUtilizationRate() view returns (uint256)",
  "function calculateBorrowRate() view returns (uint256)",
  "function calculateSupplyRate() view returns (uint256)",
  
  // Borrow function (adjust based on actual ABI)
  "function borrow(uint256 amount, address onBehalfOf) returns (uint256)",
];

const LENDING_POOL_ABI = [
  "function router() view returns (address)",
  "function borrowDebt(uint256 amount, uint32 dstEid, uint256 addExecutorLzReceiveOption) payable",
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

// ========================================
// MAIN FUNCTIONS
// ========================================

async function getPoolState() {
  const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
  const poolRouter = new ethers.Contract(CONFIG.POOL_ROUTER, POOL_ROUTER_ABI, provider);
  
  console.log("\n📊 Current Pool State:");
  console.log("========================");
  
  try {
    const [
      supplyAssets,
      borrowAssets,
      supplyShares,
      borrowShares,
      utilizationRate,
      borrowRate,
      supplyRate
    ] = await Promise.all([
      poolRouter.totalSupplyAssets(),
      poolRouter.totalBorrowAssets(),
      poolRouter.totalSupplyShares(),
      poolRouter.totalBorrowShares(),
      poolRouter.getUtilizationRate(),
      poolRouter.calculateBorrowRate(),
      poolRouter.calculateSupplyRate(),
    ]);
    
    // Pool uses USDT (6 decimals) for supply/borrow
    console.log(`Supply Assets:    ${ethers.formatUnits(supplyAssets, 6)} USDT`);
    console.log(`Borrow Assets:    ${ethers.formatUnits(borrowAssets, 6)} USDT`);
    console.log(`Supply Shares:    ${ethers.formatUnits(supplyShares, 6)}`);
    console.log(`Borrow Shares:    ${ethers.formatUnits(borrowShares, 6)}`);
    console.log(`Utilization Rate: ${ethers.formatUnits(utilizationRate, 16)}%`);
    console.log(`Borrow Rate:      ${ethers.formatUnits(borrowRate, 16)}%`);
    console.log(`Supply Rate:      ${ethers.formatUnits(supplyRate, 16)}%`);
    
    // Also show raw values for debugging
    console.log("\n📋 Raw Values (wei):");
    console.log(`Supply Assets:    ${supplyAssets.toString()}`);
    console.log(`Borrow Assets:    ${borrowAssets.toString()}`);
    console.log(`Utilization Rate: ${utilizationRate.toString()}`);
    console.log(`Borrow Rate:      ${borrowRate.toString()}`);
    console.log(`Supply Rate:      ${supplyRate.toString()}`);
    
    return {
      supplyAssets,
      borrowAssets,
      utilizationRate,
      borrowRate,
      supplyRate
    };
  } catch (error) {
    console.error("Error reading pool state:", error);
    throw error;
  }
}

async function testBorrow() {
  if (!CONFIG.PRIVATE_KEY) {
    console.error("❌ PRIVATE_KEY not set in environment!");
    console.log("\nSet it in .env file:");
    console.log("PRIVATE_KEY=your_private_key_here");
    return;
  }
  
  const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
  const wallet = new ethers.Wallet(CONFIG.PRIVATE_KEY, provider);
  
  console.log("\n🔑 Wallet Address:", wallet.address);
  
  // Get balance
  const balance = await provider.getBalance(wallet.address);
  console.log(`💰 AVAX Balance: ${ethers.formatEther(balance)} AVAX`);
  
  if (balance === 0n) {
    console.error("❌ No AVAX balance for gas!");
    return;
  }
  
  // Get pool state before
  console.log("\n📊 BEFORE BORROW:");
  await getPoolState();
  
  // Perform borrow
  console.log("\n🚀 Executing borrow...");
  const lendingPool = new ethers.Contract(CONFIG.LENDING_POOL, LENDING_POOL_ABI, wallet);
  
  try {
    // Adjust parameters based on actual contract
    const tx = await lendingPool.borrowDebt(
      CONFIG.BORROW_AMOUNT,
      0,  // dstEid (0 for same chain)
      0,  // addExecutorLzReceiveOption
      { value: 0 }
    );
    
    console.log(`📝 TX Hash: ${tx.hash}`);
    console.log("⏳ Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log(`✅ Confirmed in block ${receipt.blockNumber}`);
    
    // Get pool state after
    console.log("\n📊 AFTER BORROW:");
    await getPoolState();
    
    console.log("\n✅ Borrow successful!");
    console.log("⏳ Wait 30-60 seconds for Goldsky to sync, then query the subgraph.");
    
  } catch (error: any) {
    console.error("❌ Borrow failed:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
  }
}

// ========================================
// CLI
// ========================================

const command = process.argv[2];

switch (command) {
  case "state":
    getPoolState();
    break;
  case "borrow":
    testBorrow();
    break;
  default:
    console.log(`
Usage:
  npx ts-node test/scripts/test-borrow.ts state   - View current pool state
  npx ts-node test/scripts/test-borrow.ts borrow  - Execute test borrow

Before running:
  1. Create .env file with PRIVATE_KEY
  2. Make sure wallet has AVAX for gas
  3. Make sure wallet has collateral deposited
    `);
}
