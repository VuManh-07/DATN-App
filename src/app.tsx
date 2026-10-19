import React from "react";
import { ConfigProvider, theme } from "antd";
import { WalletProvider } from "./lib/WalletContext";
import AppRoutes from "./routes";

/**
 * antd is themed from the same tokens the stylesheets use, so a button and a
 * hand-written panel cannot drift apart: change the palette in theme.scss and
 * mirror the few values antd needs here.
 */
const App = () => (
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: "#dfb53c",
        colorBgBase: "#0e1014",
        colorBgContainer: "#1b1f27",
        colorBorder: "#333a48",
        borderRadius: 10,
        fontSize: 14,
      },
    }}
  >
    <WalletProvider>
      <AppRoutes />
    </WalletProvider>
  </ConfigProvider>
);

export default App;
