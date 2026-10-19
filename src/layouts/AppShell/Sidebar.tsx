import React from "react";
import { NavLink } from "react-router-dom";
import {
  AppstoreOutlined,
  GoldOutlined,
  HistoryOutlined,
  SettingOutlined,
  SwapOutlined,
  WalletOutlined,
} from "@ant-design/icons";

/**
 * Primary navigation.
 *
 * Grouped by what the item affects rather than listed flat, so the one group
 * a user touches daily is not mixed in with the one they touch twice.
 */
const GROUPS = [
  {
    title: "Ví",
    items: [
      { to: "/dashboard", label: "Tổng quan", icon: <AppstoreOutlined /> },
      { to: "/assets", label: "Tài sản", icon: <GoldOutlined /> },
      { to: "/send", label: "Chuyển tiền", icon: <SwapOutlined /> },
      { to: "/receive", label: "Nhận", icon: <WalletOutlined /> },
      { to: "/history", label: "Giao dịch", icon: <HistoryOutlined /> },
    ],
  },
  {
    title: "Hệ thống",
    items: [{ to: "/settings", label: "Cài đặt", icon: <SettingOutlined /> }],
  },
];

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar--brand">
      <span className="sidebar--logo">◈</span>
      <span>DATN Wallet</span>
    </div>

    <nav className="sidebar--nav">
      {GROUPS.map((group) => (
        <div key={group.title} className="sidebar--group">
          <p className="sidebar--group--title">{group.title}</p>
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar--item${isActive ? " is-active" : ""}`
              }
            >
              <span className="sidebar--item--icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>

    {/* Says out loud that nothing here is real, so a screenshot of the demo
        is never mistaken for a working wallet. */}
    <div className="sidebar--foot">
      <span className="sidebar--badge">DỮ LIỆU GIẢ LẬP</span>
      <small>Chưa nối API và thẻ</small>
    </div>
  </aside>
);

export default Sidebar;
