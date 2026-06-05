import { useMemo } from "react";
import { HOCCodeWrapComponent } from "@brushes/core-transform";
import { useModuleContext } from "@brushes/component-core";
import { Statistic } from "antd";
import { get } from "lodash";

type TextProps = {
  precision: number;
  code: string;
  storeKey: string;
  [v: string]: any;
};

const Amount: React.FC<TextProps> = ({
  precision = 2,
  storeKey,
  code,
  suffix,
  prefix,
  title,
  decimalSeparator,
  ...restProps
}) => {
  const dataInfo = useModuleContext((s) => s.moduleStore[storeKey]) || {};
  const value = useMemo(() => {
    if (code) {
      return get(dataInfo, code) ?? 0;
    }
    if (typeof dataInfo !== "object" && dataInfo) {
      return dataInfo;
    }
    return 0;
  }, [code, dataInfo]);
  console.log(36, value);
  return (
    <Statistic
      suffix={suffix}
      prefix={prefix}
      title={title}
      decimalSeparator={decimalSeparator}
      valueStyle={restProps}
      value={value}
      precision={precision}
    />
  );
};

export const NumberComponent = HOCCodeWrapComponent(Amount);
