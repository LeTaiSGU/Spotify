import React from "react";
import "../../style/sidebar.css";

import { FaArchive, FaHome } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  const menulist = [
    {
      id: 1,
      name: "TỔNG QUAN",
      icon: <FaHome className={"icon"} />,
      path: "/",
    },
    {
      id: 2,
      name: "SẢN PHẨM",
      icon: <FaArchive className={"icon"} />,
      path: "/products",
    },
    {
      id: 3,
      name: "NHẬP XUẤT",
      icon: "",
      path: "/NHAPXUAT",
    },
  ];

  return (
    <div className={"sidebar"}>
      <div className={"logo"}>
        <FaArchive className={"icon"} />
        <span className={"text-2xl font-medium"}>Hiudune</span>
      </div>
      {menulist.map((item, index) => (
        <div key={index} className={"sidebar-content"}>
          <NavLink to={item.path} className={"nav-link"}>
            <div className={"sidebar-item flex items-center"}>
              {item.icon}
              <span>{item.name}</span>
            </div>
          </NavLink>
        </div>
      ))}
    </div>
  );
};
export default SideBar;
