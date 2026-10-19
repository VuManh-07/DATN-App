import React, { useEffect, useState } from "react";
import { Empty, Table, Tag, Typography } from "antd";
import { Panel } from "../components/ui";
import { useWallet } from "../lib/WalletContext";
import { mockApi } from "../mock/api";
import type { Token } from "../mock/data";
import { formatAmount, shortAddress } from "../lib/format";

/**
 * Holdings: the native coin first, then every ERC-20 on this account.
 *
 * Native and tokens are separate panels rather than one merged table, because
 * they are not the same kind of thing -- the native balance pays for gas and
 * cannot be removed, the tokens are a list the user curates.
 */
const Assets = () => {
  const { account, network, refreshToken } = useWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[] | null>(null);

  useEffect(() => {
    if (!account) return;
    let cancelled = false;

    setBalance(null);
    setTokens(null);

    void Promise.all([
      mockApi.nativeBalance(account.index),
      mockApi.tokens(account.index),
    ]).then(([nextBalance, nextTokens]) => {
      if (cancelled) return;
      setBalance(nextBalance);
      setTokens(nextTokens);
    });

    return () => {
      cancelled = true;
    };
  }, [account, refreshToken]);

  return (
    <>
      <div className="page--head">
        <h2>Tài sản</h2>
        <p>Số dư gốc và các token trên tài khoản này</p>
      </div>

      <Panel title={network?.symbol || "Native"} hint={network?.name}>
        <div className="assets--native">
          <strong>{balance === null ? "…" : formatAmount(balance)}</strong>
          <span>{network?.symbol}</span>
        </div>
      </Panel>

      <Panel
        title="Token"
        hint="ERC-20 đã thêm vào ví"
        flush
        extra={<Tag>{tokens?.length ?? 0}</Tag>}
      >
        <Table<Token>
          size="middle"
          rowKey={(row) => row.address}
          loading={tokens === null}
          dataSource={tokens || []}
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Tài khoản này chưa có token nào"
              />
            ),
          }}
          columns={[
            {
              title: "Token",
              dataIndex: "symbol",
              render: (symbol: string, row) => (
                <span className="assets--token">
                  <strong>{symbol}</strong>
                  <small>{row.name}</small>
                </span>
              ),
            },
            {
              title: "Hợp đồng",
              dataIndex: "address",
              render: (value: string) => (
                <Typography.Text copyable={{ text: value }} code>
                  {shortAddress(value)}
                </Typography.Text>
              ),
            },
            {
              title: "Số dư",
              dataIndex: "balance",
              align: "right",
              render: (value: string, row) => `${value} ${row.symbol}`,
            },
          ]}
        />
      </Panel>
    </>
  );
};

export default Assets;
