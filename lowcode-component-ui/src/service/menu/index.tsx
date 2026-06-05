import React, { useEffect, useState } from "react";
import { AppstoreOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { groupBy } from "lodash";
import { useLocation } from "react-router-dom";
import { useModuleRootContext } from "@brushes/component-core";
import { useNavigateImpl } from "@brushes/component-tool";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
type MenuItem = Required<MenuProps>["items"][number];

// const items: MenuItem[] = [
//     {
//         key: 'sub1',
//         label: '订单中心',
//         icon: <AppstoreOutlined />,
//         children: [
//             { key: '1', label: '我的订单' },
//             { key: '2', label: '售后列表' },
//         ],
//     },
//     {
//         type: 'divider',
//     },
//     {
//         key: 'sub2',
//         label: '用户中心',
//         icon: <SettingOutlined />,
//         children: [
//             { key: '9', label: '收货地址' },
//         ],
//     },
// ];

const App: React.FC = () => {
  const { pathname } = useLocation();
  const [stateOpenKeys, setStateOpenKeys] = useState([]);
  const _menuChildren = useModuleRootContext((s) => s.rootStore._menuChildren);
  const [items, setItems] = React.useState<MenuItem[]>([]);
  const { navigator } = useNavigateImpl();
  useEffect(() => {
    const listObj = groupBy(_menuChildren, "modelPcode");
    const list = listObj.userCenter.map((item) => {
      return {
        key: item.menuOpcode,
        label: item.modelName,
        icon: <AppstoreOutlined />,
        ...(listObj[item.menuOpcode] && {
          children: listObj[item.menuOpcode]
            .filter((c) => c.menuShow !== 1)
            .map((i) => ({
              key: `/userCenter/${i.menuOpcode}`,
              label: i.modelName,
            })),
        }),
      };
    });
    setStateOpenKeys(list.map((item) => item.key));
    setItems(list);
  }, [_menuChildren]);

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    setStateOpenKeys(keys);
  };
  const onClick: MenuProps["onClick"] = (openKeys) => {
    navigator(openKeys.key);
  };

  return (
    <Menu
      selectedKeys={[pathname]}
      onClick={onClick}
      onOpenChange={onOpenChange}
      style={{ width: "100%" }}
      openKeys={stateOpenKeys}
      mode="inline"
      items={items}
    />
  );
};

export const MenuComponent = HOCCodeWrapComponent(App);
