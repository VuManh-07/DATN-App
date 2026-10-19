import React, { useEffect, useState } from "react";
import { Empty, Table, Tag, Typography } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Panel } from "../components/ui";
import { useWallet } from "../lib/WalletContext";
import { mockApi } from "../mock/api";
import type { Transaction, TxStatus } from "../mock/data";
import { formatDateTime, shortAddress } from "../lib/format";

/** Status word -> antd colour. Pending is blue, not green: it is not done. */
const STATUS_COLOR: Record<TxStatus, string> = {
  success: "success",
  failed: "error",
  pending: "processing",
};

const History = () => {
  const { refreshToken } = useWallet();
  const [rows, setRows] = useState<Transaction[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setRows(null);
    void mockApi.transactions().then((txs) => !cancelled && setRows(txs));
    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  return (
    <>
      <div className="page--head">
        <h2>Giao dịch</h2>
        <p>Lịch sử giao dịch đã ký từ thiết bị này</p>
      </div>

      <Panel title="Lịch sử" flush>
        <Table<Transaction>
          size="middle"
          rowKey={(row) => row.hash}
          loading={rows === null}
          dataSource={rows || []}
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có giao dịch nào"
              />
            ),
          }}
          columns={[
            {
              title: "",
              dataIndex: "direction",
              width: 48,
              align: "center",
              render: (direction: string) =>
                direction === "out" ? (
                  <ArrowUpOutlined style={{ color: "var(--danger)" }} />
                ) : (
                  <ArrowDownOutlined style={{ color: "var(--success)" }} />
                ),
            },
            {
              title: "Thời điểm",
              dataIndex: "at",
              width: 170,
              render: (value: string) => formatDateTime(value),
            },
            {
              title: "Đối tác",
              dataIndex: "counterparty",
              render: (value: string) => (
                <Typography.Text copyable={{ text: value }} code>
                  {shortAddress(value)}
                </Typography.Text>
              ),
            },
            {
              title: "Số lượng",
              dataIndex: "amount",
              align: "right",
              render: (value: string, row) => (
                <span
                  style={{
                    color:
                      row.direction === "out"
                        ? "var(--text-primary)"
                        : "var(--success)",
                  }}
                >
                  {row.direction === "out" ? "-" : "+"}
                  {value} {row.symbol}
                </span>
              ),
            },
            {
              title: "Phí",
              dataIndex: "fee",
              align: "right",
              width: 130,
              render: (value: string, row) => `${value} ${row.symbol}`,
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              width: 120,
              render: (status: TxStatus) => (
                <Tag color={STATUS_COLOR[status]}>{status}</Tag>
              ),
            },
          ]}
        />
      </Panel>
    </>
  );
};

export default History;
