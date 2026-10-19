import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./styles.scss";

/**
 * The frame every unlocked screen sits in.
 *
 * A layout route, so the sidebar and topbar stay mounted across navigation
 * instead of each page rendering its own chrome and remounting it on every
 * click. Pages supply only their content; the title comes from the route
 * table in PageFrame terms, kept here next to the nav it has to agree with.
 */
const AppShell = () => (
  <div className="shell">
    <Sidebar />
    <div className="shell--main">
      <Topbar />
      <main className="shell--content">
        <div className="shell--inner">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
);

export default AppShell;
