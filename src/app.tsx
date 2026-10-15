import { useEffect, useState } from "react";
import { ConfigProvider, theme } from "antd";

const App = () => {
  const [apiBaseUrl, setApiBaseUrl] = useState<string>("…");

  useEffect(() => {
    // Proves the preload bridge and the env pipeline are wired end to end.
    window.Main.config()
      .then((cfg) => setApiBaseUrl(cfg.apiBaseUrl))
      .catch(() => setApiBaseUrl("(không đọc được cấu hình)"));
  }, []);

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <main className="app--shell">
        <h1>DATN App</h1>
        <p>
          Khung cấu hình đã chạy. API base URL: <code>{apiBaseUrl}</code>
        </p>
      </main>
    </ConfigProvider>
  );
};

export default App;
