import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { mockApi } from "../mock/api";
import type { Account, Network } from "../mock/data";

/**
 * Session state shared by every screen: unlocked or not, which account, which
 * network.
 *
 * One context rather than props threaded through the tree, because the topbar
 * changes the selection and pages several levels down have to react to it.
 * Everything it holds comes from mock/api.ts, so when a real backend replaces
 * that module this file does not change.
 */

interface WalletState {
  unlocked: boolean;
  unlock(pin: string): Promise<void>;
  lock(): void;

  accounts: Account[];
  account: Account | null;
  selectAccount(index: number): void;

  networks: Network[];
  network: Network | null;
  selectNetwork(chainId: number): void;

  /** Bumped to ask balance-reading screens to refetch. */
  refreshToken: number;
  refresh(): void;
}

const WalletContext = createContext<WalletState | null>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountIndex, setAccountIndex] = useState(0);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [chainId, setChainId] = useState<number | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  // Loaded once the wallet is open, not at mount: before unlocking there is
  // nothing to show and no reason to ask.
  useEffect(() => {
    if (!unlocked) return;
    let cancelled = false;

    void Promise.all([mockApi.accounts(), mockApi.networks()]).then(
      ([nextAccounts, nextNetworks]) => {
        if (cancelled) return;
        setAccounts(nextAccounts);
        setNetworks(nextNetworks);
        setChainId((current) => current ?? nextNetworks[0]?.chainId ?? null);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [unlocked]);

  const unlock = useCallback(async (pin: string) => {
    // Errors propagate: the login screen owns how a wrong PIN looks.
    await mockApi.unlock(pin);
    setUnlocked(true);
  }, []);

  const lock = useCallback(() => {
    setUnlocked(false);
    setAccounts([]);
  }, []);

  const value = useMemo<WalletState>(
    () => ({
      unlocked,
      unlock,
      lock,
      accounts,
      account: accounts.find((a) => a.index === accountIndex) ?? null,
      selectAccount: setAccountIndex,
      networks,
      network: networks.find((n) => n.chainId === chainId) ?? null,
      selectNetwork: setChainId,
      refreshToken,
      refresh: () => setRefreshToken((n) => n + 1),
    }),
    [unlocked, unlock, lock, accounts, accountIndex, networks, chainId, refreshToken]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside <WalletProvider>");
  return ctx;
};
