import React, { useEffect, useState } from "react";
import { Alert, Tag } from "antd";
import { Field, Panel } from "../components/ui";
import { useWallet } from "../lib/WalletContext";

const Settings = () => {
  const { account, network, networks } = useWallet();
  const [apiBaseUrl, setApiBaseUrl] = useState<string>("…");

  useEffect(() => {
    // Through the preload bridge, so this doubles as proof that main-process
    // config actually reaches the renderer.
    void window.Main.config()
      .then((cfg) => setApiBaseUrl(cfg.apiBaseUrl))
      .catch(() => setApiBaseUrl("(không đọc được)"));
  }, []);

  return (
    <>
      <div className="page--head">
        <h2>Cài đặt</h2>
        <p>Thông tin ứng dụng và phiên hiện tại</p>
      </div>

      <Alert
        type="warning"
        showIcon
        style={{ marginBottom: 20 }}
        message="Bản demo giao diện"
        description="Toàn bộ số dư, token và giao dịch đều là dữ liệu giả lập trong src/mock. Ứng dụng chưa nối API và chưa đọc thẻ."
      />

      <Panel title="Phiên hiện tại">
        <Field label="Tài khoản">{account?.name || "—"}</Field>
        <Field label="Địa chỉ" mono>
          {account?.address || "—"}
        </Field>
        <Field label="Mạng">
          {network ? (
            <>
              {network.name} <Tag>chainId {network.chainId}</Tag>
            </>
          ) : (
            "—"
          )}
        </Field>
        <Field label="Mạng khả dụng">{networks.length}</Field>
      </Panel>

      <Panel title="Ứng dụng">
        <Field label="Phiên bản">0.1.0</Field>
        <Field label="API base URL" mono>
          {apiBaseUrl}
        </Field>
        <Field label="Nguồn dữ liệu">
          <Tag color="gold">src/mock/api.ts</Tag>
        </Field>
      </Panel>
    </>
  );
};

export default Settings;
