import { Address } from "@graphprotocol/graph-ts";
import {
  AVAX_mUSDT,
  AVAX_mUSDC,
  AVAX_mWETH,
  AVAX_USDC,
  AVAX_WETH_E
} from "./constants";

// ========================================
// TOKEN SYMBOL HELPERS
// ========================================

export function getTokenSymbol(tokenAddress: Address): string {
  // Mock Tokens
  if (tokenAddress.equals(AVAX_mUSDT)) return "mUSDT";
  if (tokenAddress.equals(AVAX_mUSDC)) return "mUSDC";
  if (tokenAddress.equals(AVAX_mWETH)) return "mWETH";
  
  // Real Tokens
  if (tokenAddress.equals(AVAX_USDC)) return "USDC";
  if (tokenAddress.equals(AVAX_WETH_E)) return "WETH.e";
  
  return "UNKNOWN";
}

export function getTokenDecimals(tokenAddress: Address): i32 {
  // Mock Tokens
  if (tokenAddress.equals(AVAX_mUSDT)) return 6;
  if (tokenAddress.equals(AVAX_mUSDC)) return 6;
  if (tokenAddress.equals(AVAX_mWETH)) return 18;
  
  // Real Tokens
  if (tokenAddress.equals(AVAX_USDC)) return 6;
  if (tokenAddress.equals(AVAX_WETH_E)) return 18;
  
  return 18;
}

export function isMockToken(tokenAddress: Address): boolean {
  return (
    tokenAddress.equals(AVAX_mUSDT) ||
    tokenAddress.equals(AVAX_mUSDC) ||
    tokenAddress.equals(AVAX_mWETH)
  );
}
