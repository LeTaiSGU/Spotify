import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="container">
            <Outlet />
            <h1>Layout</h1>
        </div>
    );
}
export default Layout;