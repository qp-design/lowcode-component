import { Button, Space } from "antd";
import React, { Fragment } from "react";
import { isEmpty, noop } from "lodash";

export type ButtonTypePlus = {
  dataState?: Array<number | string> | string;
  idKey?: "dataState" | string; //数据状态对应key
  type?: "primary" | "dashed" | "link" | "text" | "default";
  render?: () => JSX.Element;
  code?: string;
  name?: string;
  [key: string]: any;
};

export const TableAction: React.FC<{
  buttonList: ButtonTypePlus[];
  direction?: "vertical" | "horizontal";
  record?: any;
  onClick?: (type: string, record: any) => void;
}> = ({ buttonList, direction = "horizontal", record, onClick = noop }) => {
  return (
    <div className={"action"}>
      {buttonList
        .filter((item) => !isEmpty(item))
        .map(
          (
            {
              type = "link",
              render,
              code,
              name,
              idKey = "dataState",
              dataState,
              ...restProps
            },
            index: number,
          ) => {
            if (dataState && !dataState.includes(record[idKey] + "")) {
              return null;
            }
            if (typeof render === "function") {
              return (
                <Fragment key={index}>
                  {React.createElement(render, { record, onClick, name, code })}
                </Fragment>
              );
            }
            return (
              <Fragment key={index}>
                <Button
                  type={type}
                  onClick={() => onClick(code, record)}
                  style={{ padding: 0 }}
                  {...restProps}
                >
                  {name}
                </Button>
              </Fragment>
            );
          },
        )}
    </div>
  );
};
