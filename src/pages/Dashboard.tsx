import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Empty, Tag } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  GoldOutlined,
  HistoryOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Field, Grid, Panel, Stat } from "../components/ui";
import { useWallet } from "../lib/WalletContext";
import { mockApi } from "../mock/api";
import type { Token, Transaction } from "../mock/data";
import { formatAmount, formatDateTime, shortAddress } from "../lib/format";

const Dashboard = () => {
  const { account, network, refreshToken } = useWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!account) return;
    let cancelled = false;

    setBalance(null);
    setError(null);

    void Promise.all([
      mockApi.nativeBalance(account.index),
      mockApi.tokens(account.index),
      mockApi.transactions(),
    ])
      .then(([nextBalance, nextTokens, txs]) => {
        if (cancelled) return;
        setBalance(nextBalance);
        setTokens(nextTokens);
        setRecent(txs.slice(0, 4));
      })
      // A failed read must not pass for a zero balance -- say so instead.
      .catch((err) => !cancelled && setError(err?.message || "Không đọc được dữ liệu"));

    return () => {
      cancelled = true;
    };
  }, [account, refreshToken]);

  return (
    <>
      <div className="page--head">
        <h2>Tổng quan</h2>
        <p>
          {account?.name} · {network?.name}
        </p>
      </div>

      <Grid min={240}>
        <Stat
          label={`Số dư ${network?.symbol || ""}`}
          icon={<WalletOutlined />}
          tone={error ? "danger" : "brand"}
          value={
            error ? "—" : balance === null ? "…" : formatAmount(balance)
          }
          meta={error ? `Lỗi: ${error}` : network?.name}
        />
        <Stat
          label="Token đã thêm"
          icon={<GoldOutlined />}
          value={tokens.length}
          meta="ERC-20"
        />
        <Stat
          label="Giao dịch"
          icon={<HistoryOutlined />}
          value={recent.length}
          meta="Gần đây"
        />
      </Grid>

      <div className="dash--columns">
        <div>
          <Panel title="Thao tác nhanh">
            <div className="dash--actions">
              <Link to="/send">
                <Button icon={<ArrowUpOutlined />} size="large">
                  Chuyển tiền
                </Button>
              </Link>
              <Link to="/receive">
                <Button icon={<ArrowDownOutlined />} size="large">
                  Nhận
                </Button>
              </Link>
              <Link to="/assets">
                <Button icon={<GoldOutlined />} size="large">
                  Tài sản
                </Button>
              </Link>
            </div>
          </Panel>

          <Panel title="Tài khoản">
            <Field label="Tên">{account?.name || "—"}</Field>
            <Field label="Địa chỉ" mono>
              {account?.address || "—"}
            </Field>
            <Field label="Mạng">{network?.name || "—"}</Field>
          </Panel>
        </div>

        <Panel
          title="Giao dịch gần đây"
          extra={
            <Link to="/history">
              <Button size="small">Xem tất cả</Button>
            </Link>
          }
        >
          {recent.length ? (
            recent.map((tx) => (
              <Field
                key={tx.hash}
                label={
                  <span className="dash--tx--label">
                    {tx.direction === "out" ? "Gửi" : "Nhận"}
                    <small>{formatDateTime(tx.at)}</small>
                  </span>
                }
              >
                <span className="dash--tx--value">
                  <span>
                    {tx.direction === "out" ? "-" : "+"}
                    {tx.amount} {tx.symbol}
                  </span>
                  <Tag
                    color={
                      tx.status === "success"
                        ? "success"
                        : tx.status === "failed"
                        ? "error"
                        : "processing"
                    }
                  >
                    {tx.status}
                  </Tag>
                  <code>{shortAddress(tx.counterparty)}</code>
                </span>
              </Field>
            ))
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có giao dịch nào"
            />
          )}
        </Panel>
      </div>
    </>
  );
};

export default Dashboard;
