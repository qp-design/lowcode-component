import { Descriptions } from "antd";
import { Container, Element } from "@brushes/component-core";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { useMemo } from "react";
import { Text } from "../../basic";

const DescriptionJsx = ({
  listConfig,
  padding,
  margin,
  ...props
}: {
  padding?: object;
  margin?: object;
  listConfig: Array<any>;
}) => {
  const items = useMemo(() => {
    return listConfig.map((item: any, index: number) => {
      return {
        key: index,
        label: item.label || item.key,
        children: (
          <Element canvas id={item.key || item.label} is={Container}>
            <Text />
          </Element>
        ),
      };
    });
  }, [listConfig]);

  return (
    <Descriptions {...props} items={items} style={{ ...margin, ...padding }} />
  );
};
export const DescriptionComponent = HOCCodeWrapComponent(DescriptionJsx);
