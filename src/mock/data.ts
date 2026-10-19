/**
 * Fixtures for the mock backend.
 *
 * Kept apart from mock/api.ts so the shape of the data and the behaviour of
 * the calls can change independently -- and so a real backend can be wired in
 * later without anyone having to pick fixtures out of request handlers.
 *
 * Values are plausible rather than pretty: real Sepolia-shaped addresses, an
 * awkward balance, a failed transaction in the history. A UI that only ever
 * sees tidy data hides the layout problems that real data causes.
 */

export interface Account {
  index: number;
  name: string;
  address: string;
}

export interface Network {
  chainId: number;
  name: string;
  symbol: string;
  explorer: string;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
}

export type TxStatus = "success" | "failed" | "pending";
export type TxDirection = "in" | "out";

export interface Transaction {
  hash: string;
  direction: TxDirection;
  status: TxStatus;
  counterparty: string;
  /** Whole-token amount, as a decimal string. */
  amount: string;
  symbol: string;
  fee: string;
  at: string;
}

export const NETWORKS: Network[] = [
  {
    chainId: 11155111,
    name: "Sepolia test network",
    symbol: "ETH",
    explorer: "https://sepolia.etherscan.io",
  },
  {
    chainId: 1,
    name: "Mainnet Ethereum",
    symbol: "ETH",
    explorer: "https://etherscan.io",
  },
];

export const ACCOUNTS: Account[] = [
  {
    index: 0,
    name: "Account 1",
    address: "0x86e3d7195c68Ac9c667F34Efc901B74948adD68B",
  },
  {
    index: 1,
    name: "Account 2",
    address: "0x4A9f2b1C8E7d3F5a6B0c9D2e1F8a7B6c5D4e3F21",
  },
];

/** Native balance per account index, in whole ETH. */
export const NATIVE_BALANCE: Record<number, string> = {
  0: "0.049999789",
  1: "0",
};

export const TOKENS: Token[] = [
  {
    address: "0xc41a22c34cb15353dc0f4b2ed0aea4acfd166d55",
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    balance: "125.4",
  },
  {
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    symbol: "UNI",
    name: "Uniswap",
    decimals: 18,
    balance: "0.0000314",
  },
];

export const TRANSACTIONS: Transaction[] = [
  {
    hash: "0xbf911dc2c65b524510cfb6c8799c1bdfe3c8d28105431d29ad707e9f2f8203fc",
    direction: "out",
    status: "success",
    counterparty: "0xFCA27c4265632A1F93DEdD0875EE670012db9f23",
    amount: "0.01",
    symbol: "ETH",
    fee: "0.000248",
    at: "2026-10-15T07:12:00.000Z",
  },
  {
    // A failed send belongs in the fixtures: the row has to read clearly as
    // "money stayed, fee gone", which is easy to get wrong in a table.
    hash: "0x7f2a2beddb5a85da29130f50379be2da2711fd93519563d115a11cf1aba6436b",
    direction: "out",
    status: "failed",
    counterparty: "0xFCA27c4265632A1F93DEdD0875EE670012db9f23",
    amount: "0.01",
    symbol: "ETH",
    fee: "0.000000105",
    at: "2026-10-15T06:49:24.000Z",
  },
  {
    hash: "0x4b3f06eccbc1a0d9e2c8f7b6a5d4e3c2b1a0f9e8d7c6b5a4938271605f4e3d2c",
    direction: "in",
    status: "success",
    counterparty: "0x42645cE4b1a2F0cC9D8e7B6a5C4d3E2f1A0b9C8d",
    amount: "0.05",
    symbol: "ETH",
    fee: "0",
    at: "2026-10-15T06:40:11.000Z",
  },
];

/** The PIN the mock login accepts. Eight digits, like the real applet. */
export const DEMO_PIN = "11111111";
