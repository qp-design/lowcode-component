import {
  Container,
  Element,
  ModuleProvider,
  useModuleContext,
} from "@brushes/component-core";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { useComponentListData } from "@brushes/component-store-web";
import { Empty } from "antd";

const CommmonJsx = ({
  padding,
  background,
  list,
  margin = {},
}: {
  item: any;
  background: string;
  margin: object;
  padding: object;
  list: Array<{ name: string; width: number }>;
}) => {
  return (
    <div
      style={{
        ...padding,
        ...margin,
        background,
        display: "flex",
        alignItems: "center",
      }}
    >
      {list.map((item, i) => (
        <Element
          width={item.width}
          key={item.width + i}
          alignItems={"center"}
          flexDirection={"row"}
          is={Container}
          id={`${item.width}${i}_common-item`}
          canvas
        ></Element>
      ))}
    </div>
  );
};

export const CommmonItem = HOCCodeWrapComponent(CommmonJsx);

const CommonList = ({
  dataPath,
  storeKey,
  maxNum,
  num = 1,
  description,
  gap = 0,
  defaultKey,
  padding = {},
}: any) => {
  const list = useComponentListData(dataPath, storeKey);
  const store = useModuleContext((s) => s.moduleStore);
  if (list.length === 0) {
    return (
      <div style={{ padding: "5px 0 5px 0" }}>
        <Element canvas is={Container} id={"empty"}>
          <Empty description={description} />
        </Element>
      </div>
    );
  }
  console.log('====>', list);
  return (
    <div
      style={{
        ...padding,
        display: "grid",
        gap,
        gridTemplateColumns: `repeat(${num}, 1fr)`,
      }}
    >
      {list.slice(0, maxNum || list.length).map((item, index) => (
        <ModuleProvider
          key={item[defaultKey] || index}
          moduleStore={{ ...store, _skuInfo: item }}
        >
          <Element is={CommmonItem} id={"common-item"} canvas />
        </ModuleProvider>
      ))}
    </div>
  );
};

export const CommonListComponent = HOCCodeWrapComponent(CommonList);
