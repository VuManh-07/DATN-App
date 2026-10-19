/**
 * The mock backend -- and the seam a real one will replace.
 *
 * Every screen talks to this module and to nothing else: no IPC, no HTTP, no
 * card. When the real backend arrives, each function here becomes a call to
 * `window.Main.*` or to an HTTP client and the pages do not change. That is
 * the whole point of routing them through one file rather than scattering
 * fixtures across components.
 *
 * Three deliberate behaviours, because a UI built against an instant,
 * always-succeeding backend is a UI with no loading and no error states:
 *
 *   - every call is async and takes time
 *   - `unlock` rejects a wrong PIN, counting attempts down like the applet
 *   - `send` rejects an amount larger than the balance
 */

import {
  ACCOUNTS,
  Account,
  DEMO_PIN,
  NATIVE_BALANCE,
  NETWORKS,
  Network,
  TOKENS,
  Token,
  TRANSACTIONS,
  Transaction,
} from "./data";

/** Simulated round-trip, so spinners and disabled states are real. */
const LATENCY_MS = 450;

const delay = <T>(value: T, ms = LATENCY_MS): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const fail = (message: string, ms = LATENCY_MS): Promise<never> =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));

/**
 * Mutable session state.
 *
 * Module-level on purpose: it survives navigation but not a reload, which is
 * exactly how an unlocked wallet should behave.
 */
let pinAttemptsLeft = 5;
let transactions = [...TRANSACTIONS];

export const MAX_PIN_ATTEMPTS = 5;

export const mockApi = {
  /** Unlock with the 8-digit PIN. Rejects with a message meant for the user. */
  async unlock(pin: string): Promise<{ attemptsLeft: number }> {
    if (pin.length !== 8) {
      return fail("PIN phải gồm đúng 8 chữ số.", 150);
    }
    if (pin !== DEMO_PIN) {
      pinAttemptsLeft -= 1;
      if (pinAttemptsLeft <= 0) {
        return fail("Sai PIN quá số lần cho phép. Thẻ đã bị khóa.");
      }
      return fail(`Sai PIN. Còn ${pinAttemptsLeft} lần thử.`);
    }
    pinAttemptsLeft = MAX_PIN_ATTEMPTS;
    return delay({ attemptsLeft: pinAttemptsLeft });
  },

  accounts: (): Promise<Account[]> => delay(ACCOUNTS),

  networks: (): Promise<Network[]> => delay(NETWORKS),

  /** Native balance of one account, as a decimal string in whole tokens. */
  nativeBalance: (accountIndex: number): Promise<string> =>
    delay(NATIVE_BALANCE[accountIndex] ?? "0"),

  tokens: (accountIndex: number): Promise<Token[]> =>
    // Only the first account holds tokens, so the empty state is reachable
    // just by switching accounts in the topbar.
    delay(accountIndex === 0 ? TOKENS : []),

  transactions: (): Promise<Transaction[]> => delay(transactions),

  /** Rough fee quote for a native transfer. */
  estimateFee: (): Promise<string> => delay("0.000248", 250),

  /**
   * Send native currency. Validates the way the real thing would, so the form
   * has something to show in its error state.
   */
  async send(input: {
    accountIndex: number;
    to: string;
    amount: string;
  }): Promise<Transaction> {
    if (!/^0x[0-9a-fA-F]{40}$/.test(input.to)) {
      return fail("Địa chỉ nhận không hợp lệ.", 200);
    }

    const amount = Number(input.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return fail("Số lượng phải lớn hơn 0.", 200);
    }

    const balance = Number(NATIVE_BALANCE[input.accountIndex] ?? "0");
    if (amount > balance) {
      return fail("Số dư không đủ cho giao dịch này.", 200);
    }

    const tx: Transaction = {
      hash: `0x${Math.random().toString(16).slice(2).padEnd(64, "0").slice(0, 64)}`,
      direction: "out",
      status: "pending",
      counterparty: input.to,
      amount: input.amount,
      symbol: "ETH",
      fee: "0.000248",
      at: new Date().toISOString(),
    };

    transactions = [tx, ...transactions];
    return delay(tx, 900);
  },
};

export type MockApi = typeof mockApi;
