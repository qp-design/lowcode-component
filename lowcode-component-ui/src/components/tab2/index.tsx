import { Container, useModuleContext, Element } from "@brushes/component-core";
import { Tabs } from "antd";
import { get } from "lodash";
import { useMemo, useRef } from "react";
import { useSearchParamHook } from "@brushes/component-store-web";

type TabPosition = "left" | "right" | "top" | "bottom";

export const AutoTab = ({
  columns,
  keyName,
  tabPosition,
  destroyOnHidden,
  storeKey,
  padding = {},
  ...props
}: {
  keyName: string;
  storeKey: string;
  padding: object;
  destroyOnHidden: boolean;
  columns: any;
  tabPosition: TabPosition;
}) => {
  const [title] = useSearchParamHook(["label"]);
  const defaultActiveKey = useRef();
  const store = useModuleContext((s) => s.moduleStore[storeKey]) || {};

  const newColumns = useMemo(() => {
    return columns
      .filter((c: any) => {
        const value = get(store, keyName, "");
        return (c.code && c.code.split(",").includes(value + "")) || !c.code;
      })
      .map(({ label, key }: any, ind: number) => {
        if (title === label) {
          defaultActiveKey.current = key;
        }
        return {
          key,
          label: <div style={{ ...padding, ...props }}>{label}</div>,
          children: <Element canvas id={key} is={Container}></Element>,
        };
      });
  }, [columns, store]);

  return (
    <Tabs
      defaultActiveKey={defaultActiveKey.current}
      destroyOnHidden={destroyOnHidden}
      tabPosition={tabPosition}
      items={newColumns}
    />
  );
};
