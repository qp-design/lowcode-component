import { Container, useModuleRootContext } from "@brushes/component-core";
import { Badge, Tabs } from "antd";
import { useMemo, useRef } from "react";
import { Element } from "@brushes/component-core";
import { useSearchParamHook } from "@brushes/component-store-web";

type TabPosition = "left" | "right" | "top" | "bottom";

export const BadgeJsx = ({ padding, code, label, ...props }: any) => {
  const _orderCount =
    useModuleRootContext((s) => s.rootStore._orderCount) || {};
  return (
    <Badge size="small" count={_orderCount[code] || 0}>
      <div style={{ ...padding, ...props }}>{label}</div>
    </Badge>
  );
};

export const Tab = ({
  columns,
  tabPosition,
  destroyOnHidden,
  badge,
  padding = {},
  ...props
}: {
  badge?: boolean;
  padding: object;
  destroyOnHidden: boolean;
  columns: any;
  tabPosition: TabPosition;
}) => {
  const [title] = useSearchParamHook(["label"]);
  const defaultActiveKey = useRef();
  const newColumns = useMemo(() => {
    return columns.map(({ label, key, code }: any, ind: number) => {
      if (title === label) {
        defaultActiveKey.current = key;
      }
      return {
        key: key || label,
        label: badge ? (
          <BadgeJsx code={code} label={label} padding={padding} props={props} />
        ) : (
          <div style={{ ...padding, ...props }}>{label}</div>
        ),
        children: <Element canvas id={key || label} is={Container}></Element>,
      };
    });
  }, [columns, badge]);

  return (
    <Tabs
      defaultActiveKey={defaultActiveKey.current}
      destroyOnHidden={destroyOnHidden}
      tabPosition={tabPosition}
      items={newColumns}
    />
  );
};
