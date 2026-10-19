import React from "react";
import { Button, Dropdown, Tooltip, Typography } from "antd";
import {
  DownOutlined,
  GlobalOutlined,
  LockOutlined,
  ReloadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useWallet } from "../../lib/WalletContext";
import { shortAddress } from "../../lib/format";

/**
 * Context bar: which account, which network, and the live address.
 *
 * These three are what a user reaches for most often, so they are permanent
 * rather than buried in a settings screen -- and the address carries a copy
 * control, because reading it off the screen to type elsewhere is how people
 * send money to the wrong place.
 */
const Topbar = () => {
  const {
    accounts,
    account,
    selectAccount,
    networks,
    network,
    selectNetwork,
    refresh,
    lock,
  } = useWallet();

  return (
    <header className="topbar">
      <div className="topbar--spacer" />

      <Dropdown
        trigger={["click"]}
        menu={{
          selectedKeys: network ? [String(network.chainId)] : [],
          items: networks.map((n) => ({
            key: String(n.chainId),
            label: n.name,
            onClick: () => selectNetwork(n.chainId),
          })),
        }}
      >
        <Button icon={<GlobalOutlined />}>
          {network?.name || "Mạng"} <DownOutlined />
        </Button>
      </Dropdown>

      <Dropdown
        trigger={["click"]}
        menu={{
          selectedKeys: account ? [String(account.index)] : [],
          items: accounts.map((a) => ({
            key: String(a.index),
            label: `${a.name} · ${shortAddress(a.address)}`,
            onClick: () => selectAccount(a.index),
          })),
        }}
      >
        <Button icon={<UserOutlined />} className="topbar--account">
          <span className="topbar--account--text">
            <strong>{account?.name || "—"}</strong>
            <small>{shortAddress(account?.address)}</small>
          </span>
          <DownOutlined />
        </Button>
      </Dropdown>

      {account && (
        <Typography.Text
          className="topbar--copy"
          copyable={{
            text: account.address,
            tooltips: ["Copy địa chỉ", "Đã copy"],
          }}
        />
      )}

      <Tooltip title="Tải lại số dư">
        <Button icon={<ReloadOutlined />} onClick={refresh} />
      </Tooltip>

      <Tooltip title="Khóa ví">
        <Button icon={<LockOutlined />} onClick={lock} />
      </Tooltip>
    </header>
  );
};

export default Topbar;
