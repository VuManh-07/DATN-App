import React from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import { useWallet } from "./lib/WalletContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Send from "./pages/Send";
import Receive from "./pages/Receive";
import History from "./pages/History";
import Settings from "./pages/Settings";
import "./pages/pages.scss";

/**
 * Two route trees, picked by whether the wallet is unlocked.
 *
 * Not a guard on each route: with two trees a locked wallet has no route that
 * resolves to a wallet screen at all, so there is nothing to forget to wrap.
 * HashRouter because the renderer is loaded from a file URL, where a history
 * router cannot match paths.
 */
const AppRoutes = () => {
  const { unlocked } = useWallet();

  return (
    <HashRouter>
      {unlocked ? (
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/send" element={<Send />} />
            <Route path="/receive" element={<Receive />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            {/* Unlocking lands on "/", and anything unknown goes home too. */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </HashRouter>
  );
};

export default AppRoutes;
