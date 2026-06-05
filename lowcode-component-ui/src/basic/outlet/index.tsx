import { Outlet } from "react-router-dom";
import { HOCCodeWrapComponent } from "@brushes/core-transform";

const Layout = () => {
  return <Outlet />;
};

export const ChildRoute = HOCCodeWrapComponent(Layout);
